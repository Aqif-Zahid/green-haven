import prisma from '../../lib/db';
import ProductRow from './ProductRow'; // Import the client component

interface Product {
  id: string;
  name: string;
  user: {
    email: string;
  };
}

export default async function NurseryPage() {
  const products: Product[] = await prisma.product.findMany({
    include: {
      user: true, 
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Nursery Page</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Plant Name</th>
            <th className="border border-gray-300 px-4 py-2">Seller</th>
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
