"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderWithAddress } from "../actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = React.use(params); 
  const [address, setAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!address.trim()) {
      setErrorMessage("Delivery address is required.");
      return;
    }

    try {
      const sessionUrl = await updateOrderWithAddress(orderId, address.trim());
      router.push(sessionUrl); 
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Please provide your delivery address to complete your order.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address (e.g., street, city, postal code)"
              className="w-full"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCheckout} className="w-full">
            Submit and Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
