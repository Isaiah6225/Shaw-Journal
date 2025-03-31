export default function PageBackground({ children = null }) {
  return (
    <div className="bg-primary min-h-screen">
      {children}
    </div>
  );
}
