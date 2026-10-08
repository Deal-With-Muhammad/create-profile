"use client";

import { AlertDialog, Button } from "@heroui/react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  /** The trigger button. */
  children: ReactNode;
  heading: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  children,
  heading,
  body,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      {children}
      <AlertDialog.Backdrop>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            {({ close }) => (
              <>
                <AlertDialog.Header>
                  <AlertDialog.Heading>{heading}</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p className="text-sm text-neutral-600">{body}</p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => {
                      onConfirm();
                      close();
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </AlertDialog.Footer>
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
