import { Pet } from '../types';

interface APIPet {
  id?: string;
  name: string;
  rarity?: string;
  image?: string;
  probability?: number;
  description?: string;
}

interface APIResponse {
  pets?: APIPet[];
  success?: boolean;
  error?: string;
}

class PetService {
  private cachedPets: Pet[] | null = null;
  private readonly API_URL = 'https://api.joshlei.com/v2/growagarden/info/';

  async fetchPetsFromAPI(): Promise<Pet[]> {
    try {
      console.log('Fetching pets from API:', this.API_URL);
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      console.log('API Response:', data);

      if (data && data.pets && Array.isArray(data.pets)) {
        const pets: Pet[] = data.pets.map((pet: APIPet, index: number) => ({
          id: pet.id || pet.name || `pet_${index}`,
          name: pet.name,
          rarity: this.normalizeRarity(pet.rarity || 'Common'),
          image: pet.image || this.getDefaultImage(pet.rarity || 'Common'),
          probability: pet.probability || this.getDefaultProbability(pet.rarity || 'Common'),
          description: pet.description || `A ${pet.rarity || 'Common'} pet from Grow a Garden`
        }));

        console.log('Processed pets:', pets);
        return pets;
      }

      console.warn('No pets found in API response, using fallback');
      return this.getFallbackPets();
      
    } catch (error) {
      console.error('Error fetching pets from API:', error);
      return this.getFallbackPets();
    }
  }

  private normalizeRarity(rarity: string): "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical" | "Divine" | "Prismatic" | "Unknown" {
    const rarityMap: { [key: string]: "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical" | "Divine" | "Prismatic" | "Unknown" } = {
      'common': 'Common',
      'uncommon': 'Uncommon',
      'rare': 'Rare',
      'legendary': 'Legendary',
      'mythical': 'Mythical',
      'divine': 'Divine',
      'prismatic': 'Prismatic'
    };
    
    return rarityMap[rarity.toLowerCase()] || 'Unknown';
  }

  private getDefaultImage(rarity: string): string {
    const imageMap: { [key: string]: string } = {
      'Common': '🐱',
      'Uncommon': '🦊',
      'Rare': '🐉',
      'Legendary': '🐋',
      'Mythical': '⭐',
      'Divine': '👼',
      'Prismatic': '💎'
    };
    
    return imageMap[rarity] || '🐾';
  }

  private getDefaultProbability(rarity: string): number {
    const probabilityMap: { [key: string]: number } = {
      'Common': 0.4,
      'Uncommon': 0.25,
      'Rare': 0.2,
      'Legendary': 0.1,
      'Mythical': 0.03,
      'Divine': 0.015,
      'Prismatic': 0.005
    };
    
    return probabilityMap[rarity] || 0.1;
  }

  private getFallbackPets(): Pet[] {
    return [
      // Common pets (40% probability)
      { id: '1', name: 'Common Cat', rarity: 'Common', image: '🐱', probability: 0.4, description: 'A friendly common cat' },
      { id: '2', name: 'Common Dog', rarity: 'Common', image: '🐕', probability: 0.4, description: 'A loyal common dog' },
      { id: '3', name: 'Common Bird', rarity: 'Common', image: '🐦', probability: 0.4, description: 'A cheerful common bird' },
      { id: '4', name: 'Common Fish', rarity: 'Common', image: '🐠', probability: 0.4, description: 'A swimming common fish' },
      
      // Uncommon pets (25% probability)
      { id: '5', name: 'Uncommon Fox', rarity: 'Uncommon', image: '🦊', probability: 0.25, description: 'A clever uncommon fox' },
      { id: '6', name: 'Uncommon Rabbit', rarity: 'Uncommon', image: '🐰', probability: 0.25, description: 'A quick uncommon rabbit' },
      { id: '7', name: 'Uncommon Bear', rarity: 'Uncommon', image: '🐻', probability: 0.25, description: 'A strong uncommon bear' },
      { id: '8', name: 'Uncommon Deer', rarity: 'Uncommon', image: '🦌', probability: 0.25, description: 'A graceful uncommon deer' },
      
      // Rare pets (20% probability)
      { id: '9', name: 'Rare Dragon', rarity: 'Rare', image: '🐉', probability: 0.2, description: 'A powerful rare dragon' },
      { id: '10', name: 'Rare Phoenix', rarity: 'Rare', image: '🦅', probability: 0.2, description: 'A majestic rare phoenix' },
      { id: '11', name: 'Rare Unicorn', rarity: 'Rare', image: '🦄', probability: 0.2, description: 'A magical rare unicorn' },
      { id: '12', name: 'Rare Griffin', rarity: 'Rare', image: '🦁', probability: 0.2, description: 'A noble rare griffin' },
      
      // Legendary pets (10% probability)
      { id: '13', name: 'Legendary Leviathan', rarity: 'Legendary', image: '🐋', probability: 0.1, description: 'A massive legendary leviathan' },
      { id: '14', name: 'Legendary Kraken', rarity: 'Legendary', image: '🦑', probability: 0.1, description: 'A fearsome legendary kraken' },
      { id: '15', name: 'Legendary Hydra', rarity: 'Legendary', image: '🐍', probability: 0.1, description: 'A multi-headed legendary hydra' },
      
      // Mythical pets (3% probability)
      { id: '16', name: 'Mythical Celestial', rarity: 'Mythical', image: '⭐', probability: 0.03, description: 'A divine mythical celestial being' },
      { id: '17', name: 'Mythical Void', rarity: 'Mythical', image: '🌌', probability: 0.03, description: 'An enigmatic mythical void creature' },
      
      // Divine pets (1.5% probability)
      { id: '18', name: 'Divine Guardian', rarity: 'Divine', image: '👼', probability: 0.015, description: 'A sacred divine guardian' },
      { id: '19', name: 'Divine Seraph', rarity: 'Divine', image: '😇', probability: 0.015, description: 'A holy divine seraph' },
      
      // Prismatic pets (0.5% probability)
      { id: '20', name: 'Prismatic Crystal', rarity: 'Prismatic', image: '💎', probability: 0.005, description: 'A rare prismatic crystal entity' }
    ];
  }

  async getPets(): Promise<Pet[]> {
    if (this.cachedPets) {
      return this.cachedPets;
    }
    
    this.cachedPets = await this.fetchPetsFromAPI();
    return this.cachedPets;
  }

  getRandomPets(count: number): Pet[] {
    const pets = this.cachedPets || this.getFallbackPets();
    
    const result: Pet[] = [];
    const usedIndices = new Set<string>();
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let selectedPet: Pet;
      
      do {
        // Weighted random selection based on probability
        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedIndex = 0;
        
        for (let j = 0; j < pets.length; j++) {
          cumulativeProbability += pets[j].probability;
          if (random <= cumulativeProbability) {
            selectedIndex = j;
            break;
          }
        }
        
        selectedPet = pets[selectedIndex];
        attempts++;
      } while (usedIndices.has(selectedPet.id) && attempts < 100);
      
      if (attempts >= 100) {
        // If we can't find a unique pet, just pick any random one
        selectedPet = pets[Math.floor(Math.random() * pets.length)];
      }
      
      result.push(selectedPet);
      usedIndices.add(selectedPet.id);
    }
    
    return result;
  }

  async initialize(): Promise<void> {
    try {
      await this.getPets();
    } catch (error) {
      console.error('Failed to initialize pets:', error);
    }
  }

  clearCache(): void {
    this.cachedPets = null;
  }
}

export const petService = new PetService(); 