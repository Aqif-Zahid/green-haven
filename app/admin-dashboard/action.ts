"use server"

import { string } from "zod";
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

export async function addAdmin(email: string, password: string): Promise<void> {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await prisma.admin.create({
      data: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    throw new Error('Failed to add admin');
  }
}