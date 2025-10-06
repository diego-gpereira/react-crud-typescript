import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. Importe as novas páginas
import { PaginaListagem } from './pages/Listagem.tsx';
import { PaginaEdicao } from './pages/CadastrarEditar.tsx';
import { PaginaExcluir } from './pages/Excluir.tsx';


// 2. Adicione as novas rotas ao "mapa"
const router = createBrowserRouter([
  {
    path: "/",
    element: <PaginaListagem />,
  },
  {
    path: "/cadastrar", // Rota para a página de cadastro
    element: <PaginaEdicao isEdit={false} />,
  },
  {
    path: "/editar/:id", // Rota para a página de edição (o ':id' é um parâmetro)
    element: <PaginaEdicao isEdit={true}/>,
  },
  {
    path: "/excluir/:id", // Rota para a página de cadastro
    element: <PaginaExcluir />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)