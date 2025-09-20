// client/src/app/result/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { fetchAnalysisResult } from '@/services/analysisService';
import Navbar from '@/components/Navbar';
import { 
  Loader2, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Bot,
  Volume2,
  Image as ImageIcon,
  ArrowLeft,
  Download
} from 'lucide-react';
import Link from 'next/link';

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

interface AnalysisData {
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

export default function ResultPage() {
  const params = useParams();
  const { user, isSignedIn, isLoaded } = useUser();
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && params.id) {
      fetchResult();
    } else if (isLoaded && !isSignedIn) {
      setError('Please sign in to view results');
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, params.id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching result for ID:', params.id);
      const response = await fetchAnalysisResult(params.id as string);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to fetch result');
      }
    } catch (err) {
      console.error('Error fetching result:', err);
    } finally {
      setLoading(false);
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

  const getProbabilityBg = (probability: number) => {
    if (probability > 0.7) return 'bg-red-500/20 border-red-500/30';
    if (probability > 0.3) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-8 py-12 flex items-center justify-center min-h-[80vh]">
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-12 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-purple-200 mb-8">
              You need to sign in to view analysis results.
            </p>
            <Link href="/analysis" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
              Go to Analysis
            </Link>
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
          {/* Back Button */}
          <Link 
            href="/history" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
                <p className="text-white">Loading analysis results...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
              <p className="text-red-200 mb-6">{error}</p>
              <button 
                onClick={fetchResult}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Play className="w-6 h-6 text-red-400" />
                      <h1 className="text-3xl font-bold text-white">{result.videoTitle}</h1>
                    </div>
                    
                    <a 
                      href={result.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors mb-4 block"
                    >
                      {result.youtubeUrl}
                    </a>

                    <div className="flex items-center gap-6 text-sm text-purple-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Created: {new Date(result.createdAt).toLocaleString()}
                      </div>
                      {result.completedAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed: {new Date(result.completedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {result.screenshotUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={result.screenshotUrl}
                        alt="Video screenshot"
                        className="w-48 h-32 object-cover rounded-lg border border-purple-600/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bot className="w-6 h-6" />
                  AI Detection Summary
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`text-center p-6 rounded-xl border ${getProbabilityBg(result.aiAnalysisSummary.aiProbability)}`}>
                    <div className={`text-4xl font-bold mb-2 ${getAnalysisColor(result.aiAnalysisSummary.verdict)}`}>
                      {result.aiAnalysisSummary.verdict}
                    </div>
                    <p className="text-purple-300 font-medium">Overall Verdict</p>
                  </div>
                  
                  <div className={`text-center p-6 rounded-xl border ${getProbabilityBg(result.aiAnalysisSummary.aiProbability)}`}>
                    <div className={`text-4xl font-bold mb-2 ${getProbabilityColor(result.aiAnalysisSummary.aiProbability)}`}>
                      {(result.aiAnalysisSummary.aiProbability * 100).toFixed(1)}%
                    </div>
                    <p className="text-purple-300 font-medium">AI Probability</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl border bg-red-500/20 border-red-500/30">
                    <div className="text-4xl font-bold mb-2 text-red-400">
                      {result.aiAnalysisSummary.aiSegments}
                    </div>
                    <p className="text-purple-300 font-medium">AI Segments</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl border bg-green-500/20 border-green-500/30">
                    <div className="text-4xl font-bold mb-2 text-green-400">
                      {result.aiAnalysisSummary.humanSegments}
                    </div>
                    <p className="text-purple-300 font-medium">Human Segments</p>
                  </div>
                </div>
              </div>

              {/* Audio Section - Sửa điều kiện */}
              {(result.audioUrl || result.hasAudio) && (
                <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Volume2 className="w-6 h-6" />
                    Audio Analysis
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Debug info */}
                    <div className="text-xs text-purple-300 mb-4">
                      Debug: hasAudio={result.hasAudio?.toString()}, audioUrl={result.audioUrl}, audioSize={result.audioSize}
                    </div>
                    
                    {result.audioUrl ? (
                      <>
                        <audio 
                          controls 
                          className="w-full"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${result.audioUrl}`}
                          onError={(e) => {
                            console.error('Audio load error:', e);
                            console.error('Audio src:', `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}${result.audioUrl}`);
                          }}
                        >
                          Your browser does not support the audio element.
                        </audio>
                        
                        <div className="flex items-center justify-between text-sm text-purple-200">
                          <div className="flex items-center gap-4">
                            <span>Size: {(result.audioSize / 1024 / 1024).toFixed(2)} MB</span>
                            <span>Type: {result.audioMimeType}</span>
                          </div>
                          
                          <a 
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${result.audioUrl}`}
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Audio
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-purple-300">Audio data not available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transcript Analysis */}
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Detailed Transcript Analysis
                </h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result.transcript.map((segment) => (
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
                
                {result.transcript.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-purple-300">No transcript data available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}