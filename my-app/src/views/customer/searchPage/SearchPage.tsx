import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductController } from '@/services/ProductController';
import type { ProductSimpleInfoDto } from '@/types/dtos';
import { getCustomerStore } from '@/libs/customerStorage';
import Loading from '@/components/Loader';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';

export default function SearchPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ProductSimpleInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const store = getCustomerStore();

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    const result = await ProductController.searchProducts(searchText.trim(), slug);
    if (result.isSuccess) {
      setResults(result.data);
    } else {
      setResults([]);
    }
    setSearched(true);
    setLoading(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        <img src={store?.logoImageUrl} alt={store?.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
        <h1 className="font-bold text-base text-gray-900 truncate">{store?.name}</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2">
          <Input
            dir="rtl"
            placeholder="ابحث باسم المنتج..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading || !searchText.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : searched ? (
          results.length === 0 ? (
            <p className="text-center text-gray-400 py-8">لا توجد نتائج مطابقة</p>
          ) : (
            <>
              <h2 className="font-bold text-gray-900">نتائج البحث</h2>
              <div className="grid grid-cols-2 gap-3">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSeller={false}
                    isClickable
                    linkTo={`/store/${slug}/products/${product.id}`}
                  />
                ))}
              </div>
            </>
          )
        ) : (
          <p className="text-center text-gray-400 py-8 text-sm">اكتب اسم المنتج واضغط بحث</p>
        )}
      </div>
    </>
  );
}