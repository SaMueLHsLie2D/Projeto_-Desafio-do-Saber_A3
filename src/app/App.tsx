import { RouterProvider } from 'react-router';
import { UserProvider } from './UserContext';
import { router } from "./routes";
export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

