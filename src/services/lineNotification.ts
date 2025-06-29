import { LineNotification, Pet } from '../types';

class LineNotificationService {
  private static instance: LineNotificationService;
  private notifications: LineNotification[] = [];

  private constructor() {}

  static getInstance(): LineNotificationService {
    if (!LineNotificationService.instance) {
      LineNotificationService.instance = new LineNotificationService();
    }
    return LineNotificationService.instance;
  }

  async sendNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): Promise<void> {
    const notification: LineNotification = {
      message,
      timestamp: new Date(),
      type,
    };

    this.notifications.push(notification);

    // In a real application, you would integrate with Line Notify API
    // For now, we'll simulate the API call
    console.log(`[LINE NOTIFICATION] ${type.toUpperCase()}: ${message}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // You would typically make an HTTP request to Line Notify API like this:
    /*
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_LINE_NOTIFY_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `message=${encodeURIComponent(message)}`,
    });
    
    if (!response.ok) {
      throw new Error('Failed to send Line notification');
    }
    */
  }

  async sendPurchaseSuccessNotification(userName: string, orderTotal: number, items: string[]): Promise<void> {
    const message = `🎉 Purchase Successful!\n\nUser: ${userName}\nTotal: $${orderTotal.toFixed(2)}\nItems: ${items.join(', ')}\n\nThank you for your purchase!`;
    
    await this.sendNotification(message, 'success');
  }

  async sendSpinnerWinNotification(userName: string, itemName: string, rarity: string): Promise<void> {
    const message = `🎰 Loot Box!\n\nUser: ${userName}\nWon: ${itemName}\nRarity: ${rarity.toUpperCase()}\n\nCongratulations!`;
    
    await this.sendNotification(message, 'success');
  }

  async sendPetBoxPurchaseNotification(userName: string, pets: Pet[]): Promise<void> {
    const rarityCounts = pets.reduce((acc, pet) => {
      acc[pet.rarity] = (acc[pet.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const raritySummary = Object.entries(rarityCounts)
      .map(([rarity, count]) => `${rarity}: ${count}`)
      .join(', ');

    const topRarity = pets.reduce((highest, pet) => {
      const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical', 'Divine', 'Prismatic'];
      const currentIndex = rarityOrder.indexOf(pet.rarity);
      const highestIndex = rarityOrder.indexOf(highest.rarity);
      return currentIndex > highestIndex ? pet : highest;
    });

    const message = `🐾 Pet Box Opened!\n\nUser: ${userName}\nBox Contents: ${raritySummary}\n\nBest Pet: ${topRarity.name} (${topRarity.rarity})\n\n${pets.map(pet => `${pet.image} ${pet.name}`).join('\n')}\n\nEnjoy your new pets!`;
    
    await this.sendNotification(message, 'success');
  }

  getNotifications(): LineNotification[] {
    return [...this.notifications];
  }

  clearNotifications(): void {
    this.notifications = [];
  }
}

export const lineNotificationService = LineNotificationService.getInstance(); 