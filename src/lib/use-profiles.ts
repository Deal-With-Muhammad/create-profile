"use client";

import { get, set } from "idb-keyval";
import { useCallback, useEffect, useRef, useState } from "react";
import { createId, createInitialState, createMember } from "./defaults";
import type { DocSettings, Field, Member, ProfilesState } from "./types";

const STORAGE_KEY = "member-profiles:v1";

function isValid(value: unknown): value is ProfilesState {
  const s = value as ProfilesState | undefined;
  return (
    !!s &&
    Array.isArray(s.fields) &&
    Array.isArray(s.members) &&
    s.members.length > 0
  );
}

/**
 * State lives in IndexedDB: localStorage caps out around 5MB, which is only a
 * few dozen photos. Earlier versions used localStorage, so migrate once.
 */
async function load(): Promise<ProfilesState | null> {
  const saved = await get<ProfilesState>(STORAGE_KEY);
  if (isValid(saved)) return saved;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const legacy: unknown = raw ? JSON.parse(raw) : null;
    if (isValid(legacy)) {
      await set(STORAGE_KEY, legacy);
      localStorage.removeItem(STORAGE_KEY);
      return legacy;
    }
  } catch {
    // Corrupt or inaccessible legacy data: start fresh.
  }
  return null;
}

export type SaveStatus = "saved" | "failed";

export function useProfiles() {
  const [state, setState] = useState<ProfilesState>(createInitialState);
  const [selectedId, setSelectedId] = useState<string>(
    () => state.members[0].id,
  );
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const firstRun = useRef(true);

  // Restore after mount so server and client render the same first frame.
  useEffect(() => {
    let cancelled = false;
    load()
      .catch(() => null)
      .then((saved) => {
        if (cancelled) return;
        if (saved) {
          setState(saved);
          setSelectedId(saved.members[0].id);
        }
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      // Fails if the disk is full or storage is blocked (some private modes).
      set(STORAGE_KEY, state).then(
        () => setSaveStatus("saved"),
        () => setSaveStatus("failed"),
      );
    }, 400);
    return () => window.clearTimeout(id);
  }, [state, hydrated]);

  const update = useCallback(
    (fn: (s: ProfilesState) => ProfilesState) => setState(fn),
    [],
  );

  const selected =
    state.members.find((m) => m.id === selectedId) ?? state.members[0];

  const actions = {
    select: setSelectedId,

    addMember: () => {
      const member = createMember();
      update((s) => ({ ...s, members: [...s.members, member] }));
      setSelectedId(member.id);
    },

    duplicateMember: (id: string) => {
      const index = state.members.findIndex((m) => m.id === id);
      if (index < 0) return;
      const copy: Member = { ...state.members[index], id: createId() };
      update((s) => {
        const members = [...s.members];
        members.splice(index + 1, 0, copy);
        return { ...s, members };
      });
      setSelectedId(copy.id);
    },

    removeMember: (id: string) => {
      const index = state.members.findIndex((m) => m.id === id);
      if (index < 0) return;
      const remaining = state.members.filter((m) => m.id !== id);
      const members = remaining.length > 0 ? remaining : [createMember()];
      update((s) => ({ ...s, members }));
      setSelectedId(members[Math.min(index, members.length - 1)].id);
    },

    moveMember: (id: string, delta: -1 | 1) =>
      update((s) => {
        const from = s.members.findIndex((m) => m.id === id);
        const to = from + delta;
        if (from < 0 || to < 0 || to >= s.members.length) return s;
        const members = [...s.members];
        [members[from], members[to]] = [members[to], members[from]];
        return { ...s, members };
      }),

    setValue: (memberId: string, fieldId: string, value: string) =>
      update((s) => ({
        ...s,
        members: s.members.map((m) =>
          m.id === memberId
            ? { ...m, values: { ...m.values, [fieldId]: value } }
            : m,
        ),
      })),

    setPhoto: (memberId: string, photo: string | undefined) =>
      update((s) => ({
        ...s,
        members: s.members.map((m) =>
          m.id === memberId ? { ...m, photo } : m,
        ),
      })),

    setFields: (fields: Field[]) => update((s) => ({ ...s, fields })),

    setDoc: (patch: Partial<DocSettings>) =>
      update((s) => ({ ...s, doc: { ...s.doc, ...patch } })),

    reset: () => {
      const fresh = createInitialState();
      setState(fresh);
      setSelectedId(fresh.members[0].id);
    },
  };

  return { state, selected, hydrated, saveStatus, actions };
}

export type ProfilesActions = ReturnType<typeof useProfiles>["actions"];
