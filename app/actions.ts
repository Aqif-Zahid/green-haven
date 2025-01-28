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
    quantity: z.number().min(1, {message: "The quantity has to be higher than 1"})

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
        quantity: Number(formData.get("quantity")),
    });


    if(!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "There is a mistake with input"
        };

        return state;
    }
    
    if (validateFields.data.quantity <= 0) {
        const state: State = {
          status: "error",
          message: "Quantity must be greater than 0",
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
            description: validateFields.data.smallDescription,
            quantity: validateFields.data.quantity,
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
  const productId = formData.get('id') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!productId || isNaN(quantity) || quantity <= 0) {
    throw new Error('Invalid product or quantity');
  }

  if (!user) {
    return redirect(process.env.KINDE_LOGIN_URL as string);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      quantity: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.quantity < quantity) {
    throw new Error('Not enough quantity available');
  }

  const totalPrice = product.price * quantity;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: totalPrice,
      deliveryAddress: '',
      items: {
        create: [
          {
            productId: product.id,
            quantity: quantity,
            totalPrice: totalPrice,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  return redirect(`/checkout/${order.id}`);
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

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
  
      const admin = await prisma.admin.findUnique({
        where: { email },
      });
  
      if (admin && admin.password === password) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return false;
    }
  }

  export async function getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return orders;
  }