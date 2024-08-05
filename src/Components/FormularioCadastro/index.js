import { useState, useEffect } from "react";
import Botao from "../Botao";
import Campo from "../Campo";
import "./formulario.css";
import { addDoc } from "firebase/firestore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase";
import { Link } from "react-router-dom";

const Formulario = ({ aoCadastrarUsuario }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [name, setName] = useState("");

  // const [createUserWithEmailAndPassword, user, loading, error] =
  //   useCreateUserWithEmailAndPassword(auth);

  // function handleSignOut(evento) {
  //   evento.preventDefault();
  //   createUserWithEmailAndPassword(email, senha);
  //   aoSubmeter(evento);
  // }

  // if (loading) {
  //   return <p>carregando...</p>;
  // }

  const aoSubmeter = async (evento) => {
    evento.preventDefault();
    aoCadastrarUsuario(name, email, senha);
  };

  // async function CriarUser() {
  //   const user = await addDoc(userColletionRef, {
  //     email,
  //   });
  //   return user.id;
  // }

  return (
    <section className="formulario-container">
      <form className="formulario" onSubmit={aoSubmeter}>
        <h2>Cadastro Usuario</h2>
        <Campo
          obrigatorio={true}
          type="name"
          label="name"
          name="name"
          placeholder="Digite seu nome"
          valor={name}
          aoAlterado={(valor) => setName(valor)}
        />
        <Campo
          obrigatorio={true}
          type="email"
          label="email"
          name="email"
          placeholder="Digite seu email"
          valor={email}
          aoAlterado={(valor) => setEmail(valor)}
        />
        <Campo
          obrigatorio={true}
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          name="senha"
          valor={senha}
          aoAlterado={(valor) => setSenha(valor)}
          complete="current-password"
        />
        <Botao texto="Criar usuario" />
        <div className="footer">
          <p>Você já tem uma conta?</p>
          <Link to="/login">Acesse sua conta aqui</Link>
        </div>
      </form>
    </section>
  );
};

export default Formulario;
