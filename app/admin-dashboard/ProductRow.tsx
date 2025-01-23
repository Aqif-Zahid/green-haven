'use client';

import { useState } from 'react';
import { removeProduct } from './action';

interface Product {
  id: string;
  name: string;
  user: {
    email: string;
  };
}

export default function ProductRow({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveProduct = async () => {
    setIsLoading(true);
    try {
      await removeProduct(product.id);
      window.location.reload(); 
    } catch (error) {
      console.error('Error removing product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
      <td className="border border-gray-300 px-4 py-2">{product.user.email}</td>
      <td className="border border-gray-300 px-4 py-2">
        <button
          onClick={handleRemoveProduct}
          className={`py-1 px-2 rounded ${
            isLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Removing...' : 'Remove'}
        </button>
      </td>
    </tr>
  );
}
