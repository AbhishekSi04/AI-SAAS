"use client";

import React, { useState } from "react";

const BackgroundRemover = () => {
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setPrompt(""); // Reset prompt when a new file is chosen
    setTransformedImage(null); // Reset result when file changes
  };

  const handleUpload = async () => {
    if (!file || !prompt) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    setLoading(true);
    try {
      const response = await fetch("/api/image-extender", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload or transformation failed");

      const data = await response.json();
      setTransformedImage(data.transformedUrl);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
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
      link.download = "generative_fill.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Generative AI Image Extender</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered mb-4 mt-4"
      />

      {file && (
        <div className="space-y-4 pt-5">
          <input
            type="text"
            placeholder="Enter fill prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
            <br/>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!prompt || loading}
          >
            {loading ? "Processing..." : "Generate Image"}
          </button>
        </div>
      )}

      {transformedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <img
            src={transformedImage}
            alt="Transformed"
            className="rounded-lg shadow-md object-cover w-80 h-auto"
          />
          <button className="btn btn-success mt-4" onClick={handleDownload}>
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
