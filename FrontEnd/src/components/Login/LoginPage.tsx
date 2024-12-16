import { Box, Button, Heading, Input } from '@chakra-ui/react';
import  { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';


const LoginPage = () => {
  const { role } = useParams(); // Get the user role from the URL (e.g., 'student-login', 'placement-login', 'recruiter-login')
  console.log(role);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Call the custom hook
  const { loginUser } = useLogin(); // Ensure `useLogin` returns a function like `loginUser`

  const handleLogin = async () => {
    try {
      const response = await loginUser({ userName, password, role }); // Pass role dynamically

      if (response.success) {
        // Handle successful login
        localStorage.setItem('token', response.token);
        alert(`${role?.replace('-login', '')} login successful!`);
        window.location.href = `/${role?.replace('-login', '')}-page`;
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
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
          {role ? role.replace('-login', '').toUpperCase() : ''} Login
        </Heading>
        {error && <p className='text-red-500 mb-4'>{error}</p>}

        {/* Conditional Placeholder for Username Input */}
        <Input
          placeholder={
            role === 'student-login'
              ? 'USN' // For students
              : role === 'placement-login'
              ? 'Placement Cell ID' // For placement cell
              : 'Username' // Default for recruiters
          }
          type='text'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          mb={4}
        />

        <Input
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
        />
        <Button bgColor={'orange.300'} width='full' onClick={handleLogin}>
          Login
        </Button>

        {/* Registration Options */}
        <div className='flex flex-col items-center justify-center mt-4'>
          <p>Don’t have an account?</p>

          {role?.split('-')[0] === 'student' ? (
            <Link
              className='underline underline-offset-1 text-blue-600'
              to={`/register/student`}
            >
              Register as Student
            </Link>
          ) : role?.split('-')[0] === 'plcment' ? (
            <Link
              className='underline underline-offset-1 text-blue-600'
              to={`/register/placement`}
            >
              Register as Placement Cell
            </Link>
          ) : (
            <Link
              className='underline underline-offset-1 text-blue-600'
              to={`/register/recruiter`}
            >
              Register as Recruiter
            </Link>
          )}
          <div className='flex space-x-4 mt-2'></div>
        </div>
      </Box>
    </div>
  );
};

export default LoginPage;
