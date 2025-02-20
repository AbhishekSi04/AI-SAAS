"use client";
import React, { useState } from "react";

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
      // console.log("image upload hone ja rahi hai ......");
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // console.log("image upload hone ja gayi hai ......");

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
      console.log(response);
      console.log("transfrom ke try ke baad aa chuke hai");

      if (!response.ok) throw new Error("Transformation failed");
      console.log("transfrom ke try ke baad aa chuke hai");

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

      if (!blob.type.startsWith("image/")) {
        alert("Error: Invalid image format received.");
        console.error("Downloaded file is not an image.", blob);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transformed_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Image downloaded successfully.");
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download image.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Generative AI Background Transformer</h1>

      <input type="file" onChange={handleFileUpload} className="file-input file-input-bordered mb-4" />
      
      {uploadedImage && (
        <div>
          <input
            type="text"
            placeholder="Enter transformation prompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <button className="btn btn-primary" onClick={applyTransformation} disabled={loading}>
            {loading ? "Processing..." : "Transform Image"}
          </button>
        </div>
      )}

      {transformedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Transformed Image:</h3>
          <img src={transformedImage} alt="Transformed" className="rounded-lg shadow-md object-cover w-80 h-120" />
          <button className="btn btn-success mt-4" onClick={handleDownload}>
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default CloudinaryGenerativeAI;










