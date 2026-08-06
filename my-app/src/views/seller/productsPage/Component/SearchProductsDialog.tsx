import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { ProductController } from '@/services/ProductController';
import type { ProductSimpleInfoDto } from '@/types/dtos';
import ProductCard from './ProductCard';
import Loader from '@/components/Loader';
import Toast from '@/components/ui/toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export default function SearchProductsDialog({ open, onClose, onSelectProduct }: Props) {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ProductSimpleInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });

  const showToast = (type: string, message: string) => setToast({ open: true, type, message });

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    const result = await ProductController.searchProducts(searchText.trim());
    if (result.isSuccess) {
      setResults(result.data);
    } else {
      showToast('error', 'فشل البحث');
    }
    setSearched(true);
    setLoading(false);
  };

  const reset = () => {
    setSearchText('');
    setResults([]);
    setLoading(false);
    setSearched(false);
  };

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            reset();
            onClose();
          }
        }}
      >
        <DialogContent className="max-w-[95vw] md:max-w-[600px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-gray-900">بحث عن منتج</DialogTitle>
              <DialogClose className="rounded-full hover:bg-gray-100 p-1.5 transition-colors focus:outline-none">
                <X className="h-4 w-4 text-gray-500" />
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="px-4 py-4 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <Input
                autoFocus
                dir="rtl"
                placeholder="ابحث باسم المنتج..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" disabled={loading || !searchText.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader />
              </div>
            ) : searched ? (
              results.length === 0 ? (
                <p className="text-center text-gray-400 py-8">لا توجد نتائج مطابقة</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSeller
                      onClick={() => {
                        onSelectProduct(product.id);
                        reset();
                      }}
                    />
                  ))}
                </div>
              )
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">اكتب اسم المنتج واضغط بحث</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}