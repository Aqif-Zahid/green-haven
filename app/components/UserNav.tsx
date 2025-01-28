"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { useState } from "react";
import { authenticateAdmin } from "../actions";

interface iAppProps {
    email: string;
    name: string;
    userImage: string | undefined;
}

export function UserNav({ email, name, userImage }: iAppProps) {
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdminLogin = async () => {
        try {
            console.log('Authenticating admin...'); 
            const isAuthenticated = await authenticateAdmin(adminEmail, adminPassword); 

            if (isAuthenticated) {
                window.location.href = '/admin-dashboard'; 
            } else {
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in as admin:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userImage} alt="User Image" />
                        <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild><Link href="/sell">Sell your Product</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="my-products">My Products</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/my-orders">My Orders</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><button onClick={() => setShowAdminPrompt(true)}>Admin mode</button></DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <LogoutLink>Log out</LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>

            
            {showAdminPrompt && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    style={{ zIndex: 9999 }}
                >
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-lg font-bold mb-4">Admin Login</h2>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        />
                        <button
                            onClick={handleAdminLogin}
                            className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
                        >
                            Login
                        </button>
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                        <button
                            onClick={() => setShowAdminPrompt(false)}
                            className="mt-4 text-gray-500 underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </DropdownMenu>
    );
}
