import { useUserStore } from '@/zustand/store';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/git.jpg';

export const NavBar = () => {
  const navigate = useNavigate();
  const { userId, token, logout } = useUserStore(); // Access user state from Zustand store

  const handleLogout = () => {
    logout(); // Call the logout function from Zustand store
    navigate('/'); // Navigate to the home page after logout
  };

  return (
    <header className='shadow sticky z-50 top-0'>
      <nav className='bg-white border-gray-200 px-12 lg:px-12 py-2.5'>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
          <div className='flex justify-start'>
            <Link to='https://git.edu/' className='flex items-center'>
              <img src={logo} className='mr-3 h-16 rounded-full' alt='Logo' />
            </Link>
            <h1 className='pl-1 text-2xl pt-5 pb-5 font-custom'>
              KLS Gogte Institute of Technology
            </h1>
          </div>

          {/* Conditionally Render Logout Button */}
          <div className='flex items-center lg:order-2'>
            {userId && token ? (
              <button
                onClick={handleLogout}
                className='text-red-500 font-semibold'
              >
                Logout
              </button>
            ) : (
              <Link to='/' className='text-blue-500 font-semibold'>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
