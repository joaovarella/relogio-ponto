import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import MenuLateral from "./Components/MenuLateral";
// import Principal from "./Components/Principal";
import Login from "./View/Login";
import CadastroPonto from "./View/CadastroPonto";
// import Home from "./View/home";
import CadastroFuncionario from "./View/CadastroFuncionario";
import ConsultarFuncionario from "./View/ConsultarFuncionario";
import ConsultarPonto from "./View/ConsultarPonto";
import DeletarFuncionario from "./View/DeletarFuncionario";
import DeletarPonto from "./View/DeletarPonto";
import Historico from "./View/Historico";
import Relatorios from "./View/Relatorios";
import CadastroUsuario from "./View/CadastroUsuario";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
        <Route path="/CadastrarFuncionario" element={<CadastroFuncionario />} />
        <Route path="/CadastrarPonto" element={<CadastroPonto />} />
        <Route
          path="/ConsultarFuncionario"
          element={<ConsultarFuncionario />}
        />
        <Route path="/ConsultarPonto" element={<ConsultarPonto />} />
        <Route path="/DeletarFuncionario" element={<DeletarFuncionario />} />
        <Route path="/DeletarPonto" element={<DeletarPonto />} />
        <Route path="/Historico" element={<Historico />} />
        <Route path="/Relatorios" element={<Relatorios />} />
        <Route path="*" element={<h1>Nada encontrado</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
