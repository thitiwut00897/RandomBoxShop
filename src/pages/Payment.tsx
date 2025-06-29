import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useBag } from '../contexts/BagContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode, Loader, CheckCircle } from 'lucide-react';
import { lineNotificationService } from '../services/lineNotification';

const Payment: React.FC = () => {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addPetBoxes } = useBag();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'truemoney' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Add pet boxes to user's bag
      const petBoxItems = items.filter(item => item.product.name.includes('Pet Random Box'));
      
      if (petBoxItems.length > 0) {
        // Add each pet box to the user's bag
        petBoxItems.forEach(item => {
          addPetBoxes(item.product.id, item.product.name, item.quantity);
        });
        
        // Send Line notification for pet box purchase
        await lineNotificationService.sendPurchaseSuccessNotification(
          user?.name || 'User',
          getTotal(),
          petBoxItems.map(item => item.product.name)
        );
      } else {
        // Send regular purchase notification for non-pet box items
        const itemNames = items.map(item => item.product.name);
        await lineNotificationService.sendPurchaseSuccessNotification(
          user?.name || 'User',
          getTotal(),
          itemNames
        );
      }

      // Clear cart after successful purchase
      clearCart();
      setIsSuccess(true);

      // Redirect to bag page after showing success
      setTimeout(() => {
        if (petBoxItems.length > 0) {
          navigate('/bag');
        } else {
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Your payment has been processed successfully.
          </p>
          <div className="animate-pulse">
            <p className="text-purple-600 font-semibold">
              Redirecting to your pets...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>
            
            <div className="space-y-4">
              {/* QR Payment */}
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'qr'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    paymentMethod === 'qr' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <QrCode size={24} className={paymentMethod === 'qr' ? 'text-purple-600' : 'text-gray-600'} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">QR Code Payment</h3>
                    <p className="text-sm text-gray-600">Scan QR code with your banking app</p>
                  </div>
                </div>
              </button>

              {/* TrueMoney */}
              <button
                onClick={() => setPaymentMethod('truemoney')}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'truemoney'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    paymentMethod === 'truemoney' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <CreditCard size={24} className={paymentMethod === 'truemoney' ? 'text-purple-600' : 'text-gray-600'} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">TrueMoney</h3>
                    <p className="text-sm text-gray-600">Pay with TrueMoney wallet</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${getTotal().toFixed(2)}`
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-purple-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Info */}
            {paymentMethod && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {paymentMethod === 'qr' 
                    ? 'QR Code Payment - Scan the QR code with your banking app to complete payment.'
                    : 'TrueMoney - Use your TrueMoney wallet to complete payment.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Display */}
        {paymentMethod === 'qr' && !isProcessing && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Scan QR Code</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <QrCode size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">QR Code Placeholder</p>
                  <p className="text-gray-400 text-xs">Scan with your banking app</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TrueMoney Instructions */}
        {paymentMethod === 'truemoney' && !isProcessing && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">TrueMoney Payment</h3>
            <div className="text-center">
              <CreditCard size={48} className="text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Complete your payment using TrueMoney wallet
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong><br />
                  1. Open your TrueMoney app<br />
                  2. Enter the amount: ${getTotal().toFixed(2)}<br />
                  3. Complete the payment<br />
                  4. Click "Pay" button above
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 