import apiClient from '@/services/api-client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GetAJob = () => {
  const { jobId } = useParams(); // Extract jobId from the URL
  const [jobData, setJobData] = useState(null); // State to store job data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [resume, setResume] = useState(null); // State to store uploaded resume
  const [applicationError, setApplicationError] = useState(null); // State to handle application errors
  const [applied, setApplied] = useState(false); // State to track application status

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await apiClient.get(`students/jobs/${jobId}`);
        const jobDetails = response.data;

        setJobData(jobDetails);

        // Check if the current student's ID exists in the applicants array
        const currentStudentId = localStorage.getItem('user_id'); // Replace with your actual student ID retrieval logic
        console.log('currentStudentId', currentStudentId);
        const isApplied = jobDetails.job.applicants.some(
          (applicant) => applicant.studentId === currentStudentId
        );
        setApplied(isApplied); // Update the applied state
      } catch (err) {
        setError(err.message || 'Error fetching job data');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData(); // Fetch job data when jobId is available
    }
  }, [jobId]);

  const handleResumeUpload = (event) => {
    setResume(event.target.files[0]);
  };

  const handleApply = async () => {
    const getToken = () => localStorage.getItem('jwtToken');
    if (!resume) {
      alert('Please upload your resume!');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', jobId); // Add jobId to the request body
    formData.append('resume', resume); // Add resume file to the request body

    try {
      const token = getToken();
      const response = await apiClient.post(
        '/students/jobs/applyjob',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        alert('Application submitted successfully!');
        setIsModalOpen(false);
        setApplied(true); // Update the applied state to true
      } else {
        setApplicationError(
          response.data.message || 'Failed to apply for the job.'
        );
      }
    } catch (error) {
      setApplicationError(
        error.response?.data?.message ||
          'An error occurred while submitting the application.'
      );
    }
  };

  if (loading)
    return <div className='text-center text-gray-500'>Loading...</div>; // Show loading state
  if (error)
    return <div className='text-center text-red-500'>Error: {error}</div>; // Show error state

  return (
    <div className='max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-md'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Job Details</h1>
      {jobData ? (
        <div className='bg-white p-4 border border-gray-200 rounded-lg shadow-sm'>
          <p className='text-gray-700 mb-2'>
            <span className='font-semibold'>ID:</span> {jobData.job._id}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-semibold'>Title:</span> {jobData.job.title}
          </p>
          <p className='text-gray-700 mb-4'>
            <span className='font-semibold'>Description:</span>{' '}
            {jobData.job.description}
          </p>
          {!applied ? (
            <button
              className='px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 active:bg-blue-700 transition duration-200'
              onClick={() => setIsModalOpen(true)}
            >
              Apply Now
            </button>
          ) : (
            <p className='px-6 py-2 bg-green-400 text-white font-medium rounded-md transition duration-200'>
              Applied Successfully
            </p>
          )}
        </div>
      ) : (
        <p className='text-gray-500'>No job data found.</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-lg w-full max-w-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>
              Upload Your Resume
            </h2>
            <input
              type='file'
              accept='.pdf,.doc,.docx'
              className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none mb-4'
              onChange={handleResumeUpload}
            />
            {resume && (
              <p className='text-sm text-gray-600 mb-4'>
                Selected file: <strong>{resume.name}</strong>
              </p>
            )}
            {applicationError && (
              <p className='text-red-500 text-sm mb-4'>{applicationError}</p>
            )}
            <div className='flex justify-end space-x-2'>
              <button
                className='px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400'
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600'
                onClick={handleApply}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAJob;
