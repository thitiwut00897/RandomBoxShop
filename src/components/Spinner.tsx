import React, { useState, useEffect } from 'react';
import { Gift, ArrowLeft, Star, Crown, Sparkles } from 'lucide-react';
import { useSpinner } from '../contexts/SpinnerContext';
import { useAuth } from '../contexts/AuthContext';
import { lineNotificationService } from '../services/lineNotification';
import { Pet } from '../types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Spinner: React.FC = () => {
  const { isSpinning, currentItem, spin, resetSpinner } = useSpinner();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [purchasedPets, setPurchasedPets] = useState<Pet[]>([]);
  const [showPurchasedPets, setShowPurchasedPets] = useState(false);
  const [revealedPets, setRevealedPets] = useState<number[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);

  useEffect(() => {
    // Check if there are purchased pets from localStorage
    const storedPets = localStorage.getItem('purchasedPets');
    if (storedPets) {
      const pets = JSON.parse(storedPets);
      setPurchasedPets(pets);
      setShowPurchasedPets(true);
      // Clear the stored pets after displaying them
      localStorage.removeItem('purchasedPets');
      
      // Start revealing pets one by one
      startPetReveal(pets);
    }
  }, []);

  const startPetReveal = (pets: Pet[]) => {
    setCurrentRevealIndex(0);
    setRevealedPets([]);
    
    // Reveal pets one by one with delays
    pets.forEach((_, index) => {
      setTimeout(() => {
        setRevealedPets(prev => [...prev, index]);
        setCurrentRevealIndex(index);
      }, index * 800); // 800ms delay between each pet reveal
    });
  };

  const handleSpin = async () => {
    if (!user) {
      toast.error('Please login to use the loot box!');
      return;
    }

    setShowResult(false);
    const wonItem = await spin();
    setShowResult(true);
    
    // Send Line notification
    try {
      await lineNotificationService.sendSpinnerWinNotification(
        user.name,
        wonItem.name,
        wonItem.rarity
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    toast.success(`Congratulations! You won ${wonItem.name}!`);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      case 'Common': return 'text-gray-600';
      case 'Uncommon': return 'text-blue-600';
      case 'Rare': return 'text-purple-600';
      case 'Legendary': return 'text-yellow-600';
      case 'Mythical': return 'text-orange-600';
      case 'Divine': return 'text-pink-600';
      case 'Prismatic': return 'text-rainbow';
      default: return 'text-gray-600';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100';
      case 'rare': return 'bg-blue-100';
      case 'epic': return 'bg-purple-100';
      case 'legendary': return 'bg-yellow-100';
      case 'Common': return 'bg-gray-100';
      case 'Uncommon': return 'bg-blue-100';
      case 'Rare': return 'bg-purple-100';
      case 'Legendary': return 'bg-yellow-100';
      case 'Mythical': return 'bg-orange-100';
      case 'Divine': return 'bg-pink-100';
      case 'Prismatic': return 'bg-gradient-to-r from-red-100 via-yellow-100 to-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'shadow-gray-300';
      case 'Uncommon': return 'shadow-blue-300';
      case 'Rare': return 'shadow-purple-300';
      case 'Legendary': return 'shadow-yellow-300';
      case 'Mythical': return 'shadow-orange-300';
      case 'Divine': return 'shadow-pink-300';
      case 'Prismatic': return 'shadow-rainbow';
      default: return 'shadow-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '⭐';
      case 'Uncommon': return '🌟';
      case 'Rare': return '💫';
      case 'Legendary': return '⚡';
      case 'Mythical': return '🔥';
      case 'Divine': return '👑';
      case 'Prismatic': return '💎';
      default: return '⭐';
    }
  };

  const handleBackToShop = () => {
    setShowPurchasedPets(false);
    setPurchasedPets([]);
    navigate('/products');
  };

  // Show purchased pets if available
  if (showPurchasedPets && purchasedPets.length > 0) {
    const totalPets = purchasedPets.length;
    const revealedCount = revealedPets.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-pink-500 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-yellow-500 rounded-full opacity-40 animate-spin"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="text-yellow-400 mr-3 animate-pulse" size={32} />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                🎉 PET BOX RESULTS!
              </h1>
              <Sparkles className="text-yellow-400 ml-3 animate-pulse" size={32} />
            </div>
            <p className="text-xl text-purple-200 mb-4">
              You got <span className="text-yellow-400 font-bold text-2xl">{totalPets}</span> amazing pets!
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-200">
              <span>Revealing pets:</span>
              <span className="text-yellow-400 font-bold">{revealedCount}/{totalPets}</span>
            </div>
          </div>

          {/* Pet Grid with Reveal Animation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {purchasedPets.map((pet, index) => {
              const isRevealed = revealedPets.includes(index);
              const isCurrent = currentRevealIndex === index;
              
              return (
                <div
                  key={`${pet.id}-${index}`}
                  className={`relative transform transition-all duration-700 ${
                    isRevealed 
                      ? 'scale-100 opacity-100' 
                      : 'scale-50 opacity-0'
                  } ${isCurrent ? 'animate-pulse' : ''}`}
                >
                  {/* Pet Card */}
                  <div className={`relative bg-white rounded-2xl shadow-2xl p-4 border-4 ${
                    isRevealed ? `${getRarityBg(pet.rarity)} border-${pet.rarity === 'Common' ? 'gray' : pet.rarity === 'Uncommon' ? 'blue' : pet.rarity === 'Rare' ? 'purple' : pet.rarity === 'Legendary' ? 'yellow' : pet.rarity === 'Mythical' ? 'orange' : pet.rarity === 'Divine' ? 'pink' : 'purple'}-400` : 'bg-gray-800 border-gray-600'
                  } hover:scale-105 transition-transform duration-300`}>
                    
                    {/* Rarity Badge */}
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                      isRevealed ? `${getRarityBg(pet.rarity)} ${getRarityColor(pet.rarity)}` : 'bg-gray-700 text-gray-300'
                    }`}>
                      {isRevealed ? pet.rarity : '???'}
                    </div>

                    {/* Pet Image */}
                    <div className="text-center mb-3">
                      <div className={`text-4xl mb-2 ${isRevealed ? '' : 'grayscale'}`}>
                        {isRevealed ? pet.image : '❓'}
                      </div>
                      <h3 className={`font-bold text-sm ${isRevealed ? getRarityColor(pet.rarity) : 'text-gray-400'}`}>
                        {isRevealed ? pet.name : 'Mystery Pet'}
                      </h3>
                    </div>

                    {/* Rarity Icon */}
                    {isRevealed && (
                      <div className="absolute -top-1 -left-1 text-lg">
                        {getRarityIcon(pet.rarity)}
                      </div>
                    )}

                    {/* Glow Effect */}
                    {isRevealed && (
                      <div className={`absolute inset-0 rounded-2xl ${getRarityGlow(pet.rarity)} opacity-50 blur-sm`}></div>
                    )}
                  </div>

                  {/* Reveal Animation */}
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl animate-bounce">
                        ✨
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rarity Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              📊 Rarity Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical', 'Divine', 'Prismatic'].map(rarity => {
                const count = purchasedPets.filter(pet => pet.rarity === rarity).length;
                return (
                  <div key={rarity} className="text-center">
                    <div className={`w-16 h-16 ${getRarityBg(rarity)} rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/20`}>
                      <span className="text-2xl">{getRarityIcon(rarity)}</span>
                    </div>
                    <p className={`font-bold ${getRarityColor(rarity)} mb-1`}>{rarity}</p>
                    <p className="text-white/80 text-sm">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToShop}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft size={20} className="inline mr-2" />
                Buy More Pet Boxes
              </button>
              <button
                onClick={() => {
                  setShowPurchasedPets(false);
                  setPurchasedPets([]);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                <Gift size={20} className="inline mr-2" />
                Try Loot Box
              </button>
            </div>
            
            {/* Celebration Message */}
            {revealedCount === totalPets && (
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl text-white font-bold text-xl animate-pulse">
                🎊 Congratulations! All pets revealed! 🎊
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular spinner interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎰 Loot Box
          </h1>
          <p className="text-lg text-gray-600">
            Try your luck and win amazing items!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Spinner Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-48 h-48 mx-auto border-8 border-purple-200 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  {isSpinning ? (
                    <div className="animate-spin text-4xl">🎰</div>
                  ) : (
                    <div className="text-4xl">🎰</div>
                  )}
                </div>
              </div>

              {!user ? (
                <div>
                  <div className="text-6xl mb-4">🔒</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Login Required
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You need to be logged in to use the loot box.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Login Now
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 disabled:transform-none"
                  >
                    {isSpinning ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        Spinning...
                      </>
                    ) : (
                      <>
                        <Gift size={24} className="inline mr-2" />
                        SPIN NOW!
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
            
            {showResult && currentItem ? (
              <div className="text-center">
                <div className="text-6xl mb-4">{currentItem.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Congratulations!
                </h3>
                <p className="text-lg text-gray-700 mb-2">
                  You won: <span className="font-bold">{currentItem.name}</span>
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRarityBg(currentItem.rarity)} ${getRarityColor(currentItem.rarity)}`}>
                  {currentItem.rarity.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    setShowResult(false);
                    resetSpinner();
                  }}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Spin Again
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">🎁</div>
                <p>Spin the loot box to see your prize!</p>
              </div>
            )}
          </div>
        </div>

        {/* Loot Box Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            🎁 About Our Loot Box
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Random Rewards</h4>
              <p className="text-sm text-gray-600">
                Every spin gives you a random pet from Grow a Garden
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown size={24} className="text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">All Rarities</h4>
              <p className="text-sm text-gray-600">
                Chance to win Common, Rare, Legendary, and even Prismatic pets!
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Rewards</h4>
              <p className="text-sm text-gray-600">
                Get your pet immediately after spinning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinner; 