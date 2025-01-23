"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State= {
    status: "error" | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
}

const productSchema = z.object({
    name: z.string().min(3, {message: "The name has to be at least 3 characters long"}),
    category: z.string().min(1, {message: "Category is required"}),
    price: z.number().min(1, {message: "The Price has to be higher than 1"}),
    smallDescription: z.string().min(5, {message: "Description is required"}),
    images: z.array(z.string(), {message: "At least one image is required"}),

});

const userSettingsSchema= z.object({
    firstName: z.string().min(3, {message: "Minimum length of 3 required"}).or(z.literal("")).optional(),

    lastName: z.string().min(3, {message: "Minimum length of 3 required"}).or(z.literal("")).optional(),
});

export async function SellProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        throw new Error("Something went wrong");
    }

    const validateFields = productSchema.safeParse({
        name: formData.get("name"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        smallDescription: formData.get("smallDescription"),
        description: formData.get("description"),
        images: JSON.parse(formData.get("images") as string),
    });


    if(!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "There is a mistake with input"
        };

        return state;
    }

    await prisma.product.create({
        data: {
            name: validateFields.data.name,
            category: validateFields.data.category as CategoryTypes,
            smallDescription: validateFields.data.smallDescription,
            price: validateFields.data.price,
            images: validateFields.data.images,
            sellerID: user.id,
            description: validateFields.data.smallDescription
        },

    })

    const state: State = {
        status: "success",
        message: "Your Product has been created!",
    };

    return state;
}



export async function UpdateUserSettings(prevState: any, formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        throw new Error("something went wrong");
    }

    const validateFields = userSettingsSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
    });

    if(!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops, I think there is a mistake with your inputs!",
        };

        return state;
    }


    const state: State = {
        status: "success",
        message: "Your Settings have been updated! Please refresh page.",
    };

    return state;
}

export async function BuyProduct(formData: FormData) {
    const id = formData.get('id') as string;
    const data = await prisma.product.findUnique({
        where: {
            id: id,
        },
        select: {
            name: true,
            smallDescription: true,
            price: true,
            images: true,
        },
    });

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round((data?.price as number) * 100 / 120),
                    product_data: {
                        name: data?.name as string,
                        description: data?.smallDescription,
                        images: data?.images,
                    }
                },
                quantity: 1,
            }
        ],
        success_url: process.env.NODE_ENV === "development" 
        ? 'http://localhost:3000/payment/success' 
        : "https://green-haven-nu.vercel.app/payment/success",
        cancel_url: process.env.NODE_ENV === "development" 
        ? 'http://localhost:3000/payment/cancel' 
        : "https://green-haven-nu.vercel.app/payment/cancel",
    });

    return redirect(session.url as string);
}

export async function CreateStripeAccountLink() {
    const {getUser} = getKindeServerSession()

    const user = await getUser();

    if(!user) {
        throw new Error("Unauthorized")
    }

    const data = await prisma.user.findUnique({
        where: {
            id: user.id,
        }, select: {
            connectedAccountID: true,
        },
    });

    const accountLink = await stripe.accountLinks.create({
        account: data?.connectedAccountID as string,
        refresh_url: process.env.NODE_ENV === "development" 
        ? "http://localhost:3000/billing"
        : `https://green-haven-nu.vercel.app/billing`,
        return_url: process.env.NODE_ENV === "development" 
        ? `http://localhost:3000/return/${data?.connectedAccountID}`
        : `https://green-haven-nu.vercel.app/return/${data?.connectedAccountID}`,
        type: "account_onboarding",
    });

    return redirect(accountLink.url);
}