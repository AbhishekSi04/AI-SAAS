"use client";

import React, { useState } from "react";
import { Upload, Download, Image as ImageIcon, Sparkles, Expand, Wand2, Brain, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageExtender = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extendProgress, setExtendProgress] = useState(0);
  const [extendSuccess, setExtendSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    
    // Store original image for preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setOriginalImage(null);
    }
    
    setPrompt(""); // Reset prompt when a new file is chosen
    setTransformedImage(null); // Reset result when file changes
    setExtendSuccess(false);
  };

  const handleUpload = async () => {
    if (!file || !prompt) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    setLoading(true);
    setExtendProgress(0);
    setTransformedImage(null);
    setExtendSuccess(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setExtendProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const response = await fetch("/api/image-extender", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload or transformation failed");

      const data = await response.json();
      clearInterval(progressInterval);
      setExtendProgress(100);
      setTransformedImage(data.transformedUrl);
      setExtendSuccess(true);
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
      link.download = `image-extended-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please try again.");
    }
  };

  // Prompt suggestions for image extension
  const promptSuggestions = [
    "beautiful landscape with mountains",
    "modern city skyline at sunset",
    "lush green forest background",
    "ocean waves and blue sky",
    "abstract geometric patterns",
    "starry night sky with galaxies"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark text-white">

      {/* Upload Section */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Expand className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Image Extension</h2>
                <p className="text-gray-300">Upload your image and describe how you want to extend it</p>
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
                    onChange={handleFileChange}
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
                          <p className="text-gray-300">Ready for extension</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Expand className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Drop your image here or click to browse</p>
                          <p className="text-gray-400">Supports JPG, PNG, and other image formats</p>
                          <p className="text-sm text-gray-500 mt-2">AI will extend your image with natural continuity</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Extension Prompt */}
              {file && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <label className="text-lg font-semibold text-white">Extension Prompt</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Describe how to extend the image (e.g., beautiful landscape with mountains)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      disabled={loading}
                    />
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(suggestion)}
                          className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-white transition-all"
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extend Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleUpload}
                      disabled={!prompt || loading}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Expand className="w-5 h-5 mr-2" />
                          Extend Image
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Processing Progress */}
                  {loading && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white font-medium">Extending image... {Math.round(extendProgress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${extendProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {extendSuccess && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-400">Image Extended Successfully!</h3>
                          <p className="text-green-300">Your extended image is ready for download.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                    <p className="text-gray-300">Compare your original and extended images</p>
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

                {/* Extended Image */}
                {transformedImage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Expand className="w-3 h-3 text-purple-400" />
                      </div>
                      Extended Image
                    </h3>
                    <div className="relative bg-white/5 rounded-xl p-4">
                      <img
                        src={transformedImage}
                        alt="Extended Image"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        AI Extended
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
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Extension</h3>
              <p className="text-gray-300 text-sm">AI analyzes your image context and extends it naturally, maintaining visual coherence and style consistency.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Seamless Blending</h3>
              <p className="text-gray-300 text-sm">Generated content blends seamlessly with your original image, creating natural transitions and realistic extensions.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creative Control</h3>
              <p className="text-gray-300 text-sm">Guide the extension with custom prompts to achieve your desired aesthetic and composition goals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageExtender;
