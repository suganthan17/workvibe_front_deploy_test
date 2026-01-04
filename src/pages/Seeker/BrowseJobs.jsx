import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSeeker from "../../components/SidebarSeeker";
import { Bookmark, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/getalljobs`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setJobs(data.jobs || []);
        setCurrentUserId(data.currentUserId || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/savejobs/${jobId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const updatedSavedBy = data.savedBy;
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, savedBy: updatedSavedBy } : job
          )
        );
        if (updatedSavedBy.includes(currentUserId)) {
          toast.success("Saved!", { duration: 2000 });
        } else {
          toast("Removed from saved!", { icon: "ℹ️", duration: 2000 });
        }
      } else {
        toast.error(data.message || "Could not update saved jobs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobdetails/${jobId}`);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const fixed = path.replace(/\\/g, "/");
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${BASE_URL.replace(/\/$/, "")}/${fixed.replace(/^\//, "")}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      <SidebarSeeker />
      <div className="flex-1 p-10">
        <div className="flex flex-col mb-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 pb-2">
            Find your job
          </h1>
          <p className="text-sm text-gray-600 mb-5">
            View and apply to the latest job postings.
          </p>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const isSaved = job.savedBy?.includes(currentUserId);
              const logo = getImageUrl(job.companyLogo);

              return (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="absolute top-4 right-4 flex items-center gap-2 cursor-pointer select-none group"
                    aria-pressed={isSaved}
                    type="button"
                  >
                    <Bookmark
                      size={22}
                      className={`transition-colors ${
                        isSaved
                          ? "fill-black stroke-black"
                          : "fill-white stroke-black"
                      }`}
                    />
                    <span className="text-xs font-medium text-black">
                      {isSaved ? "Saved" : "Save"}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Company logo"
                        className="w-10 h-10 rounded-md object-cover bg-white shadow-inner"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-semibold">
                        {job.companyName?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {job.companyName || "Unknown Company"}
                      </p>
                      <p className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} />
                        {job.location || "Unknown location"}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {job.jobTitle}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4 text-sm">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                      {job.employmentType || "Full-time"}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                      {job.experienceLevel || "Entry Level"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div>
                      {job.salaryMin && job.salaryMax ? (
                        <p className="font-semibold text-gray-800">
                          ₹{job.salaryMin} - ₹{job.salaryMax}
                          <span className="text-gray-500"> /month</span>
                        </p>
                      ) : (
                        <p className="font-semibold text-gray-600">
                          Salary not disclosed
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewDetails(job._id)}
                      className="bg-gradient-to-r from-indigo-600 to-cyan-500 cursor-pointer hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseJobs;
