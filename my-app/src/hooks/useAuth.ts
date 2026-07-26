import { useContext } from 'react';
import { UserAuthContext, type UserAuthInfo } from '@/contexts/UserAuthContext';
import type { PersonAuthResponseDto, SellerAuthInfoDto, StoreInfoForSellerDto } from '@/types/dtos';

export function useAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a UserAuthProvider');
  }

  const { user, setUser, logout } = context;

  const setPerson = (person: PersonAuthResponseDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, person };
      sessionStorage.setItem('person', JSON.stringify(person));
      return updated;
    });
  };

  const setSeller = (seller: SellerAuthInfoDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, seller };
      sessionStorage.setItem('seller', JSON.stringify(seller));
      return updated;
    });
  };

  const setStore = (store: StoreInfoForSellerDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, store };
      sessionStorage.setItem('store', JSON.stringify(store));
      return updated;
    });
  };

  return {
    user,
    logout,
    setPerson,
    setSeller,
    setStore,
    setUser,
  };
}
