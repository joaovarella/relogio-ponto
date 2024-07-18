import FormularioCadastro from "../../Components/FormularioCadastro";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../../Firebase/firebase";

import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  doc,
} from "firebase/firestore";
import "./cadastroUsuario.css";

export default function CadastroUsuario() {
  const db = getFirestore(firebaseConfig);
  const userColletionRef = collection(db, "users");

  const [usuarios, setUsuarios] = useState([]);

  function consultarArray() {
    usuarios.map((usuario) => {
      console.log(usuario);
    });
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userColletionRef);
      setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  async function deleteUser(id) {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    deletarColaborador(id);
  }

  function deletarColaborador(id) {
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
  }

  return (
    <section>
      <div>
        <FormularioCadastro
          aoCadastrarUsuario={(usuario) => setUsuarios([...usuarios, usuario])}
          userColletionRef={userColletionRef}
        />
      </div>
      <div>
        <button onClick={consultarArray}>Clique aqui para consultar</button>
      </div>

      {usuarios.map((usuario) => (
        <div key={usuario.id}>
          <ul>
            <li>{usuario.id}</li>
            <li>{usuario.email}</li>
          </ul>
          <button onClick={() => deleteUser(usuario.id)}>Apagar</button>
        </div>
      ))}
    </section>
  );
}
