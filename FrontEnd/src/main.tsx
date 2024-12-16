import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider.tsx';
import './index.css';
import router from './routes/routes.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  </Provider>
);
