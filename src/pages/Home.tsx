import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package, Zap, Loader, Search, Filter } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { petService } from '../services/petService';
import { Pet } from '../types';

const Home: React.FC = () => {
  const petBoxes = products.filter(p => p.category === 'Pet Boxes');
  const featuredPetBox = petBoxes[0];
  
  // State for API pets
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Load pets from API
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const petsData = await petService.getPets();
        setPets(petsData);
      } catch (err) {
        setError('Failed to load pets from API');
        console.error('Error loading pets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // Filter pets based on search and rarity
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || pet.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const rarityOptions = ['all', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical', 'Divine', 'Prismatic'];

  // Helper functions for styling
  const getRarityColor = (rarity: string) => {
    const colors = {
      'Common': 'text-gray-600',
      'Uncommon': 'text-green-600',
      'Rare': 'text-blue-600',
      'Legendary': 'text-purple-600',
      'Mythical': 'text-pink-600',
      'Divine': 'text-yellow-600',
      'Prismatic': 'text-rainbow',
      'Unknown': 'text-gray-500'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-600';
  };

  const getRarityBg = (rarity: string) => {
    const backgrounds = {
      'Common': 'bg-gray-100',
      'Uncommon': 'bg-green-100',
      'Rare': 'bg-blue-100',
      'Legendary': 'bg-purple-100',
      'Mythical': 'bg-pink-100',
      'Divine': 'bg-yellow-100',
      'Prismatic': 'bg-gradient-to-r from-red-100 via-yellow-100 to-purple-100',
      'Unknown': 'bg-gray-100'
    };
    return backgrounds[rarity as keyof typeof backgrounds] || 'bg-gray-100';
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      'Common': '⭐',
      'Uncommon': '⭐⭐',
      'Rare': '⭐⭐⭐',
      'Legendary': '⭐⭐⭐⭐',
      'Mythical': '⭐⭐⭐⭐⭐',
      'Divine': '👑',
      'Prismatic': '💎',
      'Unknown': '❓'
    };
    return icons[rarity as keyof typeof icons] || '❓';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🐾 Pet Random Box
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Collect amazing pets from Grow a Garden! Each box contains 1 random pet with guaranteed rare finds!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <Package size={20} className="mr-2" />
                Shop Pet Boxes
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pet Box */}
      {featuredPetBox && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎁 Featured Pet Box
              </h2>
              <p className="text-lg text-gray-600">
                Start your pet collection with our most popular box - 1 random pet guaranteed!
              </p>
            </div>
            <div className="flex justify-center">
              <ProductCard product={featuredPetBox} />
            </div>
          </div>
        </div>
      )}

      {/* Pet Box Features */}
      <div className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Pet Boxes?
            </h2>
            <p className="text-lg text-gray-600">
              The ultimate way to collect Grow a Garden pets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mystery Contents
              </h3>
              <p className="text-gray-600">
                Every box contains 1 random pet with guaranteed rare finds
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Line Notifications
              </h3>
              <p className="text-gray-600">
                Get notified immediately when you open your pet box
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authentic Grow a Garden Pets
              </h3>
              <p className="text-gray-600">
                All pets are based on the real Grow a Garden game
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Pets Gallery - Enhanced and Always Visible */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🐾 Real Pets from Grow a Garden API
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Browse all available pets from the official Grow a Garden game API
            </p>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="sm:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  >
                    {rarityOptions.map(rarity => (
                      <option key={rarity} value={rarity}>
                        {rarity === 'all' ? 'All Rarities' : rarity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredPets.length} of {pets.length} pets from API
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader className="animate-spin w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Loading pets from API...</h3>
              <p className="text-gray-500 mt-2">Fetching data from Grow a Garden</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😿</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Failed to load pets</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Pets Grid */}
          {!loading && !error && filteredPets.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    {/* Pet Image */}
                    <div className="text-4xl mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                      {pet.image}
                    </div>
                    
                    {/* Pet Name */}
                    <h3 className={`font-semibold text-sm mb-2 ${getRarityColor(pet.rarity)}`}>
                      {pet.name}
                    </h3>
                    
                    {/* Rarity Badge */}
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityBg(pet.rarity)} ${getRarityColor(pet.rarity)} mb-2`}>
                      {getRarityIcon(pet.rarity)} {pet.rarity}
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {pet.description}
                    </p>
                    
                    {/* Probability */}
                    <div className="mt-2 text-xs text-gray-500">
                      {(pet.probability * 100).toFixed(1)}% chance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No pets found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All Pet Boxes */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Choose Your Pet Box
            </h2>
            <Link
              to="/products"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {petBoxes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Pet Rarities Guide */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pet Rarities
            </h2>
            <p className="text-lg text-gray-600">
              Discover the different rarity levels you can find in our pet boxes
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { rarity: 'Common', icon: '⭐', color: 'text-gray-600', chance: '40%', bg: 'bg-gray-100' },
              { rarity: 'Uncommon', icon: '🌟', color: 'text-blue-600', chance: '25%', bg: 'bg-blue-100' },
              { rarity: 'Rare', icon: '💫', color: 'text-purple-600', chance: '20%', bg: 'bg-purple-100' },
              { rarity: 'Legendary', icon: '⚡', color: 'text-yellow-600', chance: '10%', bg: 'bg-yellow-100' },
              { rarity: 'Mythical', icon: '🔥', color: 'text-orange-600', chance: '3%', bg: 'bg-orange-100' },
              { rarity: 'Divine', icon: '👑', color: 'text-pink-600', chance: '1.5%', bg: 'bg-pink-100' },
              { rarity: 'Prismatic', icon: '💎', color: 'text-rainbow', chance: '0.5%', bg: 'bg-gradient-to-r from-red-100 via-yellow-100 to-purple-100' }
            ].map((info) => (
              <div key={info.rarity} className="text-center">
                <div className={`w-16 h-16 ${info.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-2xl">{info.icon}</span>
                </div>
                <p className={`font-semibold ${info.color} mb-1`}>{info.rarity}</p>
                <p className="text-sm text-gray-500">{info.chance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Pet Collection?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Choose your pet box and discover 1 amazing pet from Grow a Garden!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Pet Boxes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 