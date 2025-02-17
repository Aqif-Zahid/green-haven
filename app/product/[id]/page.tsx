import { BuyProduct } from "@/app/actions";
import { BuyButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";

async function getData(id: string) {
    const data = await prisma.product.findUnique({
        where: {
            id: id,
        },
        select: {
            category: true,
            description: true,
            smallDescription: true,
            name: true,
            images: true,
            price: true,
            createdAt: true,
            id: true,
            quantity: true,
            user: {
                select: {
                    profileImage: true,
                    firstName: true,
                },
            },
        },
    });

    

    return data;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    noStore();
    const data = await getData(id);

    if (!data) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p>The product you are looking for is no longer available.</p>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 pg:px-8 lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            <Carousel className="lg:row-end-1 lg:col-span-4">
                <CarouselContent>
                    {data?.images.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                                <Image src={item as string} alt="Product image" fill className="object-cover w-full h-full rounded-lg" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16" />
                <CarouselNext className="mr-16" />
            </Carousel>
            <div className="max-w-2xl mx-auto mt-5 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    {data?.name}
                </h1>
                <p className="mt-2 text-muted-foreground">{data?.smallDescription}</p>
                
                {data?.quantity > 0 ? (
                    <form action={BuyProduct} className="mt-4">
                        <input type="hidden" name="id" value={data?.id} />
                        <div className="flex items-center gap-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity to Buy:
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                placeholder="1"
                                min="1"
                                max={data?.quantity}
                                required
                                className="w-20 p-2 border rounded-md"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Remaining Quantity: <strong>{data?.quantity}</strong>
                        </p>
                        <BuyButton price={data?.price as number} />
                    </form>
                ) : (
                    <div className="mt-4">
                        <button
                            disabled
                            className="w-full py-2 px-4 bg-gray-400 text-white font-bold rounded cursor-not-allowed"
                        >
                            Out of Stock
                        </button>
                    </div>
                )}

                <div className="border-t border-gray-200 my-10">
                    <div className="grid grid-cols-2 w-full gap-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground col-span-1">Released:</h3>
                        <h3 className="text-sm font-medium col-span-1">
                            {new Intl.DateTimeFormat("en-US", {
                                dateStyle: "long",
                            }).format(data?.createdAt)}
                        </h3>
                        <h3 className="text-sm font-medium text-muted-foreground col-span-1">Category:</h3>
                        <h3 className="text-sm font-medium col-span-1">{data?.category}</h3>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-10"></div>
            </div>
            <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
                <p>{data?.description?.toString()}</p>
            </div>
        </section>
    );
}
