import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/SidebarRecruiter";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    jobCategory: "",
    jobDescription: "",
    responsibilities: "",
    requirements: "",
    companyWebsite: "",
    companyAbout: "",
  });

  const [activeSection, setActiveSection] = useState("jobDetails");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recruiter/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          companyName: data.companyInfo?.name || "",
          location: data.companyInfo?.location || "",
          companyWebsite: data.companyInfo?.website || "",
          companyAbout: data.companyInfo?.about || "",
        }));
      } catch {
        toast.error("Could not load company details");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchRecruiterProfile();
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/postjob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Job posted successfully");
      setActiveSection("jobDetails");
    } catch {
      toast.error("Failed to post job");
    }
  };

  const goNext = () =>
    setActiveSection((s) =>
      s === "jobDetails" ? "description" : "companyInfo"
    );

  const goBack = () =>
    setActiveSection((s) =>
      s === "companyInfo" ? "description" : "jobDetails"
    );

  const input =
    "w-full h-11 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400";
  const textarea =
    "w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-y";
  const label = "block text-sm font-medium text-gray-700 mb-1";

  if (loadingProfile)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] text-gray-600">
        Loading company details…
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SidebarRecruiter />
      <main className="flex-1 px-12 py-10">
        <Toaster />

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a job listing and reach the right candidates.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          {[
            ["jobDetails", "Job Details"],
            ["description", "Description"],
            ["companyInfo", "Company"],
          ].map(([key, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                activeSection === key
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
          {activeSection === "jobDetails" && (
            <section className="bg-white rounded-3xl border p-8">
              <h2 className="text-lg font-semibold mb-6">Job Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={label}>Job Title</label>
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Employment Type</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className={input}
                    required
                  >
                    <option value="">Select</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div>
                  <label className={label}>Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={input}
                    required
                  >
                    <option value="">Select</option>
                    <option>Entry</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </select>
                </div>

                <div>
                  <label className={label}>Job Category</label>
                  <input
                    name="jobCategory"
                    value={formData.jobCategory}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Salary Range</label>
                  <div className="flex gap-4">
                    <input
                      name="salaryMin"
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      className={input}
                    />
                    <input
                      name="salaryMax"
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      className={input}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "description" && (
            <section className="bg-white rounded-3xl border p-8">
              <h2 className="text-lg font-semibold mb-6">Job Description</h2>

              <div className="space-y-6">
                <div>
                  <label className={label}>Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    className={textarea}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className={textarea}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className={textarea}
                    rows={4}
                    required
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === "companyInfo" && (
            <section className="bg-white rounded-3xl border p-8">
              <h2 className="text-lg font-semibold mb-6">
                Company Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={label}>Company Name</label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>

                <div>
                  <label className={label}>Website</label>
                  <input
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className={input}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={label}>About Company</label>
                  <textarea
                    name="companyAbout"
                    value={formData.companyAbout}
                    onChange={handleChange}
                    className={textarea}
                    rows={4}
                  />
                </div>
              </div>
            </section>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={goBack}
              disabled={activeSection === "jobDetails"}
              className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>

            {activeSection !== "companyInfo" ? (
              <button
                type="button"
                onClick={goNext}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              >
                Post Job
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
