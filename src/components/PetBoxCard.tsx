import React, { useState } from 'react';
import { ShoppingCart, Info, Star, Zap, Crown } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface PetBoxCardProps {
  product: Product;
}

const PetBoxCard: React.FC<PetBoxCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const rarityInfo = [
    { rarity: 'Common', icon: '⭐', color: 'text-gray-600', chance: '40%' },
    { rarity: 'Uncommon', icon: '🌟', color: 'text-blue-600', chance: '25%' },
    { rarity: 'Rare', icon: '💫', color: 'text-purple-600', chance: '20%' },
    { rarity: 'Legendary', icon: '⚡', color: 'text-yellow-600', chance: '10%' },
    { rarity: 'Mythical', icon: '🔥', color: 'text-orange-600', chance: '3%' },
    { rarity: 'Divine', icon: '👑', color: 'text-pink-600', chance: '1.5%' },
    { rarity: 'Prismatic', icon: '💎', color: 'text-rainbow', chance: '0.5%' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-purple-200">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🐾</div>
            <div className="text-2xl font-bold text-purple-700">Pet Random Box</div>
            <div className="text-sm text-purple-600">Grow a Garden</div>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
          SPECIAL
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-green-600">
            {product.stock} in stock
          </span>
        </div>

        {/* Rarity Information - Always Visible */}
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Pet Rarities:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {rarityInfo.map((info) => (
              <div key={info.rarity} className="flex items-center justify-between">
                <span className={`font-medium ${info.color}`}>
                  {info.icon} {info.rarity}
                </span>
                <span className="text-gray-600">{info.chance}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-purple-700">
            <strong>Guaranteed:</strong> At least 1 Rare or higher pet per box!
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Special Features */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center">
              <Star size={12} className="text-yellow-500 mr-1" />
              <span>10 Pets</span>
            </div>
            <div className="flex items-center">
              <Zap size={12} className="text-blue-500 mr-1" />
              <span>Random</span>
            </div>
            <div className="flex items-center">
              <Crown size={12} className="text-purple-500 mr-1" />
              <span>Rare+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBoxCard; 