export interface UpdateStoreInfoDto {
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
  isAcceptedToShowStoke: boolean;
}
