import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const WA_NUMBER = '962796102413';

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [person, setPerson] = useState(user.person);

  useEffect(() => {
    const personJson = sessionStorage.getItem('person');
    if (!personJson) {
      navigate('/seller/sign-in', { replace: true });
      return;
    }
    const p = JSON.parse(personJson);
    setPerson(p);
  }, [navigate]);

  const handleChat = () => {
    if (person.isActive) {
      window.open(`https://wa.me/${WA_NUMBER}`, '_blank');
    } else {
      const msg = encodeURIComponent(
        `مرحبا فريق سلة جو , اريد كود تفعيل حسابي المجاني لأنشاء المتجر رقم معرفي: ${person.sysId}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <img src="/support.png" alt="الدعم الفني" className="w-50 h-35 mx-auto" />

        {person.isActive ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-relaxed">
              تواصل مع الدعم الفني<br />لـ سلة جو
            </h1>
            <p className="text-gray-600 text-base leading-loose">
              نعمل لأجلك واستفساراتك نحب سماعها
              رد فوري  خلال اقل من دقيقة 
              على مدار اليوم 
              <br />
              فخذ راحتك وراسلنا
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-relaxed">
              تواصل الأن مع<br />الدعم الفني لسلة جو
            </h1>
            <p className="text-gray-600 text-base leading-loose">
              لأعطائك كود تفعيل حسابك كبائع
              <br />
              وتستطيع إنشاء المتجر الخاص بك
            </p>
            <p className="text-green-600 font-semibold text-base">
              مجانا لا يوجد عملية دفع
              <br />
              الكود سوف يعطى مجانا 
            </p>
            <p className="text-gray-500 text-sm">
              الدعم الفني لأمكانية التحقق من شخصيتك فقط.
            </p>
            <p className="text-gray-700 font-medium text-base">
                  الأن خلال ثواني الرد
            </p>
          </div>
        )}

        <button
          onClick={handleChat}
          className="inline-flex items-center justify-center gap-3 bg-primary  text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg w-full"
        >
          <MessageCircle className="h-6 w-6" />
          تواصل مع موظف سلة جو
        </button>
      </div>
    </div>
  );
}
