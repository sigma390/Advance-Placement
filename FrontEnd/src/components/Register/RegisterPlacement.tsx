import { useUserStore } from '@/zustand/store';
import { Box, Button, Heading, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import apiClient from '../../services/api-client';

const PlacementCellRegisterPage = () => {
  const { Signup } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update state for each field
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await apiClient.post('/placements/register', formData);

      if (response.data.success) {
        setSuccess('Registration successful!');
        setFormData({
          name: '',
          email: '',
          password: '',
        });
        const { token, userId } = response.data;
        Signup(token, userId);
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
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
          Placement Cell Registration
        </Heading>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {success && <p className='text-green-500 mb-4'>{success}</p>}

        <Input
          placeholder='Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          mb={4}
        />
        <Input
          placeholder='Email'
          name='email'
          type='email'
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

        <Button bgColor='blue.300' width='full' onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </div>
  );
};

export default PlacementCellRegisterPage;
