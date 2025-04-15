"use client";

import React, { useState } from "react";

const BackgroundRemover = () => {
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("/api/remove-background", {
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
      link.download = "background_removed.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Background Remover</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="file-input file-input-bordered mb-4"
      />

      {loading && <p className="text-blue-600">Processing image...</p>}

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
