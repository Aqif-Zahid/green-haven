'use server';

import prisma from '@/app/lib/db';
import { stripe } from '../lib/stripe';

export async function updateOrderWithAddress(orderId: string, address: string): Promise<string> {
  if (!address || typeof address !== 'string' || !address.trim()) {
    throw new Error('Delivery address is required');
  }

 
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { deliveryAddress: address.trim() },
    include: {
      items: {
        include: {
          product: true, 
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  
  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'usd',
      unit_amount: Math.round(item.product.price * 100 / 120),
      product_data: {
        name: item.product.name,
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/payment/success'
        : 'https://green-haven-nu.vercel.app/payment/success',
      cancel_url: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/payment/cancel'
        : 'https://green-haven-nu.vercel.app/payment/cancel',
  });

  return session.url as string; 
}
