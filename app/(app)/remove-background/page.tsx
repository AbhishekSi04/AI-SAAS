"use client";

import React, { useState } from "react";
import { Upload, Download, Image as ImageIcon, Sparkles, Scissors, Zap, Brain, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processSuccess, setProcessSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store original image for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploadProgress(0);
    setTransformedImage(null);
    setProcessSuccess(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload or transformation failed");

      const data = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTransformedImage(data.transformedUrl);
      setProcessSuccess(true);
    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!transformedImage) return;

    try {
      const response = await fetch(transformedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `background-removed-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white">

      {/* Upload Section */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Remove Background</h2>
                <p className="text-gray-300">Upload your image and let AI remove the background automatically</p>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-400" />
                  </div>
                  <label className="text-lg font-semibold text-white">Upload Your Image</label>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    originalImage ? 'border-green-400 bg-green-500/10' : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}>
                    {originalImage ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                          <ImageIcon className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Image Uploaded Successfully!</p>
                          <p className="text-gray-300">Processing background removal...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Scissors className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Drop your image here or click to browse</p>
                          <p className="text-gray-400">Supports JPG, PNG, and other image formats</p>
                          <p className="text-sm text-gray-500 mt-2">AI will automatically detect and remove the background</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processing Progress */}
                {loading && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white font-medium">Removing background... {Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {processSuccess && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-400">Background Removed Successfully!</h3>
                        <p className="text-green-300">Your image is ready for download.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {(originalImage || transformedImage) && (
            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Results</h2>
                    <p className="text-gray-300">Compare your original and processed images</p>
                  </div>
                </div>
                {transformedImage && (
                  <Button 
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none px-6 py-3"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Image */}
                {originalImage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-blue-400" />
                      </div>
                      Original Image
                    </h3>
                    <div className="relative bg-white/5 rounded-xl p-4">
                      <img
                        src={originalImage}
                        alt="Original Image"
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Processed Image */}
                {transformedImage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Scissors className="w-3 h-3 text-purple-400" />
                      </div>
                      Background Removed
                    </h3>
                    <div className="relative bg-white/5 rounded-xl p-4">
                      <img
                        src={transformedImage}
                        alt="Background Removed"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        AI Processed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300 text-sm">Advanced AI algorithms automatically detect subjects and remove backgrounds with pixel-perfect precision.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Quality</h3>
              <p className="text-gray-300 text-sm">Get studio-quality results with clean edges and transparent backgrounds perfect for any use case.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-gray-300 text-sm">Remove backgrounds in seconds with our optimized AI processing pipeline and cloud infrastructure.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BackgroundRemover;
