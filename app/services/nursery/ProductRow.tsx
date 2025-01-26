'use client';

interface Product {
  id: string;
  name: string;
  user: {
    email: string;
  };
}

export default function ProductRow({ product }: { product: Product }) {

  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
      <td className="border border-gray-300 px-4 py-2">{product.user.email}</td>
    </tr>
  );
}
