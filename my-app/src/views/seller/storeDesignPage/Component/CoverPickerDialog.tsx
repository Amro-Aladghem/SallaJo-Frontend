import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import coverImages from '@/assets/Data/coverImages';

const PAGE_SIZE = 5;

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function CoverPickerDialog({ open, onClose, onSelect }: Props) {
  const [page, setPage] = useState(1);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPage(1);
      setSelectedUrl(null);
    }
  }, [open]);

  const visibleCount = page * PAGE_SIZE;
  const visibleImages = coverImages.slice(0, visibleCount);
  const hasMore = visibleCount < coverImages.length;

  const loadMore = () => {
    setPage((p) => p + 1);
  };

  const handleSelect = (filename: string) => {
    setSelectedUrl(`/cover_images/${encodeURIComponent(filename)}`);
  };

  const handleConfirm = () => {
    if (selectedUrl) onSelect(selectedUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-[95vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 pb-2 sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <DialogClose className="rounded-full hover:bg-gray-100 p-1.5 transition-colors focus:outline-none">
              <X className="h-4 w-4 text-gray-500" />
            </DialogClose>
            <DialogTitle className="text-lg font-bold text-gray-900">اختر صورة الغلاف</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-4 py-4 space-y-4">
          {/* Preview */}
          {selectedUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img src={selectedUrl} alt="" className="w-full object-cover" style={{ aspectRatio: '16 / 6' }} />
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visibleImages.map((filename) => {
              const url = `/cover_images/${encodeURIComponent(filename)}`;
              const name = filename.replace('.png', '').replace('.jpg', '').replace('.jpeg', '');
              const isSelected = selectedUrl === url;
              return (
                <button
                  key={filename}
                  onClick={() => handleSelect(filename)}
                  className={`rounded-xl border-2 overflow-hidden text-right transition-colors ${
                    isSelected ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full aspect-[16/6] bg-gray-100">
                    <img src={url} alt={name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="px-2 py-1.5">
                    <span className="text-[11px] text-gray-700 font-medium line-clamp-1">{name}</span>
                  </div>
                </button>
              );
            })}
            {hasMore && (
              <button
                onClick={loadMore}
                className="rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors text-xs min-h-[80px]"
              >
                عرض المزيد
              </button>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedUrl}
            className="w-full bg-primary text-white h-11 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            اختيار
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
