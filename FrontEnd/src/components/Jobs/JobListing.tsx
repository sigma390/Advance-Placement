import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobCardsForStudent = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('jwtToken');

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError('Unauthorized: No token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'http://localhost:8000/api/students/jobs',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        setError(response.data.message || 'Failed to fetch jobs.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Box className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Box width='90%' maxWidth='1200px' padding='24px'>
        <Heading
          size='lg'
          mb='16px'
          textAlign='center'
          className='text-bold text-2xl'
        >
          Available Jobs
        </Heading>

        {loading && (
          <Box textAlign='center'>
            <Spinner size='lg' />
            <Text mt='12px'>Loading jobs...</Text>
          </Box>
        )}

        {error && (
          <Box textAlign='center' color='red.500'>
            <Text>{error}</Text>
            <Button mt='12px' colorScheme='orange' onClick={fetchJobs}>
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && jobs.length > 0 && (
          <VStack spacing='24px'>
            {jobs.map((job) => (
              <Box
                key={job._id}
                borderWidth='1px'
                borderRadius='12px'
                padding='16px'
                boxShadow='lg'
                backgroundColor='white'
                width='100%'
              >
                <Text
                  fontWeight='bold'
                  color='blue.600'
                  mb='8px'
                  className=' text-xl'
                >
                  {job.companyName || 'Company Name Not Available'}
                </Text>
                <Heading size='md' mb='8px' className='text-bold'>
                  Job Title :{' '}
                  <span className=' underline underline-1 '>{job.title} </span>
                </Heading>
                <Text color='gray.600' mb='8px'>
                  Description : {job.description}
                </Text>
                <HStack justifyContent='space-between' alignItems='center'>
                  <Text color='gray.500'>
                    Max Applications: {job.maxApplications}
                  </Text>
                  <Button
                    bgColor={'blue.400'}
                    className='w-24 text-white hover:bg-blue-500 active:bg-blue-600 transition duration-200'
                    size='sm'
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    Apply
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {!loading && !error && jobs.length === 0 && (
          <Box textAlign='center' mt='16px'>
            <Text>No jobs available right now.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default JobCardsForStudent;
