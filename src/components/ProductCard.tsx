import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import PetBoxCard from './PetBoxCard';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Use special PetBoxCard for pet random boxes
  if (product.name.includes('Pet Random Box')) {
    return <PetBoxCard product={product} />;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getRarityColor = (stock: number) => {
    if (stock <= 3) return 'text-red-600';
    if (stock <= 8) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock <= 3 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm font-medium ${getRarityColor(product.stock)}`}>
            {product.stock} in stock
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 