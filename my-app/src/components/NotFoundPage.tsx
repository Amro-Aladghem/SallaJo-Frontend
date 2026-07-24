interface Props {
  message?: string;
}

export default function NotFoundPage({ message = 'لم يتم العثور على أية منتجات لك' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-16">
      <img src="/notfoundthing.png" alt="غير موجود" className="h-32 w-auto" />
      <p className="text-lg font-bold text-gray-900 text-center">{message}</p>
    </div>
  );
}
