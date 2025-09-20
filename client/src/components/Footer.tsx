'use client'

import { Youtube, Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black/95 backdrop-blur-sm border-t border-purple-500/30 mt-auto">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">YouTube AI Detector</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Advanced AI detection technology to analyze YouTube content and identify AI-generated segments 
              with high accuracy using machine learning algorithms.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-purple-700 border border-gray-700 hover:border-purple-500 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-purple-700 border border-gray-700 hover:border-purple-500 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="mailto:contact@example.com"
                className="p-2 bg-gray-800 hover:bg-purple-700 border border-gray-700 hover:border-purple-500 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/analysis" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  Analysis
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  History
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#api-docs" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                  <ExternalLink className="w-4 h-4" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>for content creators</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} YouTube AI Detector. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}