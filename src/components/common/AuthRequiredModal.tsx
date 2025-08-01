import React from "react";
import { Button } from "../ui/Button";

export default function AuthRequiredModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <h2 className="text-xl text-center font-bold text-gray-800 mb-3">Signup Required</h2>
        <p className="text-gray-600 mb-5">
          You must be signed in to download notes.
        </p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">Cancel</Button>
          <Button onClick={() => window.location.href = "/signup"}>Sign Up Now</Button>
        </div>
      </div>
    </div>
  );
}
