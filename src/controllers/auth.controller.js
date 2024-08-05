import { v4 as uuidv4 } from "uuid";
import * as OTPAuth from "otpauth";
import { encode } from "hi-base32";

import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { firebaseConfig, auth, db, app } from "../Firebase/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//Registra no Authentication do Firebase e registra no Firestore (Database) criando com o id com o UID do Authentication
export const registerUser = async (name, email, password) => {
  try {
    // Crie o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);

    // Adicione o usuário ao Firestore usando o UID do usuário
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      otp_enabled: false,
      otp_verified: false,
      otp_auth_url: "",
      otp_base32: "",
    });

    return {
      status: "success",
      message: "Registered successfully, please login",
    };
  } catch (error) {
    // Verificar o código de erro corretamente
    if (error.code === "auth/email-already-in-use") {
      return {
        status: "fail",
        message: "Email already exists, please use another email address",
      };
    }
    return {
      status: "error",
      message: error.message || "An unknown error occurred",
    };
  }
};

//Realiza o login
export const loginUser = async (email, password) => {
  try {
    // Autenticar o usuário no Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Authenticated user UID:", user.uid);

    // Verifique se o usuário está autenticado
    if (!user) {
      throw new Error("No user with that email exists");
    }

    // Obtenha os dados do usuário do Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    // Verifique se o documento existe
    if (!userDoc.exists()) {
      throw new Error("No user data found in Firestore");
    }

    // Obtenha os dados do usuário
    const userData = userDoc.data();
    const userResponse = {
      id: user.uid,
      name: userData?.name ?? "", // Use an empty string if userData?.name is null or undefined
      email: user.email ?? "", // No need for ! as user.email is already a string
      otp_enabled: userData?.otp_enabled ?? false, // Use false if userData?.otp_enabled is null or undefined
    };

    return {
      status: "success",
      user: userResponse,
    };
  } catch (error) {
    console.error("Error during user login:", error);

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      status: "error",
      message: errorMessage,
    };
  }
};

//Gera um codigo aleatorio para criar o QR Code
export const generateRandomBase32 = () => {
  const uuid = uuidv4();
  const buffer = new Uint8Array(
    uuid.split("").map((char) => char.charCodeAt(0))
  );
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

//Estrutura o multifator para ser utilizado dentro do aplicativo, além de criar o código do QR Code para que o componente TwoFactorAuth apresente no front-end
export const generateOTP = async (user_id) => {
  try {
    // Obtenha o documento do usuário do Firestore
    const userDocRef = doc(db, "users", user_id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("No user with that ID exists");
    }

    const base32_secret = generateRandomBase32();

    const totp = new OTPAuth.TOTP({
      issuer: "codevoweb.com",
      label: "CodevoWeb",
      algorithm: "SHA1",
      digits: 6,
      secret: base32_secret,
    });

    const otpauth_url = totp.toString();

    // Atualize o documento do usuário no Firestore
    await updateDoc(userDocRef, {
      otp_auth_url: otpauth_url,
      otp_base32: base32_secret,
    });

    return {
      status: "success",
      base32: base32_secret,
      otpauth_url,
    };
  } catch (error) {
    console.error("Error during generate OTP:", error);

    // Verificar o tipo de erro e retornar uma mensagem apropriada
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      status: "error",
      message: errorMessage,
    };
  }
};

//Cria dentro do usuario se foi cadastrado corretamente o multifator e verifica se o token é o correto para que isso ocorra
export const verifyOTP = async (user_id, token) => {
  try {
    // Obtenha o documento do usuário do Firestore
    const userDocRef = doc(db, "users", user_id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("Fail");
    }

    const user = userDoc.data();

    let totp = new OTPAuth.TOTP({
      issuer: "codevoweb.com",
      label: "CodevoWeb",
      algorithm: "SHA1",
      digits: 6,
      secret: user.otp_base32,
    });

    let delta = totp.validate({ token });

    if (delta === null) {
      throw new Error("Token verify Error Delta");
    }

    // Atualize o documento do usuário no Firestore
    await updateDoc(userDocRef, {
      otp_enabled: true,
      otp_verified: true,
    });

    const updatedUserDoc = await getDoc(userDocRef);
    const updatedUser = updatedUserDoc.data();

    const userResponse = {
      id: user.uid,
      name: updatedUser?.name,
      email: updatedUser?.email,
      otp_enabled: updatedUser?.otp_enabled,
    };

    return {
      status: "success",
      otp_verified: true,
      user: userResponse,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      status: "error",
      message: error,
    };
  }
};

//Valida se o token do aplicativo vai liberar o usuario
export const validateOTP = async (user_id, token) => {
  try {
    // Obtenha o documento do usuário do Firestore
    const userDocRef = doc(db, "users", user_id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("Token is invalid or user doesn't exist");
    }

    const user = userDoc.data();

    // Configure o TOTP com o segredo armazenado
    let totp = new OTPAuth.TOTP({
      issuer: "codevoweb.com",
      label: "CodevoWeb",
      algorithm: "SHA1",
      digits: 6,
      secret: user?.otp_base32 ?? "",
    });

    // Valide o token
    let delta = totp.validate({ token, window: 1 });

    if (delta === null) {
      throw new Error("Token Validate Error Delta");
    }
    return {
      status: "success",
      otp_valid: true,
    };
  } catch (error) {
    console.error("Error Validate OTP:", error);

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      status: "error",
      message: errorMessage,
    };
  }
};

//Desabilitar o MultiFator
export const disableOTP = async (user_id) => {
  try {
    // Obtenha o documento do usuário do Firestore
    const userDocRef = doc(db, "users", user_id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User does not exist");
    }

    // Atualize o documento do usuário no Firestore
    await updateDoc(userDocRef, {
      otp_enabled: false,
    });

    // Obtenha o usuário atualizado
    const updatedUserDoc = await getDoc(userDocRef);
    const updatedUser = updatedUserDoc.data();

    const userResponse = {
      id: user_id,
      name: updatedUser?.name,
      email: updatedUser?.email,
      otp_enabled: updatedUser?.otp_enabled,
    };

    return {
      status: "success",
      otp_disabled: true,
      user: userResponse,
    };
  } catch (error) {
    console.error("Error during user login:", error);

    // Verificar o tipo de erro e retornar uma mensagem apropriada
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      status: "error",
      message: errorMessage,
    };
  }
};

//Pesquisa um usuario e retorna seus atributos
export const findUser = async (user_id) => {
  try {
    // Obtenha os dados do usuário do Firestore
    const userDocRef = doc(db, "users", user_id);
    const userDoc = await getDoc(userDocRef);

    // Verifique se o documento existe
    if (!userDoc.exists()) {
      throw new Error("No user data found in Firestore");
    }

    // Obtenha os dados do usuário
    const userData = userDoc.data();
    const userResponse = {
      id: user_id,
      name: userData?.name ?? "", // Use an empty string if userData?.name is null or undefined
      email: userData?.email ?? "", // No need for ! as user.email is already a string
      otp_enabled: userData?.otp_enabled ?? false, // Use false if userData?.otp_enabled is null or undefined
    };

    return {
      status: "success",
      user: userResponse,
    };
  } catch (error) {
    console.error("Error during user login:", error);

    // Verificar o tipo de erro e retornar uma mensagem apropriada
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      status: "error",
      message: errorMessage,
    };
  }
};

export default {
  registerUser,
  loginUser,
  generateOTP,
  verifyOTP,
  validateOTP,
  disableOTP,
};
