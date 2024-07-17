import FormularioCadastro from "../../Components/FormularioCadastro";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../../Firebase/firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function CadastroUsuario() {
  const db = getFirestore(firebaseConfig);
  const userColletionRef = collection(db, "users");

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userColletionRef);
      setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  return (
    <div>
      <FormularioCadastro
        aoCadastrarUsuario={(usuario) => setUsuarios([...usuarios, usuario])}
        userColletionRef={userColletionRef}
      />
    </div>
  );
}

//   function deletarColaborador(id) {
//     debugger;
//     setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
//   }
