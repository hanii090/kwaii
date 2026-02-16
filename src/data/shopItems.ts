import type { CatBreed, ShopCatItem } from '../types';

// Legacy type alias for backward compat
export type ShopItem = ShopCatItem;

export const SHOP_CATS: ShopCatItem[] = [
  {
    id: 'cat_basic',
    breed: 'basic',
    name: 'Snowball',
    description: 'Your first kawaii friend',
    price: 0,
    category: 'common',
    emoji: '�',
  },
  {
    id: 'cat_cloud',
    breed: 'cloud',
    name: 'Cloud',
    description: 'Fluffy as a dream',
    price: 150,
    category: 'rare',
    emoji: '☁️',
  },
  {
    id: 'cat_cocoa',
    breed: 'cocoa',
    name: 'Cocoa',
    description: 'Sweet chocolate point',
    price: 200,
    category: 'epic',
    emoji: '🍫',
  },
  {
    id: 'cat_mochi',
    breed: 'mochi',
    name: 'Mochi',
    description: 'Colorful calico cutie',
    price: 250,
    category: 'epic',
    emoji: '🍡',
  },
  {
    id: 'cat_midnight_void',
    breed: 'midnight_void',
    name: 'Midnight Void',
    description: 'Mysterious dark beauty',
    price: 350,
    category: 'legendary',
    emoji: '🌑',
  },
];

// Legacy alias
export const SHOP_ITEMS = SHOP_CATS;

export function getCatByBreed(breed: CatBreed): ShopCatItem | undefined {
  return SHOP_CATS.find((c) => c.breed === breed);
}
