import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for new job form
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [maxApplications, setMaxApplications] = useState<number>(100);

  // Fetch token from localStorage
  const getToken = () => localStorage.getItem('jwtToken');

  // Fetch all jobs for the recruiter
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axios.get(
        'http://localhost:8000/api/recruiters/jobs',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        setError('Failed to fetch jobs.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new job
  const addNewJob = async () => {
    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:8000/api/recruiters/create-job',
        { title, description, maxApplications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Job added successfully!');
        fetchJobs(); // Refresh the job list
        setTitle('');
        setDescription('');
        setMaxApplications(100);
      } else {
        alert('Failed to add job.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding job.');
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `http://localhost:8000/api/recruiters/jobs/deletejob/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert('Job deleted successfully!');
        fetchJobs(); // Refresh the job list
      } else {
        alert('Failed to delete job.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting job.');
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Recruiter Job Management
      </h1>

      {/* Form to add a new job */}
      <div className='border border-gray-300 rounded-lg p-6 mb-8 shadow-lg bg-white'>
        <h2 className='text-xl font-semibold mb-4'>Add New Job</h2>
        <div className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Job Title'
            className='p-2 border border-gray-300 rounded-lg'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder='Job Description'
            className='p-2 border border-gray-300 rounded-lg'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type='number'
            placeholder='Max Applications'
            className='p-2 border border-gray-300 rounded-lg'
            value={maxApplications}
            onChange={(e) => setMaxApplications(Number(e.target.value))}
          />
          <button
            className='bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600'
            onClick={addNewJob}
            disabled={!title || !description}
          >
            Post Job
          </button>
        </div>
      </div>

      {/* Display Jobs */}
      <h2 className='text-xl font-semibold mb-4'>Your Posted Jobs</h2>

      {loading && (
        <div className='text-center'>
          <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 border-teal-500 rounded-full'></div>
          <p>Loading...</p>
        </div>
      )}

      {error && <p className='text-red-500 text-center'>{error}</p>}

      {!loading && jobs.length === 0 && (
        <p className='text-center'>No jobs posted yet.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className='space-y-4'>
          {jobs.map((job) => (
            <div
              key={job._id}
              className='border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50 flex justify-between items-center'
            >
              <div>
                <h3 className='text-lg font-bold'>{job.title}</h3>
                <p>{job.description}</p>
                <p className='text-gray-500'>
                  Max Applications: {job.maxApplications}
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  className='bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600'
                  onClick={() => navigate(`/recjobs/${job._id}`)}
                >
                  View Details
                </button>
                <button
                  className='bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600'
                  onClick={() => alert('Edit functionality pending')}
                >
                  Edit
                </button>
                <button
                  className='bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600'
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;
