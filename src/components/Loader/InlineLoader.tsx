"use client";

export default function InlineLoader({ size = 6 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}