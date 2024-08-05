import { auth } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await signOut(auth);
      if (response === "success") {
        console.log(response);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h1>Nada Encontrado</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
