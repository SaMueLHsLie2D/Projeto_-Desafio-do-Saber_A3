// Define o roteamento do front-end usando React Router
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import RecycleGame from './pages/RecycleGame';
import Profile from './pages/Profile';
import Ranking from './pages/Ranking';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Personalizar from './pages/Personalizar';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/quiz',
    element: <Quiz />,
  },
  {
    path: '/reciclagem',
    element: <RecycleGame />,
  },
  {
    path: '/personalizar',
    element: <Personalizar />,
  },
  {
    path: '/perfil',
    element: <Profile />,
  },
  {
    path: '/ranking',
    element: <Ranking />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
