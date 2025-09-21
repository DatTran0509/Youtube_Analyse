// client/src/app/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { 
  Loader2, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Eye,
  ArrowLeft,
  AlertCircle,
  Volume2,
  Download,
  Bot,
  User,
  LogIn
} from 'lucide-react';
import { useUserSync } from '@/services/useUserSync';
import axios from 'axios';
interface AnalysisHistoryItem {
  _id: string;
  youtubeUrl: string;
  videoTitle: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  screenshotUrl?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TranscriptSegment {
  id: number;
  text: string;
  start: number;
  end: number;
  ai_probability: number;
  analysis: 'AI' | 'Human';
}

interface AIAnalysisSummary {
  verdict: 'AI' | 'Human';
  aiProbability: number;
  aiSegments: number;
  humanSegments: number;
}

interface AnalysisDetailData {
  id: string;
  youtubeUrl: string;
  videoTitle: string;
  status: string;
  createdAt: string;
  completedAt: string;
  screenshotUrl: string;
  hasAudio: boolean;
  audioUrl: string;
  audioSize: number;
  audioMimeType: string;
  transcript: TranscriptSegment[];
  aiAnalysisSummary: AIAnalysisSummary;
}

export default function HistoryPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { synced, syncing, syncError } = useUserSync();
  const { userId } = useAuth();
  
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Result detail states
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [analysisDetail, setAnalysisDetail] = useState<AnalysisDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  // Fetch functions
  const fetchUserAnalyses = async (page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(`/api/user/analyses`, {
        params: { page, limit },
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      throw error;
    }
  };

  const fetchAnalysisResult = async (analysisId: string) => {
    try {
      const response = await axios.get(`/api/result/${analysisId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },  
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis result:', error);
      throw error;
    }
  };

  const loadAnalyses = async (page: number = 1) => {
    if (!isSignedIn || !synced) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetchUserAnalyses(page, 10);
      setAnalyses(response.data.analyses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError((err as Error).message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysisDetail = async (analysisId: string) => {
    setDetailLoading(true);
    setDetailError('');
    
    try {
      const response = await fetchAnalysisResult(analysisId);
      if (response.success) {
        setAnalysisDetail(response.data);
        setSelectedAnalysis(analysisId);
      } else {
        setDetailError(response.error || 'Failed to load detail');
      }
    } catch (error) {
      setDetailError((error as Error).message || 'Failed to load detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedAnalysis(null);
    setAnalysisDetail(null);
    setDetailError('');
  };

  // Chỉ load analyses khi user đã synced
  useEffect(() => {
    if (isLoaded && isSignedIn && synced) {
      loadAnalyses();
    }
  }, [isLoaded, isSignedIn, synced]);

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
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

  const getProbabilityBg = (probability: number) => {
    if (probability > 0.7) return 'bg-red-500/20 border-red-500/30';
    if (probability > 0.3) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-8 py-12 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-8 py-12 flex items-center justify-center min-h-[80vh]">
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-12 text-center max-w-md">
            <LogIn className="w-16 h-16 text-purple-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-purple-200 mb-8">
              Please sign in to view your analysis history.
            </p>
            <SignInButton mode="modal">
              <button className="w-full px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Sync Status */}
          {syncing && (
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-200">
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up your account...
              </div>
            </div>
          )}

          {syncError && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-200">
                <AlertCircle className="w-4 h-4" />
                Account setup failed: {syncError}
              </div>
            </div>
          )}

          {synced && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle className="w-4 h-4" />
                Welcome back, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}!
              </div>
            </div>
          )}
          
          {/* Detail View */}
          {selectedAnalysis && analysisDetail && (
            <div className="space-y-8">
              {/* Back Button */}
              <button 
                onClick={closeDetail}
                className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </button>

              {/* Video Header */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Play className="w-6 h-6 text-red-400" />
                      <h1 className="text-3xl font-bold text-white">{analysisDetail.videoTitle}</h1>
                    </div>
                    
                    <a 
                      href={analysisDetail.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors mb-4 block"
                    >
                      {analysisDetail.youtubeUrl}
                    </a>

                    <div className="flex items-center gap-6 text-sm text-purple-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Created: {formatDate(analysisDetail.createdAt)}
                      </div>
                      {analysisDetail.completedAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed: {formatDate(analysisDetail.completedAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  {analysisDetail.screenshotUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={analysisDetail.screenshotUrl}
                        alt="Video screenshot"
                        className="w-48 h-32 object-cover rounded-lg border border-purple-600/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bot className="w-6 h-6" />
                  AI Analysis Result
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`text-center p-6 rounded-xl border ${getProbabilityBg(analysisDetail.aiAnalysisSummary.aiProbability)}`}>
                    <div className={`text-4xl font-bold mb-2 ${getAnalysisColor(analysisDetail.aiAnalysisSummary.verdict)}`}>
                      {analysisDetail.aiAnalysisSummary.verdict}
                    </div>
                    <p className="text-purple-300 font-medium">Conclusion</p>
                  </div>
                  
                  <div className={`text-center p-6 rounded-xl border ${getProbabilityBg(analysisDetail.aiAnalysisSummary.aiProbability)}`}>
                    <div className={`text-4xl font-bold mb-2 ${getProbabilityColor(analysisDetail.aiAnalysisSummary.aiProbability)}`}>
                      {(analysisDetail.aiAnalysisSummary.aiProbability * 100).toFixed(1)}%
                    </div>
                    <p className="text-purple-300 font-medium">AI Probability</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl border bg-red-500/20 border-red-500/30">
                    <div className="text-4xl font-bold mb-2 text-red-400">
                      {analysisDetail.aiAnalysisSummary.aiSegments}
                    </div>
                    <p className="text-purple-300 font-medium">AI Sentences</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl border bg-green-500/20 border-green-500/30">
                    <div className="text-4xl font-bold mb-2 text-green-400">
                      {analysisDetail.aiAnalysisSummary.humanSegments}
                    </div>
                    <p className="text-purple-300 font-medium">Human Sentences</p>
                  </div>
                </div>
              </div>

              {/* Audio Section */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Volume2 className="w-6 h-6" />
                  Audio Analysis
                </h2>

                <div className="space-y-4">
                  {analysisDetail.audioUrl ? (
                    <>
                      <audio 
                        controls 
                        className="w-full"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${analysisDetail.audioUrl}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      
                      <div className="flex items-center justify-between text-sm text-purple-200">
                        <div className="flex items-center gap-4">
                          <span>Size: {(analysisDetail.audioSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>Type: {analysisDetail.audioMimeType}</span>
                        </div>
                        
                        <a 
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${analysisDetail.audioUrl}`}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-purple-300">No Audio Data</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Detailed Transcript Analysis
                </h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {analysisDetail.transcript.map((segment) => (
                    <div 
                      key={segment.id}
                      className={`p-6 rounded-xl border-l-4 ${
                        segment.analysis === 'AI' 
                          ? 'bg-red-900/20 border-red-400 border-l-red-400' 
                          : 'bg-green-900/20 border-green-400 border-l-green-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-4">
                          <span className="text-purple-300 text-sm font-mono">
                            {formatTime(segment.start)} - {formatTime(segment.end)}
                          </span>
                          <div className="flex items-center gap-2">
                            {segment.analysis === 'AI' ? (
                              <Bot className="w-4 h-4 text-red-400" />
                            ) : (
                              <User className="w-4 h-4 text-green-400" />
                            )}
                            <span className={`text-sm font-bold ${getAnalysisColor(segment.analysis)}`}>
                              {segment.analysis}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-sm font-bold ${getProbabilityColor(segment.ai_probability)}`}>
                            {(segment.ai_probability * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-purple-300">AI Confidence</div>
                        </div>
                      </div>
                      
                      <p className="text-white leading-relaxed">{segment.text}</p>
                    </div>
                  ))}
                </div>
                
                {analysisDetail.transcript.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-purple-300">No transcript data</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detail Loading */}
          {selectedAnalysis && detailLoading && (
            <div className="space-y-6">
              <button 
                onClick={closeDetail}
                className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </button>
              
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
                  <p className="text-white">Loading Details...</p>
                </div>
              </div>
            </div>
          )}

          {/* Detail Error */}
          {selectedAnalysis && detailError && (
            <div className="space-y-6">
              <button 
                onClick={closeDetail}
                className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </button>
              
              <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                <p className="text-red-200 mb-6">{detailError}</p>
                <button 
                  onClick={() => loadAnalysisDetail(selectedAnalysis)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Main List View */}
          {!selectedAnalysis && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Analysis History</h1>
                <div className="text-purple-200">
                  Total: <span className="text-white font-semibold">{pagination.total}</span> 
                </div>
              </div>

              {/* Loading hoặc waiting for sync */}
              {(loading || syncing || !synced) && (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
                    <p className="text-white">
                      {syncing ? 'Setting up account...' : 
                       !synced ? 'Preparing...' : 
                       'Loading History...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && synced && (
                <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                  <p className="text-red-200 mb-6">{error}</p>
                  <button 
                    onClick={() => loadAnalyses(pagination.page)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && synced && analyses.length === 0 && (
                <div className="text-center py-20">
                  <FileText className="w-24 h-24 text-purple-400 mx-auto mb-8" />
                  <h2 className="text-3xl font-bold text-white mb-4">No Analysis Data</h2>
                  <p className="text-purple-200 mb-8 text-lg max-w-md mx-auto">
                    Start analyzing YouTube videos to see your history here.
                  </p>
                  <a 
                    href="/analysis"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Analysis
                  </a>
                </div>
              )}

              {/* Analysis List */}
              {!loading && !error && synced && analyses.length > 0 && (
                <div className="space-y-6">
                  {analyses.map((analysis) => (
                    <div 
                      key={analysis._id}
                      className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 hover:bg-purple-800/40 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Video Title & URL */}
                          <div className="flex items-center gap-3 mb-4">
                            <Play className="w-6 h-6 text-red-400" />
                            <h3 className="font-bold text-white text-xl">
                              {analysis.videoTitle || 'Loading...'}
                            </h3>
                          </div>
                          
                          <p className="text-purple-300 mb-6 truncate">
                            {analysis.youtubeUrl}
                          </p>

                          {/* Status & Date */}
                          <div className="flex items-center gap-8 text-sm mb-6">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(analysis.status)}
                              <span className={`font-medium ${
                                analysis.status === 'completed' ? 'text-green-400' :
                                analysis.status === 'processing' ? 'text-blue-400' :
                                'text-red-400'
                              }`}>
                                {getStatusText(analysis.status)}
                              </span>
                            </div>
                            
                            <span className="text-purple-200">
                              Created: {formatDate(analysis.createdAt)}
                            </span>
                            
                            {analysis.completedAt && (
                              <span className="text-purple-200">
                                Completed: {formatDate(analysis.completedAt)}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-4">
                            {analysis.status === 'completed' && (
                              <button
                                onClick={() => loadAnalysisDetail(analysis._id)}
                                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            )}
                            
                            {analysis.status === 'processing' && (
                              <span className="bg-blue-600/20 text-blue-300 px-6 py-3 rounded-lg border border-blue-500/30 font-medium">
                                Processing...
                              </span>
                            )}
                            
                            {analysis.status === 'failed' && (
                              <span className="bg-red-600/20 text-red-300 px-6 py-3 rounded-lg border border-red-500/30 font-medium">
                                Failed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Screenshot */}
                        {analysis.screenshotUrl && (
                          <div className="ml-8 flex-shrink-0">
                            <img 
                              src={analysis.screenshotUrl}
                              alt="Video thumbnail"
                              className="w-full max-w-md rounded-lg border border-purple-600/30"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && synced && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => loadAnalyses(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors font-medium"
                  >
                    Previous
                  </button>
                  
                  <span className="px-6 py-3 text-white font-medium">
                    Page {pagination.page} / {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => loadAnalyses(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}