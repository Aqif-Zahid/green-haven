"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const navbarLinks = [
    {
        id: 0,
        name: "Home",
        href: "/",
    },
    {
        id: 1,
        name: "Plants",
        href: "/products/plants",
    },
    {
        id: 2,
        name: "Gardening Accessories",
        href: "/products/accessories",
    },
    {
        id: 3,
        name: "Flowers",
        href: "/products/flowers",
    },
    {
        id: 4,
        name: "Blogs",
        href: "/blog",
    },
    {
        id: 5,
        name: "Services",
        href: "/services",
        submenu: [
            {
                id: 6,
                name: "Expert Advice",
                href: "/services/advice",
            },
            {
                id: 7,
                name: "Nursery",
                href: "/services/nursery",
            },
        ],
    },
];

export function NavbarLinks() {
    const location = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="hidden md:flex justify-center items-center col-span-6 gap-x-2">
            {navbarLinks.map((item) => (
                <div key={item.id} className="relative">
                    <Link
                        href={item.href}
                        onClick={(e) => {
                            if (item.submenu) {
                                e.preventDefault(); // Prevent navigation for parent item
                                setDropdownOpen((prev) => !prev);
                            }
                        }}
                        className={cn(
                            location === item.href
                                ? "bg-muted"
                                : "hover:bg-muted hover:bg-opacity-75",
                            "group flex items-center px-2 py-2 font-medium rounded-md"
                        )}
                    >
                        {item.name}
                    </Link>
                    {item.submenu && dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg">
                            {item.submenu.map((submenuItem) => (
                                <Link
                                    key={submenuItem.id}
                                    href={submenuItem.href}
                                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                                >
                                    {submenuItem.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}