import { useState } from 'react';
import type { ProductImageDto } from '@/types/dtos';
import { ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';

interface Props {
  images: ProductImageDto[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  uploadingImageId?: string | null;
  onChangeImage?: (imageId: string) => void;
  primaryImageLink?: string;
  onAddImage?: () => void;
  onAddImageFile?: (file: File) => void;
  isAddingImage?: boolean;
}

export default function ProductImagesSlider({
  images,
  selectedIndex,
  onSelect,
  uploadingImageId,
  onChangeImage,
  primaryImageLink,
  onAddImage,
  onAddImageFile,
  isAddingImage,
}: Props) {
  const [dragging, setDragging] = useState(false);

  if (images.length === 0) {
    if (!onAddImage && !onAddImageFile) {
      return (
        <div className="w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] mx-auto h-[280px] md:h-[350px] lg:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-sm text-gray-400">لا توجد صور</p>
        </div>
      );
    }

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onAddImage}
        onKeyDown={(e) => e.key === 'Enter' && onAddImage?.()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && onAddImageFile) onAddImageFile(file);
        }}
        className={`w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] mx-auto h-[280px] md:h-[350px] lg:h-[400px] rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${
          dragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary bg-gray-50'
        }`}
      >
        {isAddingImage ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-gray-500">جارٍ رفع الصورة...</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-primary" />
            <p className="text-sm text-gray-500">اسحب وأفلت الصورة هنا أو انقر للاختيار</p>
          </>
        )}
      </div>
    );
  }

  const current = images[selectedIndex];

  const prev = () => onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  const next = () => onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);

  const isUploading = uploadingImageId === current.id;

  return (
    <div className="w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] mx-auto">
      <div className="relative h-[280px] md:h-[350px] lg:h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={current.imageLink}
          alt={`صورة ${selectedIndex + 1}`}
          className={`w-full h-full object-contain ${isUploading ? 'opacity-40' : ''}`}
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {images.length > 1 && !isUploading && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {!isUploading && onChangeImage && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <button
              type="button"
              onClick={() => onChangeImage(current.id)}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              تغيير
            </button>
          </div>
        )}

        {primaryImageLink === current.imageLink && (
          <div className="absolute top-2 right-2 z-10 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            الصورة الرئيسية
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {images.length < 3 && (
        <div className="mt-3">
          <div
            role="button"
            tabIndex={0}
            onClick={onAddImage}
            onKeyDown={(e) => e.key === 'Enter' && onAddImage?.()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && onAddImageFile) onAddImageFile(file);
            }}
            className={`w-full h-12 rounded-lg border cursor-pointer flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              dragging
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10'
            }`}
          >
            {isAddingImage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جارٍ رفع الصورة...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>إضافة صورة</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
