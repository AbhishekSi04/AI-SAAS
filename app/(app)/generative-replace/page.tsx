"use client";

import React, { useState } from "react";
import { Upload, Download, Image as ImageIcon, Sparkles, RefreshCw, Wand2, Brain, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ObjectReplacer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fromPrompt, setFromPrompt] = useState("");
  const [toPrompt, setToPrompt] = useState("");
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceSuccess, setReplaceSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
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
    
    setFromPrompt("");
    setToPrompt("");
    setTransformedImage(null);
    setReplaceSuccess(false);
  };

  const handleReplace = async () => {
    if (!file || !fromPrompt || !toPrompt) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("from", fromPrompt);
    formData.append("to", toPrompt);

    setLoading(true);
    setReplaceProgress(0);
    setTransformedImage(null);
    setReplaceSuccess(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setReplaceProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const res = await fetch("/api/generative-replace", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to replace image");

      const data = await res.json();
      clearInterval(progressInterval);
      setReplaceProgress(100);
      setTransformedImage(data.transformedUrl);
      setReplaceSuccess(true);
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
      const res = await fetch(transformedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `generative-replace-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please try again.");
    }
  };

  // Prompt suggestions
  const fromSuggestions = [
    "the car",
    "the building",
    "the person",
    "the tree",
    "the background",
    "the furniture"
  ];

  const toSuggestions = [
    "a red sports car",
    "a modern glass building",
    "a person in formal attire",
    "a cherry blossom tree",
    "a sunset landscape",
    "elegant wooden furniture"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark text-white">

      {/* Upload Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Object Replacement</h2>
                <p className="text-gray-300">Upload your image and describe what you want to replace</p>
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
                          <p className="text-gray-300">Ready for object replacement</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Wand2 className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Drop your image here or click to browse</p>
                          <p className="text-gray-400">Supports JPG, PNG, and other image formats</p>
                          <p className="text-sm text-gray-500 mt-2">AI will intelligently replace objects in your image</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Replacement Prompts */}
              {file && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* From Prompt */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-red-400" />
                        </div>
                        <label className="text-lg font-semibold text-white">What to Replace</label>
                      </div>
                      <input
                        type="text"
                        placeholder="Describe the object to replace (e.g., the car, the building)"
                        value={fromPrompt}
                        onChange={(e) => setFromPrompt(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        disabled={loading}
                      />
                      <div className="flex flex-wrap gap-2">
                        {fromSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setFromPrompt(suggestion)}
                            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-white transition-all"
                            disabled={loading}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* To Prompt */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-green-400" />
                        </div>
                        <label className="text-lg font-semibold text-white">Replace With</label>
                      </div>
                      <input
                        type="text"
                        placeholder="Describe the replacement (e.g., a red sports car, a modern building)"
                        value={toPrompt}
                        onChange={(e) => setToPrompt(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                        disabled={loading}
                      />
                      <div className="flex flex-wrap gap-2">
                        {toSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setToPrompt(suggestion)}
                            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-white transition-all"
                            disabled={loading}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Replace Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleReplace}
                      disabled={!fromPrompt || !toPrompt || loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Replace Object
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Processing Progress */}
                  {loading && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white font-medium">Replacing object... {Math.round(replaceProgress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${replaceProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {replaceSuccess && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-400">Object Replaced Successfully!</h3>
                          <p className="text-green-300">Your transformed image is ready for download.</p>
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
                    <p className="text-gray-300">Compare your original and transformed images</p>
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

                {/* Transformed Image */}
                {transformedImage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Wand2 className="w-3 h-3 text-purple-400" />
                      </div>
                      Object Replaced
                    </h3>
                    <div className="relative bg-white/5 rounded-xl p-4">
                      <img
                        src={transformedImage}
                        alt="Object Replaced"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        AI Transformed
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
              <h3 className="text-lg font-semibold text-white mb-2">Intelligent Recognition</h3>
              <p className="text-gray-300 text-sm">Advanced AI understands context and seamlessly replaces objects while maintaining natural lighting and shadows.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Seamless Integration</h3>
              <p className="text-gray-300 text-sm">Replacement objects blend naturally with the original image, matching perspective, lighting, and style perfectly.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creative Freedom</h3>
              <p className="text-gray-300 text-sm">Transform any object into anything you can imagine with precise AI-powered generative replacement technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ObjectReplacer;
