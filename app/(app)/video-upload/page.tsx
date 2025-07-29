"use client"

import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Upload, Video, FileText, Sparkles, Play, Clock, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size is too large. Maximum size is 70MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      await axios.post("/api/video-upload", formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setDescription("");
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 3000);

    } catch (error) {
      console.log(error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Upload Section */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Upload Form */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
                <p className="text-gray-300">Transform and optimize your videos with AI-powered processing</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <label className="text-lg font-semibold text-white">Video Title</label>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter a descriptive title for your video"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <label className="text-lg font-semibold text-white">Description (Optional)</label>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none h-24"
                  placeholder="Describe your video content, purpose, or any specific requirements"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-purple-400" />
                  </div>
                  <label className="text-lg font-semibold text-white">Video File</label>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    file ? 'border-green-400 bg-green-500/10' : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}>
                    {file ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                          <Play className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">{file.name}</p>
                          <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <HardDrive className="w-4 h-4" />
                              <span>{formatFileSize(file.size)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Ready to upload</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Video className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Drop your video here or click to browse</p>
                          <p className="text-gray-400">Supports MP4, MOV, AVI and other video formats</p>
                          <p className="text-sm text-gray-500 mt-2">Maximum file size: 70MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white font-medium">Uploading your video... {Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">Upload Successful!</h3>
                      <p className="text-green-300">Your video has been uploaded and is being processed.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUploading || !file}
                  className={`px-8 py-3 text-lg font-semibold transition-all ${
                    isUploading || !file
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02]'
                  } text-white border-none`}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Video
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Processing</h3>
              <p className="text-gray-300 text-sm">Your videos are automatically optimized using advanced AI algorithms for the best quality and performance.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <HardDrive className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-gray-300 text-sm">All uploaded videos are stored securely in the cloud with enterprise-grade encryption and backup.</p>
            </div>
            
            <div className="bg-[#23272f] border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
              <p className="text-gray-300 text-sm">Experience lightning-fast video processing with our optimized infrastructure and cutting-edge technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VideoUpload;

