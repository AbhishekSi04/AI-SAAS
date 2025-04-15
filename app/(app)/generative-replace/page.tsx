"use client";

import React, { useState } from "react";

const ObjectReplacer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fromPrompt, setFromPrompt] = useState("");
  const [toPrompt, setToPrompt] = useState("");
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setFromPrompt("");
    setToPrompt("");
    setTransformedImage(null);
  };

  const handleReplace = async () => {
    if (!file || !fromPrompt || !toPrompt) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("from", fromPrompt);
    formData.append("to", toPrompt);

    setLoading(true);
    try {
      const res = await fetch("/api/generative-replace", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to replace image");

      const data = await res.json();
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
      const res = await fetch(transformedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "replaced_image.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Replace Object from Image</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered mb-4"
      />

      {file && (
        <div className="space-y-4 max-w-lg">
          <input
            type="text"
            placeholder="What to replace (e.g., the picture)"
            value={fromPrompt}
            onChange={(e) => setFromPrompt(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="Replace with (e.g., a mirror with a silver frame)"
            value={toPrompt}
            onChange={(e) => setToPrompt(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            className="btn btn-primary"
            onClick={handleReplace}
            disabled={!fromPrompt || !toPrompt || loading}
          >
            {loading ? "Processing..." : "Replace Object"}
          </button>
        </div>
      )}

      {transformedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <img
            src={transformedImage}
            alt="Replaced Object"
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

export default ObjectReplacer;
