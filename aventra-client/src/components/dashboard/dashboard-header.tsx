"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Bell} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between py-4">
                <div className="flex items-center gap-2 md:gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    
                    <div className="md:hidden">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <span className="font-bold">TripPlanner</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-[200px] lg:w-[300px] pl-8"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/user.png" alt="Your Avatar" />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/trips"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            My Trips
                        </Link>
                        <Link
                            href="/dashboard/itineraries"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Itineraries
                        </Link>
                        <Link
                            href="/dashboard/favorites"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Favorites
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="text-sm font-medium transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Settings
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}