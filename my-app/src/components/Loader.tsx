export default function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        <img src="/sallahlogo.png" alt="سلة جو" className="h-16 w-auto" />
      </div>
    </div>
  );
}
