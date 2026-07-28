import { MessageCircle } from 'lucide-react';

const WA_NUMBER = '962796102413';

export default function SupportSection() {
  const handleChat = () => {
    const msg = encodeURIComponent('مرحبا فريق سلة جو، أريد الاستفسار عن خدماتكم');
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <img src="/support.png" alt="الدعم الفني" className="w-50 h-35 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 leading-relaxed">
          تواصل مع خدمة العملاء<br />لـ سلة جو
        </h1>
        <p className="text-gray-600 text-base leading-loose">
          فريقنا جاهز للرد على استفساراتك
          <br />
          رد فوري خلال أقل من دقيقة
          <br />
          على مدار الساعة
        </p>
        <button
          onClick={handleChat}
          className="inline-flex items-center justify-center gap-3 bg-primary text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg w-full"
        >
          <MessageCircle className="h-6 w-6" />
          تواصل مع فريق سلة جو
        </button>
      </div>
    </div>
  );
}
