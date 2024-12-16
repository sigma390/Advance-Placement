import PlacementLogin from '@/components/Login/PlacementLogin';
import RecruiterLogin from '@/components/Login/RecruiterLogin';
import StudentLogin from '@/components/Login/StudentLogin';
import RegisterRecruiter from '@/components/Register/RegisterRecruiter';
import { createBrowserRouter } from 'react-router-dom';

import AboutDevs from '@/components/About/AboutDevs';
import GetAJob from '@/components/Jobs/getAJob';
import JobListing from '@/components/Jobs/JobListing';
import RecruiterJobsPage from '@/components/Jobs/RecruiterJobsListing';
import RegisterStudent from '@/components/Register/RegisterStudent';
import RegisterPage from '../components/Register/RegisterPage';
import RegisterPlacement from '../components/Register/RegisterPlacement';
import Homepage from '../pages/HomePage';
import Layout from '../pages/Layout';
import RecJobDetails from '@/components/Jobs/recJobDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'login/student', // Dynamic role parameter (student, placement, recruiter)
        element: <StudentLogin />,
      },
      {
        path: 'login/recruiter', // Dynamic role parameter (student, placement, recruiter)
        element: <RecruiterLogin />,
      },
      {
        path: 'login/placement', // Dynamic role parameter (student, placement, recruiter)
        element: <PlacementLogin />,
      },
      {
        path: 'register/student', // Dynamic role parameter (student, placement, recruiter)
        element: <RegisterStudent />,
      },
      {
        path: 'register/placement',
        element: <RegisterPlacement />,
      },
      {
        path: 'register/recruiter', // Dynamic role parameter (student, placement, recruiter)
        element: <RegisterRecruiter />,
      },
      {
        path: 'jobs', // Dynamic role parameter (student, placement, recruiter)
        element: <JobListing />,
      },
      {
        path: 'jobs/:jobId', // Dynamic role parameter (student, placement, recruiter)
        element: <GetAJob />,
      },
      {
        path: 'aboutDevs', // Dynamic role parameter (student, placement, recruiter)
        element: <AboutDevs />,
      },
      {
        path: 'recjobs', // Dynamic role parameter (student, placement, recruiter)
        element: <RecruiterJobsPage />,
      },
      {
        path: 'recjobs/:jobId', // Dynamic role parameter (student, placement, recruiter)
        element: <RecJobDetails />,
      },
    ],
  },
]);

export default router;
