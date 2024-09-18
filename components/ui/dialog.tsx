// CustomDialog.tsx
import React, { ReactNode } from "react";
import { FiX } from "react-icons/fi"; // Close icon from react-icons

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg  w-[53dvh] md:max-w-2xl md:w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <FiX className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
          {children}
        </div>
      </div>
    </>
  );
};

export default CustomDialog;
