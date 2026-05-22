
// App principal que configura o contexto global e o roteamento
import { UserProvider } from "./UserContext";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";

export default function App() {
  return (
    // UserProvider disponibiliza o estado do usuário em toda a aplicação
    <UserProvider>
      {/* RouterProvider aplica as rotas definidas no arquivo routes.tsx */}
      <RouterProvider router={router} />
    </UserProvider>
  );
}
