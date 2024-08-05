import FormularioCadastro from "../../Components/FormularioCadastro";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../../Firebase/firebase";
import { toast } from "react-toastify";
import { registerUser as registerUserController } from "../../controllers/auth.controller";
import { useNavigate } from "react-router-dom";

import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  doc,
} from "firebase/firestore";
import "./cadastroUsuario.css";

export default function CadastroUsuario() {
  const navigate = useNavigate();

  // function consultarArray() {
  //   usuarios.map((usuario) => {
  //     console.log(usuario);
  //   });
  // }
  const registerUser = async (name, email, senha) => {
    try {
      const response = await registerUserController(name, email, senha);
      if (response.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
      });
    }
  };

  // useEffect(() => {
  //   const getUsers = async () => {
  //     const data = await getDocs(userColletionRef);
  //     setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   getUsers();
  // }, []);

  // async function deleteUser(id) {
  //   const userDoc = doc(db, "users", id);
  //   await deleteDoc(userDoc);
  //   deletarColaborador(id);
  // }

  // function deletarColaborador(id) {
  //   setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
  // }

  return (
    <section>
      <div>
        <FormularioCadastro aoCadastrarUsuario={registerUser} />
      </div>
      {/* <div>
        <button onClick={consultarArray}>Clique aqui para consultar</button>
      </div> */}

      {/* {usuarios.map((usuario) => (
        <div key={usuario.id}>
          <ul>
            <li>{usuario.id}</li>
            <li>{usuario.email}</li>
          </ul>
          <button onClick={() => deleteUser(usuario.id)}>Apagar</button>
        </div>
      ))} */}
    </section>
  );
}
