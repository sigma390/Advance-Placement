import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Extract job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [showApplicants, setShowApplicants] = useState<boolean>(false);

  // Fetch token from localStorage
  const getToken = () => localStorage.getItem('jwtToken');

  // Fetch job details
  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/recruiters/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setJob(response.data.job);
      } else {
        setError('Failed to fetch job details.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching job details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for the job
  const fetchApplicants = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/recruiters/jobs/${jobId}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setApplicants(response.data.applicants);
        setShowApplicants(true);
      } else {
        alert('Failed to fetch applicants.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error fetching applicants.');
    }
  };

  // Fetch job details on component mount
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  return (
    <div className='p-8'>
      {loading && (
        <div className='text-center'>
          <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 border-teal-500 rounded-full'></div>
          <p>Loading...</p>
        </div>
      )}

      {error && <p className='text-red-500 text-center'>{error}</p>}

      {job && (
        <div className='max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 shadow-lg bg-white'>
          <h1 className='text-3xl font-bold mb-4'>{job.title}</h1>
          <p className='text-gray-700 mb-4'>{job.description}</p>

          <div className='flex items-center gap-4 mb-6'>
            <div>
              <span className='font-semibold'>Max Applications:</span>{' '}
              {job.maxApplications}
            </div>
            <div>
              <span className='font-semibold'>Created At:</span>{' '}
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              className='bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600'
              onClick={() => navigate(-1)} // Go back to the previous page
            >
              Back to Job Listings
            </button>

            <button
              className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'
              onClick={fetchApplicants}
            >
              View Applicants
            </button>
          </div>
        </div>
      )}

      {showApplicants && applicants.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-4'>Applicants</h2>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-4 py-2'>Name</th>
                <th className='border border-gray-300 px-4 py-2'>Marks</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr key={index}>
                  <td className='border border-gray-300 px-4 py-2'>
                    {applicant.studentName}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {applicant.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showApplicants && applicants.length === 0 && (
        <p className='text-center mt-4'>
          No applicants have applied for this job yet.
        </p>
      )}
    </div>
  );
};

export default JobDetailsPage;
