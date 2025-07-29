import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function GenerateDocumentForm({ employeeId, show, onHide }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("image", image);
      formData.append("user_id", employeeId);

      await axios.post(
        `http://127.0.0.1:8000/api/v1/employee/${employeeId}/generate-document`,
        formData
      );

      toast.success("Document generated successfully");
      onHide();
    } catch (err) {
      toast.error("Failed to generate document");
      console.error(err);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onHide}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            border: "none",
            background: "transparent",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#999",
          }}
        >
          ×
        </button>

        <h3 style={{ marginBottom: "24px", textAlign: "center" }}>Generate Document</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Body
            </label>
            <textarea
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "12px 18px",
              width: "100%",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Generate Document
          </button>
        </form>
      </div>
    </div>
  );
}
