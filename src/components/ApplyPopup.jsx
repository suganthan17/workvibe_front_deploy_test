import React, { useState } from "react";
import toast from "react-hot-toast";
import { CloudUpload } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ApplyPopup({ jobId, onClose, onApplied }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selected.type)) {
      return toast.error("Only PDF or Word files allowed!");
    }

    setFile(selected);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Upload your resume first!");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/application/apply`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Applied successfully!");
        onApplied && onApplied();   // ✅ IMPORTANT
        onClose();
      } else {
        toast.error(data.message || "Failed to apply");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange({ target: { files: [dropped] } });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Upload Resume
        </h2>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            id="resumeInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="resumeInput"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <CloudUpload size={40} className="text-gray-500" />
            <span className="font-medium text-gray-800">
              Drag your resume here or click to upload
            </span>
            <span className="text-sm text-gray-500">
              Acceptable file types: PDF, DOCX
            </span>
          </label>
        </div>

        {file && (
          <div className="mt-3 text-sm text-gray-700 text-center">
            ✅ Selected: <span className="font-medium">{file.name}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={loading || !file}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
