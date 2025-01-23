import prisma from '../lib/db';
import ProductRow from './ProductRow'; // Import the client component

interface Product {
  id: string;
  name: string;
  user: {
    email: string;
  };
}

export default async function AdminDashboard() {
  const products: Product[] = await prisma.product.findMany({
    include: {
      user: true, 
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Product Name</th>
            <th className="border border-gray-300 px-4 py-2">Seller</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
