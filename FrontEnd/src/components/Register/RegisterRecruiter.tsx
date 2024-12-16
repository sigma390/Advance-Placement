import { useUserStore } from '@/zustand/store';
import { Box, Button, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api-client';

const RegisterRecruiter = () => {
  const navigate = useNavigate();
  const { Signup } = useUserStore();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle recruiter registration
  const handleRegister = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('/recruiters/register', formData); // Replace with your API endpoint

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to jobs page...');

        // Store the token in localStorage
        const { token, userId } = response.data;
        Signup(token, userId);
        navigate('/recjobs');

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/jobs'); // Adjust the route as necessary
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <Box
      className='flex items-center justify-center min-h-screen bg-gray-100'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box
        width='400px'
        padding='24px'
        borderRadius='12px'
        boxShadow='lg'
        backgroundColor='white'
        textAlign='center'
      >
        <Heading size='lg' mb='16px'>
          Recruiter Registration
        </Heading>

        {error && (
          <Text color='red.500' mb='12px'>
            {error}
          </Text>
        )}
        {success && (
          <Text color='green.500' mb='12px'>
            {success}
          </Text>
        )}

        <VStack spacing='12px'>
          <Input
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            placeholder='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            backgroundColor={'green.400'}
            color='white'
            width='100%'
            onClick={handleRegister}
          >
            Register
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterRecruiter;
