export interface Menu {
  id: string;
  name: string;
  price: number;
  isBest: boolean;
  isRecommended?: boolean;
  isPremium?: boolean;
  isSeason?: boolean;
}
