"use client"

import { useState } from "react"
import httpClient from "@/app/services/httpClient"

export default function TestCloudinaryPage() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState(null)

  const checkConfig = async () => {
    try {
      const data = await httpClient.get("/test/cloudinary/config")
      setConfig(data.data)
      alert("Config loaded - check console")
      console.log("Cloudinary Config:", data)
    } catch (error) {
      console.error("Config error:", error)
      alert("Failed to load config")
    }
  }

  const loadImages = async () => {
    setLoading(true)
    try {
      const data = await httpClient.get("/test/cloudinary/list")
      setImages(data.data || [])
      console.log("Loaded images:", data)
    } catch (error) {
      console.error("Load error:", error)
      alert("Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("media", files[i])
      }

      const data = await httpClient.upload("/test/cloudinary/upload", formData)
      console.log("Upload response:", data)
      alert(`Uploaded ${data.data?.length || 0} file(s)`)
      
      // Reload images
      await loadImages()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const deleteImage = async (mediaId) => {
    if (!confirm("Delete this image?")) return

    try {
      await httpClient.delete(`/test/cloudinary/delete/${mediaId}`)
      alert("Deleted")
      await loadImages()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Delete failed")
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Cloudinary Upload Test</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={checkConfig} style={buttonStyle}>
          Check Config
        </button>
        <button onClick={loadImages} disabled={loading} style={buttonStyle}>
          {loading ? "Loading..." : "Load Images"}
        </button>
        <label style={{ ...buttonStyle, cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Upload Images"}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {config && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0" }}>
          <h3>Config:</h3>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h3>Uploaded Images ({images.length})</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img
              src={img.mediaUrl}
              alt={`Image ${img.id}`}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ marginTop: "10px" }}>
              <p style={{ fontSize: "12px", margin: "5px 0" }}>
                ID: {img.id} | Type: {img.mediaType}
              </p>
              <p style={{ fontSize: "12px", margin: "5px 0", wordBreak: "break-all" }}>
                Storage: {img.storageType}
              </p>
              <button
                onClick={() => deleteImage(img.id)}
                style={{ ...buttonStyle, background: "#dc3545", marginTop: "5px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No images yet. Upload some to get started!
        </p>
      )}
    </div>
  )
}

const buttonStyle = {
  padding: "10px 20px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
}
