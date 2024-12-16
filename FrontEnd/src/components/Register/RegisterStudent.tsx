import apiClient from '@/services/api-client'; // Replace with your API client path
import { useUserStore } from '@/zustand/store';
import { Box, Button, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterStudent = () => {
  const navigate = useNavigate();
  const { Signup } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    password: '',
    age: '',
    grade: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle student registration
  const handleRegister = async () => {
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age), // Convert age from string to number
      };

      if (isNaN(payload.age)) {
        setError('Age must be a valid number.');
        return;
      }

      const response = await apiClient.post('/students/register', payload); // Replace with your API endpoint
      const { token, userId } = response.data;
      Signup(token, userId);

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        // Store the token in localStorage
        const { token, userId } = response.data;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user_id', userId);

        setTimeout(() => {
          navigate('/jobs'); // Redirect to the login page after success
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
          Student Registration
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
            placeholder='Full Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder='USN'
            name='usn'
            value={formData.usn}
            onChange={handleChange}
          />
          <Input
            placeholder='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            placeholder='Age'
            name='age'
            type='number'
            value={formData.age}
            onChange={handleChange}
          />
          <Input
            placeholder='Grade'
            name='grade'
            value={formData.grade}
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

export default RegisterStudent;
