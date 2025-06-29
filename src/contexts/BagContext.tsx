import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserBag, PetBox, Pet } from '../types';
import { petService } from '../services/petService';
import { useAuth } from './AuthContext';

interface BagContextType {
  userBag: UserBag | null;
  addPetBoxes: (productId: string, productName: string, quantity: number) => void;
  openPetBox: (boxId: string) => Promise<Pet>;
  getRandomPet: () => Pet;
  addPetToCollection: (pet: Pet, boxId: string) => void;
  getUnopenedBoxes: () => PetBox[];
  getOpenedBoxes: () => PetBox[];
  getAllPets: () => Pet[];
  clearBag: () => void;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};

interface BagProviderProps {
  children: ReactNode;
}

export const BagProvider: React.FC<BagProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userBag, setUserBag] = useState<UserBag | null>(null);

  // Initialize pets from API when the provider mounts
  useEffect(() => {
    petService.initialize().catch((error: Error) => {
      console.error('Failed to initialize pets:', error);
    });
  }, []);

  // Load bag from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedBag = localStorage.getItem(`userBag_${user.id}`);
      if (savedBag) {
        const parsedBag = JSON.parse(savedBag);
        // Convert date strings back to Date objects
        parsedBag.petBoxes = parsedBag.petBoxes.map((box: any) => ({
          ...box,
          purchaseDate: new Date(box.purchaseDate)
        }));
        setUserBag(parsedBag);
      } else {
        // Create new bag for user
        setUserBag({
          userId: user.id,
          petBoxes: [],
          pets: []
        });
      }
    } else {
      setUserBag(null);
    }
  }, [user]);

  // Save bag to localStorage whenever it changes
  useEffect(() => {
    if (userBag && user) {
      localStorage.setItem(`userBag_${user.id}`, JSON.stringify(userBag));
    }
  }, [userBag, user]);

  const addPetBoxes = (productId: string, productName: string, quantity: number) => {
    if (!userBag) return;

    const newBoxes: PetBox[] = [];
    for (let i = 0; i < quantity; i++) {
      newBoxes.push({
        id: `${productId}_${Date.now()}_${i}`,
        productId,
        productName,
        purchaseDate: new Date(),
        isOpened: false
      });
    }

    setUserBag(prev => prev ? {
      ...prev,
      petBoxes: [...prev.petBoxes, ...newBoxes]
    } : null);
  };

  const openPetBox = async (boxId: string): Promise<Pet> => {
    if (!userBag) {
      throw new Error('No bag found');
    }

    const box = userBag.petBoxes.find(b => b.id === boxId);
    if (!box) {
      throw new Error('Box not found');
    }

    if (box.isOpened) {
      throw new Error('Box already opened');
    }

    // Get a random pet
    const randomPets = petService.getRandomPets(1);
    const pet = randomPets[0];

    // Update the bag
    const updatedBag: UserBag = {
      ...userBag,
      petBoxes: userBag.petBoxes.map(b => 
        b.id === boxId 
          ? { ...b, isOpened: true, openedAt: new Date() }
          : b
      ),
      pets: [...userBag.pets, pet]
    };

    setUserBag(updatedBag);
    localStorage.setItem(`userBag_${user?.id}`, JSON.stringify(updatedBag));

    return pet;
  };

  const getRandomPet = (): Pet => {
    const randomPets = petService.getRandomPets(1);
    return randomPets[0];
  };

  const addPetToCollection = (pet: Pet, boxId: string) => {
    if (!userBag) {
      throw new Error('No bag found');
    }

    const updatedBag: UserBag = {
      ...userBag,
      petBoxes: userBag.petBoxes.map(b => 
        b.id === boxId 
          ? { ...b, isOpened: true, openedAt: new Date() }
          : b
      ),
      pets: [...userBag.pets, pet]
    };

    setUserBag(updatedBag);
    localStorage.setItem(`userBag_${user?.id}`, JSON.stringify(updatedBag));
  };

  const getUnopenedBoxes = (): PetBox[] => {
    return userBag?.petBoxes.filter(box => !box.isOpened) || [];
  };

  const getOpenedBoxes = (): PetBox[] => {
    return userBag?.petBoxes.filter(box => box.isOpened) || [];
  };

  const getAllPets = (): Pet[] => {
    return userBag?.pets || [];
  };

  const clearBag = () => {
    setUserBag(null);
    if (user) {
      localStorage.removeItem(`userBag_${user.id}`);
    }
  };

  const value = {
    userBag,
    addPetBoxes,
    openPetBox,
    getRandomPet,
    addPetToCollection,
    getUnopenedBoxes,
    getOpenedBoxes,
    getAllPets,
    clearBag
  };

  return (
    <BagContext.Provider value={value}>
      {children}
    </BagContext.Provider>
  );
}; 