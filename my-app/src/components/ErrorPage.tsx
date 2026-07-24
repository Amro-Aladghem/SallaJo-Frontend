import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
      <img src="/error.png" alt="خطأ" className="h-32 w-auto" />
      <p className="text-lg font-bold text-gray-900 text-center">حدثت مشكلة ما حاول تحديث الصفحة</p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-2"
      >
        <RotateCcw className="ml-2 h-4 w-4" />
        تحديث الصفحة
      </Button>
    </div>
  );
}
