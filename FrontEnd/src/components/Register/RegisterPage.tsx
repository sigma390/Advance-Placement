import { Box, Button, Heading, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import apiClient from '../../services/api-client';

const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    password: '',
    age: 0,
    grade: '',
    resumeId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value, // Parse `age` to number, fallback to 0 if invalid
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await apiClient.post('/students/register', formData);

      if (response.data.success) {
        setSuccess('Registration successful!');
        setFormData({
          name: '',
          usn: '',
          password: '',
          age: 0,
          grade: '',
          resumeId: '',
        });
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
          Student Registration
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
          placeholder='USN'
          name='usn'
          value={formData.usn}
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
        <Input
          placeholder='Age'
          name='age'
          type='number'
          value={formData.age}
          onChange={handleChange}
          mb={4}
        />
        <Input
          placeholder='Grade'
          name='grade'
          value={formData.grade}
          onChange={handleChange}
          mb={4}
        />

        <Button bgColor='orange.300' width='full' onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </div>
  );
};

export default StudentRegisterPage;
