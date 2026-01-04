import React, { useEffect, useState } from "react";
import SidebarRecruiter from "../../components/SidebarRecruiter";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JobsPosted() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/getjobs`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch jobs");
        setJobs(data.jobs);
        localStorage.setItem("jobsCount", data.jobs.length);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error(error.message || "Error fetching jobs");
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/deletejobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete job");

      toast.success(data.message || "Job deleted successfully");

      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      localStorage.setItem("jobsCount", updatedJobs.length);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete job");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      <Toaster position="top-right" />
      <SidebarRecruiter />
      <div className="flex-1 p-10">
        <div className="flex flex-col mb-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 pb-2">Jobs Posted</h1>
          <p className="text-sm text-gray-600 mb-5">
            View all the jobs you have published.
          </p>
        </div>

        <div className="max-w-5xl ml-4 space-y-6">
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="relative border border-transparent bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* Gradient outline */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    {job.experienceLevel && (
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full mr-2 font-medium">
                        {job.experienceLevel}
                      </span>
                    )}

                    <span
                      onClick={() => handleDelete(job._id)}
                      className="ml-auto cursor-pointer text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full p-2 transition"
                      title="Delete job"
                    >
                      <Trash2 size={18} />
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    {job.jobTitle}
                  </h2>
                  <p className="text-gray-700 font-medium mt-1">
                    {job.companyName}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{job.location}</p>

                  <div className="flex items-center flex-wrap gap-2 mt-4 text-sm">
                    <span className="bg-yellow-50 border border-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full">
                      ₹{job.salaryMin} - ₹{job.salaryMax} / month
                    </span>
                    <span className="bg-purple-50 border border-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                      {job.employmentType || "Full-time"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-3">
                    {job.jobDescription}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsPosted;
