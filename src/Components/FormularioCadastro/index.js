import { useState } from "react";
import Botao from "../Botao";
import Campo from "../Campo";
import "./formulario.css";

const Formulario = ({ aoCadastrarUsuario }) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const aoSubmeter = (evento) => {
    evento.preventDefault();
    console.log("usuario: ", nome, "senha: ", senha);
    aoCadastrarUsuario({
      nome,
      senha,
    });
  };

  return (
    <section className="formulario-container">
      <form className="formulario" onSubmit={aoSubmeter}>
        <h2>Preencha os dados para criar um usuario</h2>
        <Campo
          obrigatorio={true}
          type="email"
          label="Nome"
          placeholder="Digite seu nome "
          valor={nome}
          aoAlterado={(valor) => setNome(valor)}
        />
        <Campo
          obrigatorio={true}
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          valor={senha}
          aoAlterado={(valor) => setSenha(valor)}
          complete="current-password"
        />
        <Botao texto="Criar card" />
      </form>
    </section>
  );
};

export default Formulario;
