export default function LoadingBackground() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-100"></div>
    </div>
  );
}

