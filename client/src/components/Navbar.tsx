'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Play, History, LogIn, UserPlus, Youtube } from 'lucide-react';

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="relative z-50 flex items-center justify-between px-8 py-4 border-b border-purple-500/20 backdrop-blur-md bg-purple-900/20 shadow-xl">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 group">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <Youtube className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-xl font-bold leading-tight group-hover:text-purple-200 transition-colors duration-300 drop-shadow-sm">
            YouTube Analyzer
          </span>
          <span className="text-purple-300 text-xs group-hover:text-purple-400 transition-colors duration-300">
            AI Detection System
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-8">
        <Link 
          href="/" 
          className={`relative px-6 py-3 flex items-center gap-3 font-medium transition-all duration-500 rounded-lg group overflow-hidden ${
            isActive('/') 
              ? 'text-white font-bold bg-purple-700/30 shadow-lg shadow-purple-500/25' 
              : 'text-purple-300 hover:text-white hover:bg-purple-700/20'
          }`}
        >
          <Home className={`w-4 h-4 transition-all duration-300 ${isActive('/') ? 'scale-110' : 'group-hover:scale-110'}`} />
          Home
          {isActive('/') && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Link>

        <Link 
          href="/analysis" 
          className={`relative px-6 py-3 flex items-center gap-3 font-medium transition-all duration-500 rounded-lg group overflow-hidden ${
            isActive('/analysis') 
              ? 'text-white font-bold bg-purple-700/30 shadow-lg shadow-purple-500/25' 
              : 'text-purple-300 hover:text-white hover:bg-purple-700/20'
          }`}
        >
          <Play className={`w-4 h-4 transition-all duration-300 ${isActive('/analysis') ? 'scale-110' : 'group-hover:scale-110'}`} />
          Analysis
          {isActive('/analysis') && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Link>

        <Link 
          href="/history" 
          className={`relative px-6 py-3 flex items-center gap-3 font-medium transition-all duration-500 rounded-lg group overflow-hidden ${
            isActive('/history') 
              ? 'text-white font-bold bg-purple-700/30 shadow-lg shadow-purple-500/25' 
              : 'text-purple-300 hover:text-white hover:bg-purple-700/20'
          }`}
        >
          <History className={`w-4 h-4 transition-all duration-300 ${isActive('/history') ? 'scale-110' : 'group-hover:scale-110'}`} />
          History
          {isActive('/history') && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Link>
      </nav>

      {/* Auth Section - Fixed z-index and interactions */}
      <div className="flex items-center gap-4 relative z-50">
        <SignedOut>
          <div className="relative z-50">
            <SignInButton mode="modal">
              <button 
                type="button"
                className="relative px-6 py-3 flex items-center gap-2 border-2 border-purple-400/50 text-purple-300 rounded-lg overflow-hidden group transition-all duration-300 font-medium hover:scale-105 cursor-pointer z-50"
                style={{ zIndex: 9999 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-700/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <LogIn className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Log In</span>
              </button>
            </SignInButton>
          </div>
          
          <div className="relative z-50">
            <SignUpButton mode="modal">
              <button 
                type="button"
                className="relative px-6 py-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 overflow-hidden group cursor-pointer z-50"
                style={{ zIndex: 9999 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                <UserPlus className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Sign Up</span>
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="flex items-center space-x-4 group relative z-50">
            <div className="text-right opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white font-medium drop-shadow-sm">
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
              </div>
              <div className="text-purple-300 text-xs">
                {user?.emailAddresses?.[0]?.emailAddress}
              </div>
            </div>
            <div className="relative z-50" style={{ zIndex: 9999 }}>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12 ring-2 ring-purple-400/50 hover:ring-purple-400 hover:ring-4 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-110",
                    userButtonPopoverCard: "bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 shadow-2xl",
                    userButtonPopoverActionButton: "text-gray-200 hover:bg-purple-600/20 transition-colors duration-300",
                    userButtonPopoverActionButtonText: "text-gray-200",
                    userButtonPopoverFooter: "hidden",
                    userButtonPopoverRootBox: "z-[9999]"
                  },
                  layout: {
                    showOptionalFields: false
                  }
                }}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur pointer-events-none"></div>
            </div>
          </div>
        </SignedIn>
      </div>
    </header>
  );
}