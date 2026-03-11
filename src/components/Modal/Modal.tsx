"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg"; // optional sizing
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[600px]",
  }[size];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 shadow-lg relative ${widthClass}`}>
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        {title && <h2 className="text-xl text-center font-bold mb-4">{title}</h2>}

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}