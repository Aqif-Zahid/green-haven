"use server"

import prisma from "../lib/db";

export async function removeProduct(productId: string): Promise<void> {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error('Error removing product:', error);
    throw new Error('Failed to remove product');
  }
}
