import {  Flower, Leaf, Shovel } from "lucide-react";
import { ReactNode } from "react";

interface iAppProps {
    name: string;
    title: string;
    image: ReactNode;
    id: number;
}

export const categoryItems: iAppProps[] = [
    {
        id: 0,
        name: "plants",
        title: "Plants",
        image: <Leaf />
    },
    {
        id: 1,
        name: "accessories",
        title: "Gardening Accessories",
        image: <Shovel />,
    },
    {
        id: 2,
        name: "flowers",
        title: "Flowers",
        image: <Flower />
    }
]