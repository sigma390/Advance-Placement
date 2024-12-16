import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Footer from '@/components/Footer/Footer';
import { NavBar } from '@/components/Navbar/NavBar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Box padding={5}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
