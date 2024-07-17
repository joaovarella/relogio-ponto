import FormularioCadastro from "../../Components/FormularioCadastro";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firebaseConfig } from "../../Firebase/firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function CadastroUsuario() {
  const db = getFirestore(firebaseConfig);
  const userColletionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const inicial = await getDocs(userColletionRef);
    };
  }, []);

  const inicial = [
    {
      id: uuidv4(),
      nome: "JULIANA AMOASEI",
      senha: "123123",
    },
    {
      id: uuidv4(),
      nome: "DANIEL ARTINE",
      senha: "123123",
    },
  ];

  const [usuarios, setUsuarios] = useState(inicial);

  return (
    <div>
      <FormularioCadastro
        inicial={inicial.map((user) => user.nome)}
        aoCadastrarUsuario={(usuario) => setUsuarios([...usuarios, usuario])}
      />
    </div>
  );
}

//   function deletarColaborador(id) {
//     debugger;
//     setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
//   }
