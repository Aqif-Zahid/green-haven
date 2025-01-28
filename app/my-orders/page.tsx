"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getUserOrders } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: string;
  createdAt: Date;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export default function MyOrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Card>
                <CardHeader className="h-[500px]">
                    <Skeleton className="w-full h-full" />
                </CardHeader>
            </Card>
        </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-5">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order ID: {order.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label>Date:</Label>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Delivery Address:</Label>
                <p>{order.deliveryAddress}</p>
              </div>
              <div>
                <Label>Total Price:</Label>
                <p>{order.totalAmount.toFixed(2)}tk</p>
              </div>
              <div>
                <Label>Order Status:</Label>
                <p
                  className={`font-medium ${
                    order.status === "DELIVERED" ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <div>
                <Label>Products:</Label>
                <ul className="list-disc pl-4">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
