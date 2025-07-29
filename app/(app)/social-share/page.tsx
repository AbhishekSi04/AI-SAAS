"use client"

import React from 'react'
import { CldImage } from 'next-cloudinary';
import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Instagram, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialFormats = {
    "Instagram Square (1:1)": { 
        width: 1080, 
        height: 1080, 
        aspectRatio: "1:1",
        icon: Instagram,
        color: "from-pink-500 to-purple-500",
        description: "Perfect for Instagram posts and profile pictures"
    },
    "Instagram Portrait (4:5)": { 
        width: 1080, 
        height: 1350, 
        aspectRatio: "4:5",
        icon: Instagram,
        color: "from-purple-500 to-pink-500",
        description: "Ideal for Instagram stories and vertical posts"
    },
    "Twitter Post (16:9)": { 
        width: 1200, 
        height: 675, 
        aspectRatio: "16:9",
        icon: Twitter,
        color: "from-blue-500 to-cyan-500",
        description: "Optimized for Twitter posts and engagement"
    },
    "Twitter Header (3:1)": { 
        width: 1500, 
        height: 500, 
        aspectRatio: "3:1",
        icon: Twitter,
        color: "from-cyan-500 to-blue-500",
        description: "Perfect for Twitter profile headers"
    },
    "Facebook Cover (205:78)": { 
        width: 820, 
        height: 312, 
        aspectRatio: "205:78",
        icon: Facebook,
        color: "from-blue-600 to-indigo-600",
        description: "Designed for Facebook cover photos"
    },
};

type SocialFormat = keyof typeof socialFormats;

const SocialShare = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (uploadedImage) {
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setUploadedImage(data.publicId);

        } catch (error) {
            console.log(error);
            alert("Failed to upload image");

        } finally {
            setIsUploading(false);
        }
    }

    const handleDownload = async () => {
        if (!imageRef.current) return;

        fetch(imageRef.current.src)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${selectedFormat
                    .replace(/\s+/g, "_")
                    .toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error downloading the image:", error);
            });
    };

    return (
        <div className="min-h-screen bg-gradient-dark text-white">

            {/* Upload Section */}
            <section className="py-4 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Image</h2>
                                <p className="text-gray-300">Choose an image to transform for social media</p>
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
                                <p className="text-xl font-semibold text-white mb-2">Drop your image here or click to browse</p>
                                <p className="text-gray-400">Supports JPG, PNG, and other common formats</p>
                            </div>
                        </div>

                        {isUploading && (
                            <div className="mt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-white font-medium">Uploading your image...</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {uploadedImage && (
                        <>
                            {/* Format Selection */}
                            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl mb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Choose Format</h2>
                                        <p className="text-gray-300">Select the perfect size for your platform</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(socialFormats).map(([format, config]) => {
                                        const IconComponent = config.icon;
                                        const isSelected = selectedFormat === format;
                                        return (
                                            <div
                                                key={format}
                                                onClick={() => setSelectedFormat(format as SocialFormat)}
                                                className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                                                    isSelected 
                                                        ? 'border-blue-400 bg-blue-500/10' 
                                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                                                        <IconComponent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white">{format}</h3>
                                                        <p className="text-sm text-gray-400">{config.aspectRatio}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-300">{config.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Preview & Download</h2>
                                            <p className="text-gray-300">Your optimized image is ready</p>
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

                                <div className="relative bg-white/5 rounded-xl p-8">
                                    {isTransforming && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                                            <div className="text-center">
                                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-white font-medium">Transforming image...</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <CldImage
                                                width={socialFormats[selectedFormat].width}
                                                height={socialFormats[selectedFormat].height}
                                                src={uploadedImage}
                                                sizes="100vw"
                                                alt="transformed image"
                                                crop="fill"
                                                aspectRatio={socialFormats[selectedFormat].aspectRatio}
                                                gravity='auto'
                                                ref={imageRef}
                                                onLoad={() => setIsTransforming(false)}
                                                className="rounded-lg shadow-xl max-w-full h-auto"
                                            />
                                            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {socialFormats[selectedFormat].aspectRatio}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default SocialShare;

