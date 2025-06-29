import React, { useState, useRef, useEffect } from 'react';
import { useBag } from '../contexts/BagContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Gift, 
  Sparkles, 
  ArrowLeft,
  Users,
  Calendar
} from 'lucide-react';
import { PetBox, Pet } from '../types';

const Bag: React.FC = () => {
  const { getUnopenedBoxes, getOpenedBoxes, getAllPets, getRandomPet, addPetToCollection } = useBag();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  
  // CS:GO Style Animation States
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningPets, setSpinningPets] = useState<Pet[]>([]);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [revealedPet, setRevealedPet] = useState<Pet | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound effects
  const playScrollSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playRevealSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Ascending tone for reveal
      oscillator.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContextRef.current.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const unopenedBoxes = getUnopenedBoxes();
  const openedBoxes = getOpenedBoxes();
  const allPets = getAllPets();

  // Debug logging
  useEffect(() => {
    console.log('Bag component state:', {
      isSpinning,
      spinningPets: spinningPets.length,
      showFinalReveal,
      revealedPet: revealedPet?.name,
      scrollProgress,
      unopenedBoxes: unopenedBoxes.length,
      allPets: allPets.length
    });
  }, [isSpinning, spinningPets.length, showFinalReveal, revealedPet, scrollProgress, unopenedBoxes.length, allPets.length]);

  // Debug scroll ref
  useEffect(() => {
    if (isSpinning && scrollRef.current) {
      console.log('Scroll ref is now available:', scrollRef.current);
      console.log('Container dimensions:', {
        clientWidth: scrollRef.current.clientWidth,
        scrollWidth: scrollRef.current.scrollWidth,
        scrollLeft: scrollRef.current.scrollLeft
      });
    }
  }, [isSpinning, spinningPets.length]);

  const handleOpenBox = async (box: PetBox) => {
    console.log('Opening box:', box.id);
    if (openingBox) return; // Prevent multiple openings

    // Set animation state immediately
    setOpeningBox(box.id);
    setIsSpinning(true);
    setShowFinalReveal(false);
    setScrollProgress(0);
    
    console.log('Animation state set - isSpinning:', true);
    
    try {
      console.log('Starting animation process...');
      // First, get a random pet for the animation (this will be the final result)
      const finalPet = getRandomPet();
      console.log('Final pet selected:', finalPet.name);
      setRevealedPet(finalPet);
      
      // Generate random pets for scroll animation, but place the final pet at the end
      const randomPets = generateRandomPetsForSpinning();
      // Replace the last pet with the actual final pet
      randomPets[randomPets.length - 1] = finalPet;
      console.log('Generated', randomPets.length, 'pets for animation with final pet at the end');
      setSpinningPets(randomPets);
      
      // Wait a bit for the state to update and modal to show
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start scroll animation and wait for it to complete (5 seconds)
      console.log('Starting scroll animation...');
      await startScrollAnimation(randomPets.length);
      console.log('Animation completed!');
      
      // After animation completes, show the final reveal
      setIsSpinning(false);
      setSpinningPets([]);
      setShowFinalReveal(true);
      
      // Wait 3 seconds for the reveal animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // After reveal animation, add the pet to the collection
      console.log('Adding pet to collection:', finalPet.name);
      addPetToCollection(finalPet, box.id);
      
      // Hide the final reveal and return to bag
      setShowFinalReveal(false);
      setRevealedPet(null);
      
    } catch (error) {
      console.error('Error opening box:', error);
      setIsSpinning(false);
      setSpinningPets([]);
      setShowFinalReveal(false);
      setRevealedPet(null);
    } finally {
      setOpeningBox(null);
    }
  };

  const generateRandomPetsForSpinning = (): Pet[] => {
    // Generate 20 random pets for the spinning animation
    const pets: Pet[] = [];
    const allPossiblePets = [
      { id: '1', name: 'Common Cat', rarity: 'Common', image: '🐱', probability: 0.4, description: 'A friendly common cat' },
      { id: '2', name: 'Common Dog', rarity: 'Common', image: '🐕', probability: 0.4, description: 'A loyal common dog' },
      { id: '3', name: 'Uncommon Fox', rarity: 'Uncommon', image: '🦊', probability: 0.25, description: 'A clever uncommon fox' },
      { id: '4', name: 'Uncommon Rabbit', rarity: 'Uncommon', image: '🐰', probability: 0.25, description: 'A quick uncommon rabbit' },
      { id: '5', name: 'Rare Dragon', rarity: 'Rare', image: '🐉', probability: 0.2, description: 'A powerful rare dragon' },
      { id: '6', name: 'Rare Phoenix', rarity: 'Rare', image: '🦅', probability: 0.2, description: 'A majestic rare phoenix' },
      { id: '7', name: 'Legendary Leviathan', rarity: 'Legendary', image: '🐋', probability: 0.1, description: 'A massive legendary leviathan' },
      { id: '8', name: 'Mythical Celestial', rarity: 'Mythical', image: '⭐', probability: 0.03, description: 'A divine mythical celestial being' },
      { id: '9', name: 'Divine Guardian', rarity: 'Divine', image: '👼', probability: 0.015, description: 'A sacred divine guardian' },
      { id: '10', name: 'Prismatic Crystal', rarity: 'Prismatic', image: '💎', probability: 0.005, description: 'A rare prismatic crystal entity' }
    ];

    for (let i = 0; i < 20; i++) {
      const randomPet = allPossiblePets[Math.floor(Math.random() * allPossiblePets.length)];
      pets.push({ 
        ...randomPet, 
        id: `${randomPet.id}_${i}`,
        rarity: normalizeRarity(randomPet.rarity)
      });
    }
    return pets;
  };

  // Horizontal scroll animation for CS:GO style
  const startScrollAnimation = async (numPets: number): Promise<void> => {
    console.log('startScrollAnimation called with', numPets, 'pets');
    return new Promise((resolve) => {
      const container = scrollRef.current;
      if (!container) {
        console.log('No container found, resolving immediately');
        return resolve();
      }
      
      console.log('Container found, waiting for render...');
      
      // Wait for the container to be properly rendered
      setTimeout(() => {
        // Calculate scroll parameters
        const itemWidth = 120; // width of each pet card including margin
        const containerWidth = 600; // Fixed container width
        const totalContentWidth = numPets * itemWidth;
        // Calculate scroll to end with the final pet centered
        const finalPetPosition = (numPets - 1) * itemWidth; // Position of the last pet
        const centerOffset = containerWidth / 2 - itemWidth / 2; // Center the pet
        const maxScroll = Math.max(0, finalPetPosition - centerOffset);
        const duration = 5000; // 5 seconds
        const startTime = Date.now();
        let lastSoundTime = 0;
        
        console.log('Animation parameters:', { 
          itemWidth, 
          containerWidth, 
          totalContentWidth, 
          finalPetPosition,
          centerOffset,
          maxScroll, 
          duration,
          numPets 
        });
        
        // Ensure container starts at 0
        container.scrollLeft = 0;
        console.log('Container scrollLeft set to 0');
        
        function animate() {
          if (!container) {
            console.log('Container lost during animation, resolving');
            return resolve();
          }
          
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Update progress for visual effects
          setScrollProgress(progress);
          
          // Ease out: slow down as we approach the end
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentScroll = maxScroll * ease;
          
          console.log('Animation frame:', { 
            progress: progress.toFixed(3), 
            ease: ease.toFixed(3), 
            currentScroll: Math.round(currentScroll),
            scrollLeft: Math.round(container.scrollLeft),
            maxScroll
          });
          
          // Actually scroll the container
          container.scrollLeft = currentScroll;
          
          // Play scroll sound periodically (every 200ms)
          if (elapsed - lastSoundTime > 200) {
            playScrollSound();
            lastSoundTime = elapsed;
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Ensure we end exactly at the final position
            container.scrollLeft = maxScroll;
            setScrollProgress(1);
            
            // Play reveal sound when animation completes
            setTimeout(() => {
              playRevealSound();
            }, 100);
            
            console.log('Animation resolved - Final scrollLeft:', container.scrollLeft);
            resolve();
          }
        }
        
        console.log('Starting animation loop');
        animate();
      }, 500); // Increased delay to ensure DOM is ready
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
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
      case 'Common': return 'shadow-gray-400';
      case 'Uncommon': return 'shadow-blue-400';
      case 'Rare': return 'shadow-purple-400';
      case 'Legendary': return 'shadow-yellow-400';
      case 'Mythical': return 'shadow-orange-400';
      case 'Divine': return 'shadow-pink-400';
      case 'Prismatic': return 'shadow-rainbow';
      default: return 'shadow-gray-400';
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

  // Helper to normalize rarity to Pet type
  const normalizeRarity = (rarity: string): Pet['rarity'] => {
    switch (rarity) {
      case 'Common':
      case 'Uncommon':
      case 'Rare':
      case 'Legendary':
      case 'Mythical':
      case 'Divine':
      case 'Prismatic':
        return rarity;
      default:
        return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to view your bag</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header with Features */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎒 Your Pet Collection</h1>
            <p className="text-gray-600 mb-4">Open your pet boxes and collect amazing pets from Grow a Garden!</p>
            
            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                <Sparkles size={14} className="mr-1" />
                CS:GO Style Opening
              </div>
              <div className="flex items-center bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                <Gift size={14} className="mr-1" />
                Random Pet Selection
              </div>
              <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <Package size={14} className="mr-1" />
                Line Notifications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CS:GO Style Horizontal Scroll Animation */}
      {isSpinning && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl mx-4">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border-4 border-purple-500 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Opening Pet Box</h2>
                <p className="text-purple-300">Scrolling for your pet...</p>
                
                {/* Debug Info */}
                <div className="text-xs text-purple-300 mt-2">
                  Debug: Pets: {spinningPets.length} | Progress: {Math.round(scrollProgress * 100)}%
                </div>
                
                {/* Additional Debug Info */}
                <div className="text-xs text-purple-300 mt-1">
                  Container: {scrollRef.current ? 'Found' : 'Not Found'} | 
                  ScrollWidth: {scrollRef.current?.scrollWidth || 'N/A'} | 
                  ClientWidth: {scrollRef.current?.clientWidth || 'N/A'} |
                  ScrollLeft: {scrollRef.current?.scrollLeft || 'N/A'} |
                  CanScroll: {scrollRef.current ? (scrollRef.current.scrollWidth > scrollRef.current.clientWidth ? 'Yes' : 'No') : 'N/A'}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress * 100}%` }}
                  ></div>
                </div>
                
                {/* Progress Text */}
                <p className="text-purple-300 text-sm mt-2">
                  {Math.round(scrollProgress * 100)}% Complete
                </p>
              </div>
              
              {/* Horizontal scroll container */}
              <div className="relative h-32 overflow-hidden border-2 border-red-500 bg-gray-800">
                <div
                  ref={scrollRef}
                  className="flex flex-row items-center h-32 overflow-x-scroll scrollbar-hide"
                  style={{ 
                    scrollBehavior: 'auto',
                    width: '600px', // Fixed container width
                    maxWidth: '600px'
                  }}
                >
                  {spinningPets.length > 0 ? (
                    spinningPets.map((pet, idx) => (
                      <div
                        key={pet.id + idx}
                        className={`flex flex-col items-center justify-center w-24 h-28 rounded-xl bg-white shadow-lg border-2 ${getRarityBg(pet.rarity)} ${getRarityGlow(pet.rarity)} transition-all duration-300 hover:scale-105 flex-shrink-0`}
                        style={{ 
                          minWidth: '96px',
                          marginRight: '24px'
                        }}
                      >
                        <div className="text-4xl mb-1 animate-pulse">{pet.image || '❓'}</div>
                        <div className={`text-xs font-bold ${getRarityColor(pet.rarity)}`}>{pet.name}</div>
                        <div className="text-xs">{getRarityIcon(pet.rarity)} {pet.rarity}</div>
                      </div>
                    ))
                  ) : (
                    // Fallback if no pets are loaded
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="text-white text-xl">Loading pets...</div>
                    </div>
                  )}
                </div>
                
                {/* Center indicator with enhanced effects */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400 shadow-lg z-10 animate-pulse"></div>
                
                {/* Glow effects around center */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent z-5"></div>
                
                {/* Sparkle effects */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-ping">✨</div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-ping delay-300">✨</div>
              </div>
              
              {/* Enhanced visual feedback */}
              <div className="mt-4 text-center">
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Reveal Modal - CS:GO Style */}
      {showFinalReveal && revealedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
            
            {/* Main reveal card */}
            <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 max-w-lg mx-4 border-4 ${getRarityGlow(revealedPet.rarity)} shadow-2xl animate-bounce`}>
              {/* Rarity glow effect */}
              <div className={`absolute inset-0 rounded-3xl ${getRarityGlow(revealedPet.rarity)} opacity-50 blur-xl`}></div>
              
              <div className="relative z-10 text-center">
                {/* Pet image with effects */}
                <div className="relative mb-6">
                  <div className="text-8xl mb-4 animate-pulse">
                    {revealedPet.image}
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute top-0 left-1/4 text-2xl animate-ping">✨</div>
                  <div className="absolute top-1/4 right-1/4 text-2xl animate-ping delay-100">✨</div>
                  <div className="absolute bottom-1/4 left-1/3 text-2xl animate-ping delay-200">✨</div>
                </div>
                
                {/* Congratulations text */}
                <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  🎉 CONGRATULATIONS!
                </h2>
                
                {/* Pet name */}
                <p className="text-2xl text-white mb-4">
                  You got: <span className={`font-bold ${getRarityColor(revealedPet.rarity)}`}>{revealedPet.name}</span>
                </p>
                
                {/* Rarity badge */}
                <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${getRarityBg(revealedPet.rarity)} ${getRarityColor(revealedPet.rarity)} border-2 border-white shadow-lg`}>
                  {getRarityIcon(revealedPet.rarity)} {revealedPet.rarity}
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mt-4 text-sm">
                  {revealedPet.description}
                </p>
                
                {/* Probability */}
                <p className="text-purple-300 mt-2 text-xs">
                  {revealedPet.probability ? (revealedPet.probability * 100).toFixed(1) : '0.0'}% chance to obtain
                </p>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package size={32} className="mr-3 text-purple-600" />
            My Bag
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{unopenedBoxes.length}</div>
            <div className="text-gray-600">Unopened Boxes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{openedBoxes.length}</div>
            <div className="text-gray-600">Opened Boxes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{allPets.length}</div>
            <div className="text-gray-600">Total Pets</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {allPets.filter(pet => ['Rare', 'Legendary', 'Mythical', 'Divine', 'Prismatic'].includes(pet.rarity)).length}
            </div>
            <div className="text-gray-600">Rare Pets</div>
          </div>
        </div>

        {/* Unopened Boxes */}
        {unopenedBoxes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Gift size={28} className="mr-3 text-purple-600" />
              Unopened Pet Boxes
            </h2>
            
            {/* Debug Animation Test */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">CS:GO Style Animation Test</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={async () => {
                    console.log('=== TEST COMPLETE ANIMATION FLOW ===');
                    setIsSpinning(true);
                    const finalPet = getRandomPet();
                    setRevealedPet(finalPet);
                    
                    const pets = generateRandomPetsForSpinning();
                    // Place the final pet at the end
                    pets[pets.length - 1] = finalPet;
                    setSpinningPets(pets);
                    setScrollProgress(0);
                    
                    // Wait for scroll animation
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await startScrollAnimation(pets.length);
                    
                    // Show final reveal
                    setIsSpinning(false);
                    setSpinningPets([]);
                    setShowFinalReveal(true);
                    
                    // Auto-hide after 3 seconds
                    setTimeout(() => {
                      setShowFinalReveal(false);
                      setRevealedPet(null);
                    }, 3000);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  Test Complete Flow
                </button>
                <button
                  onClick={async () => {
                    console.log('=== TEST SCROLL ANIMATION ONLY ===');
                    setIsSpinning(true);
                    const finalPet = getRandomPet();
                    setRevealedPet(finalPet);
                    
                    const pets = generateRandomPetsForSpinning();
                    // Place the final pet at the end
                    pets[pets.length - 1] = finalPet;
                    setSpinningPets(pets);
                    setScrollProgress(0);
                    
                    // Wait for the modal to render
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Start the scroll animation
                    await startScrollAnimation(pets.length);
                    
                    // Keep the modal open for a few seconds after animation
                    setTimeout(() => {
                      setIsSpinning(false);
                      setSpinningPets([]);
                    }, 2000);
                  }}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Test Scroll Only
                </button>
                <button
                  onClick={() => {
                    console.log('=== STOP ALL ANIMATIONS ===');
                    setIsSpinning(false);
                    setSpinningPets([]);
                    setShowFinalReveal(false);
                    setRevealedPet(null);
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Stop All
                </button>
                <span className="text-xs text-yellow-700">
                  isSpinning: {isSpinning.toString()} | Pets: {spinningPets.length} | FinalReveal: {showFinalReveal.toString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {unopenedBoxes.map((box) => (
                <div key={box.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎁</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{box.productName}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Purchased: {new Date(box.purchaseDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleOpenBox(box)}
                      disabled={openingBox === box.id || isSpinning}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
                    >
                      {openingBox === box.id || isSpinning ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-2"></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} className="inline mr-2" />
                          Open Box
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pet Collection */}
        {allPets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users size={28} className="mr-3 text-green-600" />
              Pet Collection ({allPets.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allPets.map((pet, index) => (
                <div key={`${pet.id}-${index}`} className="bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{pet.image}</div>
                    <h3 className={`font-semibold text-sm mb-1 ${getRarityColor(pet.rarity)}`}>
                      {pet.name}
                    </h3>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityBg(pet.rarity)} ${getRarityColor(pet.rarity)}`}>
                      {getRarityIcon(pet.rarity)} {pet.rarity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opened Boxes History */}
        {openedBoxes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar size={28} className="mr-3 text-blue-600" />
              Opened Boxes History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {openedBoxes.map((box) => (
                <div key={box.id} className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{box.pet?.image}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{box.productName}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Opened: {new Date(box.purchaseDate).toLocaleDateString()}
                    </p>
                    {box.pet && (
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityBg(box.pet.rarity)} ${getRarityColor(box.pet.rarity)}`}>
                        {getRarityIcon(box.pet.rarity)} {box.pet.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {unopenedBoxes.length === 0 && allPets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your bag is empty</h2>
            <p className="text-gray-600 mb-6">Purchase some pet boxes to start your collection!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Pet Boxes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bag; 