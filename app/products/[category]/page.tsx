import { ProductCard } from "@/app/components/ProductCard";
import prisma from "@/app/lib/db";
import { type CategoryTypes } from "@prisma/client";
import { notFound } from "next/navigation";

async function getData(category: string) {
    let input;

    switch (category) {
        case "plants": {
            input = "plants";
            break;
        }
        case "accessories": {
            input = "accessories";
            break;
        }
        case "flowers": {
            input = "flowers";
            break;
        }
        case "all": {
            input= undefined;
            break;
        } default: {
            return notFound();
        }
    }

    const data = await prisma.product.findMany({
        where: {
            category: input as CategoryTypes,
        }, select: {
            id: true,
            images: true,
            smallDescription: true,
            name: true,
            price: true,
        }
    });

    return data;
}



export default async function CategoryPage({params}: {params: {category: string};}) {
    const data = await getData(params.category)
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
                {data.map((product) => (
                    <ProductCard 
                    key={product.id} 
                    images={product.images} 
                    price={product.price} 
                    name={product.name}
                    id={product.id}
                    smallDescription={product.smallDescription}
                    />
                ))}
            </div>
        </section>
    );
}