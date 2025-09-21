'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth, SignInButton } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle, Play, Clock, LogIn, Brain, TrendingUp, BarChart3, Sparkles, Eye, ArrowUp } from 'lucide-react';
import type { AnalysisResponse, ResultResponse, AnalysisData, TranscriptSegment } from '@/type/analysis';
import { useUserSync } from '@/services/useUserSync';
export default function AnalysisPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken, userId } = useAuth();
  const { synced, syncing, syncError } = useUserSync();
  const [url, setUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse['data'] | null>(null);
  const [detailedResult, setDetailedResult] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  

  useEffect(() => {
    setIsPageLoaded(true);

    // Show/hide back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show loading while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-white text-lg animate-text-pulse">Loading Analysis Tools...</p>
        </div>
      </div>
    );
  }

  // Show sign in page if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-8 py-12 flex items-center justify-center min-h-[calc(100vh-200px)] relative z-10">
          <div className={`bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-12 text-center max-w-lg w-full transition-all duration-1000 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            } hover:bg-purple-700/30 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25`}>

            {/* Icon */}
            <div className={`w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-1000 delay-200 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
              } hover:scale-110 hover:rotate-12`}>
              <LogIn className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className={`text-3xl font-bold text-white mb-4 transition-all duration-1000 delay-300 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-text-shimmer`}>
              Sign In Required
            </h1>

            {/* Description */}
            <p className={`text-purple-200 mb-8 leading-relaxed transition-all duration-1000 delay-400 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
              You need to sign in to access the{' '}
              <span className="text-purple-400 font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                YouTube AI Detection
              </span>{' '}
              Analysis feature and view your analysis history.
            </p>

            {/* Sign In Button */}
            <div className={`transition-all duration-1000 delay-500 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
              <SignInButton mode="modal">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Sign In to Continue</span>
                  <Sparkles className="w-4 h-4 animate-spin-slow relative z-10" />
                </button>
              </SignInButton>
            </div>

            {/* Additional Info */}
            <div className={`mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-600/20 transition-all duration-1000 delay-600 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
              <p className="text-purple-300 text-sm">
                <span className="flex items-center justify-center gap-2 mb-2">
                  <Brain className="w-4 h-4" />
                  <span className="font-semibold">Advanced AI Detection</span>
                </span>
                Analyze YouTube videos for AI-generated content with state-of-the-art machine learning algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!synced && !syncing) {
      setError('Setting up your account, please wait...');
      return;
    }

    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);
    setDetailedResult(null);
    setLoadingStage('Initializing analysis...');

    try {
      console.log('Sending request to Next.js API...');
      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': userId
      };
      const response = await axios.post<AnalysisResponse>('/api/analyze', {
        url: url
      }, {
        headers,
        timeout: 120000
      });

      if (response.data.success) {
        setAnalysisResult(response.data.data);
        setLoadingStage('Analysis initiated successfully!');

        if (response.data.data.status === 'completed') {
          setTimeout(() => {
            fetchResults(response.data.data.id);
          }, 1000);
        } else {
          pollForCompletion(response.data.data.id);
        }
      } else {
        setError('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const pollForCompletion = async (analysisId: string) => {
    const attempts = 0; // Initialize attempts
    const maxAttempts = 20; // Define maxAttempts

    const checkStatus = async () => {
      try {

        setLoadingStage(`Running...`);

        const token = await getToken();
        const response = await axios.get(`/api/result/${analysisId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': userId
          }
        });

        if (response.data.success && response.data.data.status === 'completed') {
          setLoadingStage('Analysis completed! Loading results...');

          setAnalysisResult(prev => prev ? {
            ...prev,
            status: 'completed'
          } : null);

          fetchResults(analysisId);
          return;
        } else if (response.data.data.status === 'failed') {
          setError('Analysis failed. Please try again.');
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        } else {
          setError('Analysis is taking too long. Please check back later.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        }
      }
    };

    checkStatus();
  };

  const fetchResults = async (analysisId: string) => {
    setLoadingResults(true);
    setLoadingStage('Loading detailed results...');

    try {
      const token = await getToken();
      const response = await axios.get<ResultResponse>(`/api/result/${analysisId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      if (response.data.success) {
        setDetailedResult(response.data.data);
        setLoadingStage('Results loaded successfully!');

        setAnalysisResult(prev => prev ? {
          ...prev,
          status: 'completed'
        } : null);
      } else {
        setError('Failed to fetch results');
      }
    } catch (error) {
      console.error('Fetch results error:', error);
      setError('Failed to fetch results');
    } finally {
      setLoadingResults(false);
      setLoadingStage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnalysisColor = (analysis: string) => {
    return analysis === 'AI' ? 'text-red-400' : 'text-green-400';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.7) return 'text-red-400';
    if (probability > 0.3) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-8 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-down delay-100">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
                YouTube AI Detection
              </span>
            </h1>
            
          </div>

          {/* Status Messages */}
          <div className={`space-y-4 mb-8 transition-all duration-1000 delay-400 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* User Sync Status */}
            {syncing && (
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 animate-fade-in-left">
                <div className="flex items-center gap-2 text-blue-200">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-text-pulse">Setting up your account...</span>
                </div>
              </div>
            )}

            {syncError && (
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 animate-fade-in-right">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertCircle className="w-4 h-4 animate-bounce-gentle" />
                  Account setup failed: {syncError}
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {synced && (
              <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6 animate-fade-in-up delay-500 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                <div className="flex items-center gap-3 text-green-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-scale-bounce">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      👋 Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}!
                    </p>
                    <p className="text-sm opacity-90">
                      Your analysis history will be automatically saved and accessible anytime.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* URL Input Section */}
          <div className={`bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 mb-8 transition-all duration-1000 delay-600 hover:bg-purple-700/30 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Enter YouTube URL
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin-slow" />
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-6 py-4 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 hover:bg-purple-900/70"
                  disabled={loading || loadingResults}
                />
                <button
                  type="submit"
                  disabled={loading || loadingResults || !synced}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      <span className="relative z-10">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      <span className="relative z-10">Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Loading Stage Display */}
            {loadingStage && (
              <div className="mt-6 flex items-center gap-3 text-blue-300 bg-blue-900/20 rounded-lg p-4 animate-fade-in-up">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="animate-text-pulse">{loadingStage}</span>
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center gap-3 text-red-400 bg-red-900/20 rounded-lg p-4 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 animate-bounce-gentle" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Analysis Result Section */}
          {analysisResult && (
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 mb-8 animate-fade-in-up delay-100 hover:bg-purple-700/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center animate-scale-bounce">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                Analysis {analysisResult.status === 'completed' ? 'Completed' : 'Initiated'}
                {analysisResult.status === 'processing' && <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-900/30 rounded-lg p-6 hover:bg-purple-900/50 transition-all duration-300 animate-fade-in-left delay-200">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analysis ID
                  </h3>
                  <p className="text-white font-mono text-sm break-all">{analysisResult.id}</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-6 hover:bg-purple-900/50 transition-all duration-300 animate-fade-in-right delay-300">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Status
                  </h3>
                  <p className={`font-semibold flex items-center gap-2 ${analysisResult.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                    {analysisResult.status === 'processing' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="animate-text-pulse">Processing...</span>
                      </>
                    ) : analysisResult.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      analysisResult.status
                    )}
                  </p>
                </div>
              </div>

              {analysisResult.status === 'completed' && !detailedResult && (
                <button
                  onClick={() => fetchResults(analysisResult.id)}
                  disabled={loadingResults}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center gap-2 hover:scale-105 hover:shadow-xl group relative overflow-hidden animate-fade-in-up delay-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loadingResults ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      <span className="relative z-10">Loading Results...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      <span className="relative z-10">View Detailed Results</span>
                      <Sparkles className="w-4 h-4 animate-spin-slow relative z-10" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Detailed Results Section */}
          {detailedResult && (
            <div className="space-y-8 animate-fade-in-up delay-200">
              {/* Summary Section */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 hover:bg-purple-700/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 animate-text-glow">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center animate-scale-bounce">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  AI Analysis Summary
                  <Sparkles className="w-6 h-6 text-purple-400 animate-spin-slow" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center bg-purple-900/30 rounded-xl p-6 hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 animate-fade-in-left delay-100">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center animate-scale-bounce">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <p className={`text-4xl font-bold mb-2 ${getAnalysisColor(detailedResult.aiAnalysisSummary.verdict)} animate-number-count`}>
                      {detailedResult.aiAnalysisSummary.verdict}
                    </p>
                    <p className="text-purple-300 font-semibold">Overall Verdict</p>
                  </div>
                  <div className="text-center bg-purple-900/30 rounded-xl p-6 hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 animate-fade-in-up delay-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-scale-bounce">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className={`text-4xl font-bold mb-2 ${getProbabilityColor(detailedResult.aiAnalysisSummary.aiProbability)} animate-number-count`}>
                      {(detailedResult.aiAnalysisSummary.aiProbability * 100).toFixed(1)}%
                    </p>
                    <p className="text-purple-300 font-semibold">AI Probability</p>
                  </div>
                  <div className="text-center bg-purple-900/30 rounded-xl p-6 hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 animate-fade-in-down delay-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-scale-bounce">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-red-400 mb-2 animate-number-count">
                      {detailedResult.aiAnalysisSummary.aiSegments}
                    </p>
                    <p className="text-purple-300 font-semibold">AI Segments</p>
                  </div>
                  <div className="text-center bg-purple-900/30 rounded-xl p-6 hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 animate-fade-in-right delay-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-scale-bounce">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-green-400 mb-2 animate-number-count">
                      {detailedResult.aiAnalysisSummary.humanSegments}
                    </p>
                    <p className="text-purple-300 font-semibold">Human Segments</p>
                  </div>
                </div>

                {/* Media Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="animate-fade-in-left delay-500">
                    <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Video Screenshot
                    </h3>
                    <div className="bg-purple-900/30 rounded-xl p-4 hover:bg-purple-900/50 transition-all duration-300 hover:scale-105">
                      <img
                        src={detailedResult.screenshotUrl}
                        alt="Video Screenshot"
                        className="w-full rounded-lg shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="animate-fade-in-right delay-600">
                    <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Audio Analysis
                    </h3>
                    <div className="bg-purple-900/30 rounded-xl p-6 hover:bg-purple-900/50 transition-all duration-300 hover:scale-105">
                      <audio
                        controls
                        className="w-full mb-4 rounded-lg"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}${detailedResult.audioUrl}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          Size: {(detailedResult.audioSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          Type: {detailedResult.audioMimeType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Analysis Section */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 hover:bg-purple-700/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 animate-fade-in-up delay-700">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 animate-text-glow">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center animate-scale-bounce">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  Transcript Analysis
                  <Clock className="w-6 h-6 text-purple-400 animate-bounce-gentle" />
                </h2>

                <div className="space-y-4 max-h-96 overflow-y-auto transcript-scroll">
                  {detailedResult.transcript.map((segment: TranscriptSegment, index) => (
                    <div
                      key={segment.id}
                      className={`p-6 rounded-xl border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up ${segment.analysis === 'AI'
                          ? 'bg-red-900/20 border-red-400 hover:bg-red-900/30 hover:shadow-red-500/20'
                          : 'bg-green-900/20 border-green-400 hover:bg-green-900/30 hover:shadow-green-500/20'
                        }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-purple-300 text-sm">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono">
                            {formatTime(segment.start)} - {formatTime(segment.end)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <span className={`text-lg font-bold ${getAnalysisColor(segment.analysis)}`}>
                              {segment.analysis}
                            </span>
                            <p className="text-xs text-purple-400">Classification</p>
                          </div>
                          <div className="text-center">
                            <span className={`text-lg font-bold ${getProbabilityColor(segment.ai_probability)}`}>
                              {(segment.ai_probability * 100).toFixed(1)}%
                            </span>
                            <p className="text-xs text-purple-400">AI Probability</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-white leading-relaxed">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110 group animate-fade-in-up ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          aria-label="Back to top"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <ArrowUp className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-20"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur"></div>
        </button>
      )}
    </div>
  );
}