import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StoreViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white" dir="rtl" lang="ar">
      <div className="flex items-center h-12 px-3 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => navigate('/seller/dashboard')} className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="font-bold text-sm text-gray-900 mr-3">عرض المتجر</h1>
      </div>
      <iframe
        src={`/store/${slug}`}
        className="flex-1 w-full border-0"
        title="عرض المتجر"
      />
    </div>
  );
}
