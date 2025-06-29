export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'facebook' | 'discord' | 'google';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PetBox {
  id: string;
  productId: string;
  productName: string;
  purchaseDate: Date;
  isOpened: boolean;
  pet?: Pet; // The pet inside the box (only set when opened)
}

export interface UserBag {
  userId: string;
  petBoxes: PetBox[];
  pets: Pet[]; // Collection of all pets from opened boxes
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  paymentIntentId?: string;
}

export interface SpinnerItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  probability: number;
}

export interface Pet {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical' | 'Divine' | 'Prismatic' | 'Unknown';
  image: string;
  probability: number;
  description: string;
}

export interface LineNotification {
  message: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
} 