import { useContext, useCallback } from 'react';
import { UserAuthContext, type UserAuthInfo } from '@/contexts/UserAuthContext';
import type { PersonAuthResponseDto, SellerAuthInfoDto, StoreInfoForSellerDto } from '@/types/dtos';

export function useAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a UserAuthProvider');
  }

  const { user, setUser, logout } = context;

  const setPerson = useCallback((person: PersonAuthResponseDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, person };
      sessionStorage.setItem('person', JSON.stringify(person));
      return updated;
    });
  }, [setUser]);

  const setSeller = useCallback((seller: SellerAuthInfoDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, seller };
      sessionStorage.setItem('seller', JSON.stringify(seller));
      return updated;
    });
  }, [setUser]);

  const setStore = useCallback((store: StoreInfoForSellerDto) => {
    setUser((prev: UserAuthInfo) => {
      const updated = { ...prev, store };
      sessionStorage.setItem('store', JSON.stringify(store));
      return updated;
    });
  }, [setUser]);

  return {
    user,
    logout,
    setPerson,
    setSeller,
    setStore,
    setUser,
  };
}
