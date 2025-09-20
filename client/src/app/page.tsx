'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Play, BarChart3, Shield, Zap, Users, TrendingUp, Sparkles, Eye, ArrowUp } from 'lucide-react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Show/hide back to top button based on scroll position
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative flex flex-col">      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    
      <Navbar />

      {/* Hero Section */}
      <main className="text-center px-8 py-20 relative z-10 flex-1">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in-left delay-100">Detect</span>{' '}
            <span className="inline-block animate-fade-in-right delay-200 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
              AI-Generated
            </span>{' '}
            <span className="inline-block animate-fade-in-left delay-300">Content in</span>
            <br />
            <span className="inline-block animate-fade-in-right delay-400 text-red-400 animate-scale-bounce">YouTube Videos</span>{' '}
            <span className="inline-block animate-fade-in-left delay-500">with</span>
            <br />
            <span className="inline-block animate-fade-in-right delay-600 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-600 bg-clip-text text-transparent animate-text-glow">
              Advanced AI Analysis
            </span>
          </h1>
        </div>
        
        <p className={`text-gray-300 text-lg mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} animate-fade-in-up delay-700`}>
          Leverage cutting-edge machine learning algorithms to identify AI-generated audio content
          <br />
          in YouTube videos with <span className="text-purple-400 font-semibold animate-text-pulse">precision and reliability</span>.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/analysis" className="animate-fade-in-left delay-800">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Start Analysis</span>
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </button>
          </Link>
          
          <Link href="/history" className="animate-fade-in-right delay-900">
            <button className="group px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/25 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">View History</span>
              <Eye className="w-4 h-4 animate-bounce-gentle" />
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 hover:bg-purple-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in-left delay-1000">
            <div className="text-3xl font-bold text-purple-400 mb-2 animate-number-count group-hover:scale-110 transition-transform duration-300">95%</div>
            <div className="text-gray-300">Accuracy Rate</div>
          </div>
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 hover:bg-purple-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in-up delay-1100">
            <div className="text-3xl font-bold text-green-400 mb-2 animate-text-pulse group-hover:scale-110 transition-transform duration-300">Fast</div>
            <div className="text-gray-300">Processing Speed</div>
          </div>
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 hover:bg-purple-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in-right delay-1200">
            <div className="text-3xl font-bold text-blue-400 mb-2 animate-text-glow group-hover:scale-110 transition-transform duration-300">Secure</div>
            <div className="text-gray-300">Data Protection</div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={`px-8 pb-20 relative z-10 transition-all duration-1000 delay-1400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-3xl font-bold text-white mb-12 text-center animate-fade-in-down delay-1300">
          Why Choose Our <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">AI Detection</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Zap, title: "Advanced AI Models", desc: "Powered by state-of-the-art machine learning algorithms trained on massive datasets to detect AI-generated audio with exceptional accuracy.", color: "purple", delay: "delay-1400", animation: "animate-fade-in-left" },
            { icon: TrendingUp, title: "Real-time Processing", desc: "Get instant results with our optimized processing pipeline that analyzes YouTube videos quickly and efficiently.", color: "blue", delay: "delay-1500", animation: "animate-fade-in-up" },
            { icon: BarChart3, title: "Detailed Analytics", desc: "Receive comprehensive analysis reports with segment-by-segment breakdown and confidence scores for each detection.", color: "green", delay: "delay-1600", animation: "animate-fade-in-right" },
            { icon: Shield, title: "Privacy First", desc: "Your data is processed securely and never stored permanently. We prioritize your privacy and data protection.", color: "red", delay: "delay-1700", animation: "animate-fade-in-left" },
            { icon: Users, title: "User Friendly", desc: "Simple and intuitive interface designed for everyone. Just paste a YouTube URL and get instant AI detection results.", color: "yellow", delay: "delay-1800", animation: "animate-fade-in-up" },
            { icon: Play, title: "Analysis History", desc: "Keep track of all your previous analyses with our comprehensive history feature and easy result management.", color: "indigo", delay: "delay-1900", animation: "animate-fade-in-right" }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 text-center hover:bg-purple-700/30 transition-all duration-500 hover:transform hover:scale-105 hover:rotate-1 hover:shadow-2xl group ${feature.animation} ${feature.delay}`}>
                <div className={`w-16 h-16 bg-${feature.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-${feature.color}-500/50`}>
                  <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`px-8 pb-20 relative z-10 transition-all duration-1000 delay-1600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} animate-fade-in-up delay-2000`}>
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-12 text-center relative overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500"></div>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
            Ready to <span className="animate-text-pulse">Detect AI Content</span>?
          </h2>
          <p className="text-purple-100 text-lg mb-8 relative z-10">
            Start analyzing YouTube videos now and discover the truth behind the content.
          </p>
          <Link href="/analysis">
            <button className="px-10 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-bold text-lg hover:scale-110 hover:shadow-xl relative z-10 group">
              <span className="flex items-center gap-2">
                Get Started Now
                <Sparkles className="w-5 h-5 animate-spin-slow group-hover:animate-spin" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110 group animate-fade-in-up ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          aria-label="Back to top"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <ArrowUp className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10" />
          
          {/* Pulse effect */}
          <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-20"></div>
          
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur"></div>
        </button>
      )}

      {/* <Footer /> */}
    </div>
  );
}