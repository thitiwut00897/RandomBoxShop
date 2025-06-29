import { Pet } from '../types';
import { petService } from '../services/petService';

export const getPetsFromAPI = async (): Promise<Pet[]> => {
  return await petService.getPets();
};

export const getRandomPets = (count: number): Pet[] => {
  return petService.getRandomPets(count);
};

export const initializePets = async (): Promise<void> => {
  await petService.initialize();
}; 