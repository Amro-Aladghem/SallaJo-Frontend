export interface PersonAuthResponseDto {
  sysId: string;
  userId: string | null;
  fullName: string;
  imageUrl: string | null;
  isActive: boolean;
  userTypeId: number;
}
