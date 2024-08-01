import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/Logo.png";
import { auth } from "../../Firebase/firebase";
import {
  getAuth,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import "./styles.css";
import { loginUser } from "../../../controllers/auth.controller";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // const tenantId = "88f25485-ede9-45ce-9940-edb9b136e8d3"; // O ID do tenant que você está usando

  // const [signInWithEmailAndPassword, user, loading, error] =
  //   useSignInWithEmailAndPassword(auth);

  // useEffect(() => {
  //   handleMicrosoftRedirectResult();
  // }, []);

  // function handleSignIn(e) {
  //   e.preventDefault();
  //   setErrorMessage("");
  //   setSuccessMessage("");
  //   signInWithEmailAndPassword(email, password)
  //     .then(() => {
  //       setSuccessMessage("Login bem-sucedido!");
  //     })
  //     .catch((error) => {
  //       setErrorMessage("Erro ao fazer login: " + error.message);
  //     });
  // }

  // function handleMicrosoftSignInPopup() {
  //   const provider = new OAuthProvider('microsoft.com');
  //   provider.addScope('mail.read');
  //   provider.addScope('calendars.read');
  //   provider.setCustomParameters({ prompt: 'consent', tenant: tenantId });  // Inclua o tenantId aqui

  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       const credential = OAuthProvider.credentialFromResult(result);
  //       const accessToken = credential.accessToken;
  //       const idToken = credential.idToken;
  //       setSuccessMessage("Login com Microsoft bem-sucedido!");
  //       console.log('Access Token:', accessToken);
  //       console.log('ID Token:', idToken);
  //       console.log('Usuário autenticado:', result.user);
  //     })
  //     .catch((error) => {
  //       setErrorMessage("Erro ao fazer login com Microsoft: " + error.message);
  //       console.error('Error during sign-in with popup:', error);
  //     });
  // }

  // function handleMicrosoftSignInRedirect() {
  //   const provider = new OAuthProvider('microsoft.com');
  //   provider.addScope('mail.read');
  //   provider.addScope('calendars.read');
  //   provider.setCustomParameters({ prompt: 'consent', tenant: tenantId });  // Inclua o tenantId aqui

  //   signInWithRedirect(auth, provider);
  // }

  // function handleMicrosoftRedirectResult() {
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       if (result) {
  //         const credential = OAuthProvider.credentialFromResult(result);
  //         const accessToken = credential.accessToken;
  //         const idToken = credential.idToken;
  //         setSuccessMessage("Login com Microsoft bem-sucedido!");
  //         console.log('Access Token:', accessToken);
  //         console.log('ID Token:', idToken);
  //         console.log('Usuário autenticado:', result.user);
  //       }
  //     })
  //     .catch((error) => {
  //       setErrorMessage("Erro ao fazer login com Microsoft: " + error.message);
  //       console.error('Error during sign-in with redirect:', error);
  //     });
  // }

  if (loading) {
    return <p>Carregando...</p>;
  }
  if (user) {
    return <p>Bem-vindo, {user.email}</p>;
  }

  return (
    <div className="container">
      <header className="header">
        <img src={logoImg} alt="Workflow" className="logoImg" />
        <span>Por favor, digite suas informações de login</span>
      </header>

      <form onSubmit={loginUser}>
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Digite seu e-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="button">
          Entrar <img src={arrowImg} alt="->" />
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <div className="footer">
          <p>Você não tem uma conta?</p>
          <Link to="/CadastroUsuario">Crie a sua conta aqui</Link>
        </div>
      </form>
    </div>
  );
}
