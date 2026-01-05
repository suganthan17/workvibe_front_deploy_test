import React, { useEffect, useState } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";
import { Briefcase, MapPin, Download } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/application/my`, {
          credentials: "include",
        });
        const data = await res.json();
        setApplications(data.applications || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadResume = async (id, filename) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/application/download/${id}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download resume");
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Hired":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />

      <main className="flex-1 px-12 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track the jobs you’ve applied for and download your resumes.
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            Loading your applications…
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 text-center text-red-500">
            Failed to load applications.
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            You haven’t applied for any jobs yet.
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition"
              >
                {/* LEFT */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {app.jobId?.jobTitle}
                  </h2>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      Applied
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {app.jobId?.location}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-5">
                  <span
                    className={`px-4 py-1 text-xs font-semibold rounded-full ${statusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  <button
                    onClick={() =>
                      downloadResume(app._id, app.resumeName)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                  >
                    <Download size={16} />
                    Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AppliedJobs;
