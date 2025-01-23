"use server"

import prisma from "../lib/db";

export async function doesEmailExist(email: string): Promise<boolean> {
  try {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email input');
    }

    console.log('Received email:', email); // Debug log

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return !!user; // Return true if user exists, false otherwise
  } catch (error) {
    console.error('Error in doesEmailExist:', error);
    throw new Error('Database query failed');
  }
}
