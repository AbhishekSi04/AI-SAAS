"use client";

import { useState } from "react";
import { Wand2, Download, Image as ImageIcon, Sparkles, Palette, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setGenerationProgress(0);
    setGenerationSuccess(false);
    setImageUrl(null);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 300);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setImageUrl(data.imageUrl);
      setGenerationSuccess(true);
      
    } catch (error) {
      console.error("Generation failed:", error);
      clearInterval(progressInterval);
      alert("Image generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const promptSuggestions = [
    "A futuristic cityscape at sunset with flying cars",
    "A magical forest with glowing mushrooms and fairy lights",
    "A steampunk robot playing chess in a Victorian library",
    "An underwater palace with coral gardens and sea creatures",
    "A space station orbiting a colorful nebula"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Main Content */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Generator Form */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">AI Image Generator</h1>
                <p className="text-gray-300">Create stunning images from text descriptions using advanced AI</p>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-blue-400" />
                  </div>
                  <label className="text-lg font-semibold text-white">Describe Your Image</label>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                  placeholder="Describe the image you want to generate in detail. Be creative and specific for better results!"
                  disabled={loading}
                />
              </div>

              {/* Prompt Suggestions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-300">Try these prompts:</h3>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      disabled={loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className={`px-8 py-4 text-lg font-semibold transition-all ${
                    loading || !prompt.trim()
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02]'
                  } text-white border-none`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Magic...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-6 h-6" />
                      Generate Image
                    </div>
                  )}
                </Button>
              </div>

              {/* Generation Progress */}
              {loading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white font-medium">Creating your image... {Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {generationSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">Image Generated Successfully!</h3>
                      <p className="text-green-300">Your AI-generated image is ready for download.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Image Display */}
          {imageUrl && (
            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generated Image</h2>
                    <p className="text-gray-300">Your AI-created masterpiece</p>
                  </div>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none px-6 py-3"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              </div>

              <div className="relative bg-white/5 rounded-xl p-6">
                <img
                  src={imageUrl}
                  alt="Generated AI Image"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  AI Generated
                </div>
              </div>

              {/* Prompt Display */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Generated from prompt:</h3>
                <p className="text-white italic">"{prompt}"</p>
              </div>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Advanced AI</h3>
              <p className="text-gray-300 text-sm">Powered by state-of-the-art AI models that understand complex prompts and create stunning visuals.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creative Freedom</h3>
              <p className="text-gray-300 text-sm">Generate any style of image from photorealistic to artistic, abstract to detailed illustrations.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">Generate high-quality images in seconds with our optimized AI infrastructure and processing power.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
