export interface StorePageInfoDto {
  name: string;
  logoImageUrl: string;
  primaryColorCode: string;
  secondaryColorCoded: string;
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
  isAcceptedToShowStoke: boolean;
  isHasDelivery: boolean;
}
