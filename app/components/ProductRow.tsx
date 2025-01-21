import Link from "next/link";
import prisma from "../lib/db";
import { notFound } from "next/navigation";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface iAppProps {
    category: "newest" | "plants" | "accessories" | "flowers"
}

async function getData({category}: iAppProps) {

    switch(category) {
        case "flowers": {
            const data = await prisma.product.findMany({
                where: {
                    category: "flowers",
                },
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images: true,
                },
                take: 3,
            });
            return {
                data: data,
                title: "Flowers",
                link: "/products/flowers",
            }
        }
        case "newest": {
            const data = await prisma.product.findMany({
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images: true,
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 3,
            });
            return {
                data: data,
                title: "Newest Products",
                link: "/products/all"
            }
        }
        case "accessories": {
            const data = await prisma.product.findMany({
                where: {
                    category: "accessories",
                },
                select: {
                    id: true,
                    price: true,
                    name: true,
                    smallDescription: true,
                    images: true,
                },
                take: 3,
            });
            return {
                data: data,
                title: "Accessories",
                link: "/products/accessories",
            }
        }
        case "plants": {
            const data = await prisma.product.findMany({
                where: {
                    category: "plants",
                },
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images: true,
                },
                take: 3,
            });
            return {
                data: data,
                title: "Plants",
                link: "/products/plants"
        }
    } default: {
        return notFound();
    }
}}





export function ProductRow({category}: iAppProps) {
    return (
        <section className="mt-12">
            <Suspense fallback={<LoadingState />}>
            <LoadRows category={category} />
            </Suspense>
        </section>
    );
}

async function LoadRows({category}: iAppProps) {
    const data = await getData({category: category})
    return (
        <><div className="md:flex md:items-center md:justify between">
        <h2 className="text-2xl font-extrabold tracking-tighter ">
            {data.title}     
        </h2>
        <Link href={data.link} className="text-sm hidden font-medium text-primary hover:text-primary/90 md:block px-20">
        All Products <span>&rarr;</span>
        </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 mt-4 gap-10">
        {data.data.map((product) => (
            <ProductCard 
            images={product.images} 
            key={product.id} 
            id={product.id}
            name={product.name}
            price={product.price}
            smallDescription={product.smallDescription}
            />
        ))}
    </div></>
    )
}


function LoadingState() {
    return (
        <div>
            <Skeleton className="h-8 w-56"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-10 lg:grid-cols-3">
                <LoadingProductCard />
                <LoadingProductCard />
                <LoadingProductCard />
            </div>
        </div>
    )
}