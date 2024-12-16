import HttpService from '../services/HttpsService';

const useLogin = () => {
  const apiClient = new HttpService('/user');

  const loginUser = async ({
    userName,
    password,
    role,
  }: {
    userName: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await apiClient.post('/login', {
        userName,
        password,
        role,
      });
      return response; // Return the response to the caller
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  return { loginUser };
};

export default useLogin;
