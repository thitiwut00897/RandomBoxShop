import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getItemCount, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout!');
      return;
    }

    if (getItemCount() === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Redirect to payment page instead of processing directly
    navigate('/payment');
  };

  if (getItemCount() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some pet boxes to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Pet Boxes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart size={32} className="mr-3" />
              Shopping Cart
            </h1>
            <span className="text-gray-600">
              {getItemCount()} item{getItemCount() !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">${getTotal().toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 