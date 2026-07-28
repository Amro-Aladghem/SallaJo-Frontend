import type {
  StoreInfoForSellerDto,
  SellerAuthInfoDto,
  PersonAuthResponseDto,
} from "@/types/dtos";

import {
  createContext,
  useState,
  useMemo,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export interface UserAuthInfo {
  person: PersonAuthResponseDto;
  seller?: SellerAuthInfoDto | null;
  store?: StoreInfoForSellerDto | null;
}

interface UserAuthContextType {
  user: UserAuthInfo;
  setUser: Dispatch<SetStateAction<UserAuthInfo>>;
  logout: () => void;
}

const defaultPerson: PersonAuthResponseDto = {
  sysId: "",
  userId: null,
  fullName: "",
  imageUrl: null,
  isActive: false,
  userTypeId: -1
};

const defaultUser: UserAuthInfo = {
  person: defaultPerson,
  seller: null,
  store: null,
};

export const UserAuthContext = createContext<UserAuthContextType | undefined>(
  undefined
);

export default function UserAuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<UserAuthInfo>(() => {
    const personJson = sessionStorage.getItem("person");
    const sellerJson = sessionStorage.getItem("seller");
    const storeJson = sessionStorage.getItem("store");

    const person: PersonAuthResponseDto = personJson
      ? JSON.parse(personJson)
      : defaultPerson;

    const seller: SellerAuthInfoDto | null = sellerJson
      ? JSON.parse(sellerJson)
      : null;

    const store: StoreInfoForSellerDto | null = storeJson
      ? JSON.parse(storeJson)
      : null;

    return {
      person,
      seller,
      store,
    };
  });

  const logout = () => {
    setUser(defaultUser);

    sessionStorage.removeItem("person");
    sessionStorage.removeItem("seller");
    sessionStorage.removeItem("store");
  };

  const contextValue = useMemo<UserAuthContextType>(() => ({
    user,
    setUser,
    logout,
  }), [user, setUser, logout]);

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}