"use client";

import React, { useState } from "react";
import { Upload, Sparkles, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const CloudinaryGenerativeAI = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const applyTransformation = async () => {
    if (!uploadedImage || !userPrompt) return;

    const formData = new FormData();
    formData.append("publicId", uploadedImage);
    formData.append("prompt", userPrompt);

    setLoading(true);
    try {
      const response = await fetch("/api/image-transform", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transformation failed");

      const data = await response.json();
      setTransformedImage(data.transformedUrl);
    } catch (error) {
      console.error("Error transforming image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!transformedImage) {
      alert("No transformed image available.");
      return;
    }

    try {
      const response = await fetch(transformedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transformed_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download image.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Upload Section */}
        <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Upload Image</h2>
              <p className="text-gray-300 text-sm">Choose a file to enhance with AI</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-white/40 transition-colors bg-white/5">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-white mb-2">Drop your image or click to browse</p>
              <p className="text-gray-400">Supports JPG, PNG and WebP</p>
            </div>
          </div>

          {loading && (
            <div className="mt-6 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-white">Processing...</span>
            </div>
          )}
        </div>

        {/* Prompt + Transform Section */}
        {uploadedImage && (
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Describe the Transformation</h2>
                <p className="text-gray-300 text-sm">Type a prompt and transform your image</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="e.g., Turn background into a forest scene"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button
              onClick={applyTransformation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {loading ? "Transforming..." : "Transform Image"}
            </Button>
          </div>
        )}

        {/* Result Section */}
        {transformedImage && (
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl text-center">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Your Transformed Image</h2>
                  <p className="text-gray-300 text-sm">Download or share your result</p>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
            </div>

            <img
              src={transformedImage}
              alt="Transformed"
              className="rounded-xl shadow-lg mx-auto max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudinaryGenerativeAI;
