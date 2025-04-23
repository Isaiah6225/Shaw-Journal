export default function Popup({ isOpen, close, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 relative rounded-lg z-60">
        {children}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

