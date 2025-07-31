import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <Dialog.Panel className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-sm w-full z-50 relative">
        <Dialog.Title className="text-lg font-semibold mb-2">{title}</Dialog.Title>
        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {message}
        </Dialog.Description>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            No
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}