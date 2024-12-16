import apiClient from '@/services/api-client';
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../zustand/store'; // Import the Zustand store

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useUserStore(); // Access login function from Zustand store
  const [formData, setFormData] = useState({
    usn: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await apiClient.post('/students/login', formData); // API call to login
      if (response.data.success) {
        const { token, userId } = response.data;
        console.log(response.data);

        // Use the Zustand store to update global state
        login(userId, token);

        setSuccess('Login successful!');
        navigate('/jobs'); // Redirect to jobs page after successful login
      } else {
        setError(response.data.message || 'Login failed.');
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
          Student Login
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
        <Input
          placeholder='USN'
          name='usn'
          value={formData.usn}
          onChange={handleChange}
          mb='12px'
        />
        <Input
          placeholder='Password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          mb='16px'
        />
        <Button
          backgroundColor={'orange.400'}
          width='100%'
          onClick={handleLogin}
          mb='12px'
        >
          Login
        </Button>
        <Text>
          New here?{' '}
          <Link
            to='/register/student'
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Register
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default StudentLogin;
