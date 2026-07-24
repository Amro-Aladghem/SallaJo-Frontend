import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import { SellerService } from '@/services/SellerService';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const { setSeller } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const personJson = sessionStorage.getItem('person');
      if (!personJson) {
        navigate('/seller/sign-in', { replace: true });
        return;
      }

      const person = JSON.parse(personJson);

      console.log(person);
      if (person.isActive) {
         console.log("here"+person);
        const result = await SellerService.getAuthInfo();
        if (!cancelled && result.isSuccess) {
          setSeller(result.data);
        }
      }

      if (!cancelled) {
        navigate('/seller/dashboard', { replace: true });
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [navigate, setSeller]);

  return <Loader />;
}
