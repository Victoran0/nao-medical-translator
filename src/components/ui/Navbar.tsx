"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Optional: Utility function for class management
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-bold colorGradText text-gray-800">
                Nao Medical
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8  items-center">
                <Link
                href="/translate"
                className="text-gray-600 hover:text-blue-500"
                >
                Translate
                </Link>
                <Link
                href="/help"
                className="text-gray-600 hover:text-blue-500"
                >
                Help
                </Link>
                {/* Put link to the github repo */}
                
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <button
                    type="button"
                    title="Toggle Menu"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none"
                >
                <svg
                    className={cn("h-6 w-6 bbBox2", { hidden: isOpen })}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
                <svg
                    className={cn("h-6 w-6 bbBox2", { hidden: !isOpen })}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                </button>
            </div>
            </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
            <div className="md:hidden">
            <div className="space-y-1 px-4 pb-4">
                <Link
                href="/translate"
                className="block text-gray-800 hover:bg-gray-100 rounded-md px-2 py-2"
                >
                Translate
                </Link>
                <Link
                href="/help"
                className="block text-gray-800 hover:bg-gray-100 rounded-md px-2 py-2"
                >
                Help
                </Link>
            </div>
            </div>
        )}
        </nav>
    );
}
