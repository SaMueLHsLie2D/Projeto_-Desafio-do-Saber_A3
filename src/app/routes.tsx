import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import RecycleGame from './pages/RecycleGame';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Ranking from './pages/Ranking';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

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
    path: '/recompensas',
    element: <Rewards />,
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
