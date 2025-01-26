'use client';

import { useState } from 'react';
import { BuyProduct } from '@/app/actions';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product A', price: 100, quantity: 2 },
    { id: 2, name: 'Product B', price: 50, quantity: 1 },
  ]);

  const handleCheckout = async () => {
    const formData = new FormData();
    cartItems.forEach((item) => {
      formData.append('id', item.id.toString());
      formData.append('quantity', item.quantity.toString());
    });

    try {
      await BuyProduct(formData);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <p>{item.name}</p>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>
      <p>Total: ${calculateTotal()}</p>
      <button onClick={handleCheckout}>Proceed to Payment</button>
    </div>
  );
}
