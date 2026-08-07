export interface StoreInfoForSellerDto {
  id: string;
  name: string;
  logoImageUrl: string;
  primaryColorId: number;
  secondaryColorId: number;
  description: string;
  governorateId: number;
  phoneNumber: string;
  email: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  welcomeHeaderText: string | null;
  coverStoreImageLink: string | null;
  isActivatedStore: boolean | null;
  countryId: number | null;
  slug: string | null;
  isCompletedStoreProfile: boolean;
  isAcceptedToShowStoke: boolean;
  contactTypeId: number;
}
