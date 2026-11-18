"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const busy = loading || isSubmitting;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      showCloseButton={!busy}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={busy}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {busy ? "Please wait..." : confirmLabel}
          </Button>
        </>
      }
    >
      <span className="sr-only">Confirmation dialog</span>
    </Modal>
  );
}
