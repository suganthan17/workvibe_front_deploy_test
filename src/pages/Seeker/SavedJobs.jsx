import React, { useEffect, useState } from "react";
import SidebarSeeker from "../../components/SidebarSeeker";
import {
  Bookmark,
  MapPin,
  IndianRupee,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/savedjobs`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSavedJobs(data.jobs || []);
        setCurrentUserId(data.currentUserId || "");
      } catch {
        toast.error("Failed to load saved jobs");
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/savejobs/${jobId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
        toast.success("Job removed from saved");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarSeeker />

      <main className="flex-1 px-12 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Saved Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Jobs you bookmarked to apply later
          </p>
        </div>

        {/* Content */}
        <div className="max-w-5xl">
          {savedJobs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl px-8 py-12 text-center text-gray-600">
              No saved jobs yet
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`bg-white border border-gray-200 rounded-2xl px-6 py-5 hover:border-indigo-200 transition ${
                    index !== savedJobs.length - 1 ? "" : ""
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {job.jobTitle}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.companyName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUnsaveJob(job._id)}
                      className="cursor-pointer"
                      aria-pressed={job.savedBy?.includes(currentUserId)}
                    >
                      <Bookmark
                        size={18}
                        className={
                          job.savedBy?.includes(currentUserId)
                            ? "fill-indigo-600 stroke-indigo-600"
                            : "stroke-gray-400 hover:stroke-indigo-600"
                        }
                      />
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock3 size={14} className="text-gray-400" />
                      {job.employmentType || "Full-time"}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      {job.location || "Remote"}
                    </div>

                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        <IndianRupee size={14} className="text-gray-400" />
                        ₹{job.salaryMin} – ₹{job.salaryMax} / month
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="mt-5">
                    <button
                      onClick={() => navigate(`/jobdetails/${job._id}`)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      View job details
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SavedJobs;
