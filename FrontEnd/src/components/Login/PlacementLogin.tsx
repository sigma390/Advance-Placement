import { useUserStore } from '@/zustand/store';
import { Box, Button, Heading, Input } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlacementLogin = () => {
  const { login } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/placements/login',
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        setSuccess('Login successful!');
        const { token, userId } = response.data;

        login(token, userId);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
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
          Placement Cell Login
        </Heading>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {success && <p className='text-green-500 mb-4'>{success}</p>}

        <Input
          placeholder='Email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
        />

        <Input
          placeholder='Password'
          name='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
        />

        <Button bgColor='orange.300' width='full' onClick={handleLogin}>
          Login
        </Button>
        <Link
          to='/register/placement'
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Register as Placement Cell
        </Link>
      </Box>
    </div>
  );
};

export default PlacementLogin;
