import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SpinnerItem } from '../types';

interface SpinnerContextType {
  isSpinning: boolean;
  currentItem: SpinnerItem | null;
  spin: () => Promise<SpinnerItem>;
  resetSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (context === undefined) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
};

interface SpinnerProviderProps {
  children: ReactNode;
}

// Sample spinner items with different rarities
const spinnerItems: SpinnerItem[] = [
  // Common items (60% probability)
  { id: '1', name: 'Common Sword', rarity: 'common', image: '⚔️', probability: 0.6 },
  { id: '2', name: 'Basic Shield', rarity: 'common', image: '🛡️', probability: 0.6 },
  { id: '3', name: 'Simple Potion', rarity: 'common', image: '🧪', probability: 0.6 },
  { id: '4', name: 'Wooden Bow', rarity: 'common', image: '🏹', probability: 0.6 },
  
  // Rare items (25% probability)
  { id: '5', name: 'Magic Staff', rarity: 'rare', image: '🔮', probability: 0.25 },
  { id: '6', name: 'Steel Armor', rarity: 'rare', image: '🥋', probability: 0.25 },
  { id: '7', name: 'Healing Crystal', rarity: 'rare', image: '💎', probability: 0.25 },
  { id: '8', name: 'Enchanted Ring', rarity: 'rare', image: '💍', probability: 0.25 },
  
  // Epic items (10% probability)
  { id: '9', name: 'Dragon Scale', rarity: 'epic', image: '🐉', probability: 0.1 },
  { id: '10', name: 'Ancient Relic', rarity: 'epic', image: '🏺', probability: 0.1 },
  { id: '11', name: 'Phoenix Feather', rarity: 'epic', image: '🔥', probability: 0.1 },
  
  // Legendary items (5% probability)
  { id: '12', name: 'Excalibur', rarity: 'legendary', image: '⚜️', probability: 0.05 },
  { id: '13', name: 'Crown of Kings', rarity: 'legendary', image: '👑', probability: 0.05 },
  { id: '14', name: 'Infinity Stone', rarity: 'legendary', image: '💎', probability: 0.05 },
];

export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({ children }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentItem, setCurrentItem] = useState<SpinnerItem | null>(null);

  const getRandomItem = (): SpinnerItem => {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const item of spinnerItems) {
      cumulativeProbability += item.probability;
      if (random <= cumulativeProbability) {
        return item;
      }
    }
    
    // Fallback to common item
    return spinnerItems[0];
  };

  const spin = async (): Promise<SpinnerItem> => {
    setIsSpinning(true);
    
    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const wonItem = getRandomItem();
    setCurrentItem(wonItem);
    setIsSpinning(false);
    
    return wonItem;
  };

  const resetSpinner = () => {
    setCurrentItem(null);
  };

  const value = {
    isSpinning,
    currentItem,
    spin,
    resetSpinner,
  };

  return (
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  );
}; 