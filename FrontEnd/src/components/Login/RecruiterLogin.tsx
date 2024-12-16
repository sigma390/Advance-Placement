import { useUserStore } from '@/zustand/store';
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api-client';

const RecruiterLogin = () => {
  const { login } = useUserStore(); // Access login function from Zustand store
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await apiClient.post('/recruiters/login', formData);

      if (response.data.success) {
        setSuccess('Login successful!');
        setError('');
        // Handle storing token or redirect logic here
        const { token, userId } = response.data;
        login(userId, token);
        navigate('/recjobs');
      } else {
        setError(response.data.message || 'Login failed.');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Box
        className='w-96 p-6 rounded-lg shadow-lg'
        bg='white'
        textAlign='center'
      >
        <Heading size='lg' mb={4}>
          Recruiter Login
        </Heading>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {success && <p className='text-green-500 mb-4'>{success}</p>}

        <Input
          placeholder='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          mb={4}
        />
        <Input
          placeholder='Password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          mb={4}
        />

        <Button bgColor='blue.300' width='full' onClick={handleLogin}>
          Login
        </Button>
        <Text>
          New here?{' '}
          <Link
            to='/register/recruiter'
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Register as Company
          </Link>
        </Text>
      </Box>
    </div>
  );
};

export default RecruiterLogin;
