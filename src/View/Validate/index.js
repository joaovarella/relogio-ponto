import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {
  validateOTP as validateOTPController,
  findUser,
} from "../../controllers/auth.controller";
import { auth } from "../../Firebase/firebase";
import { object, setErrorMap, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { set } from "store";

const validate2faSchema = object({
  token: string().min(1, "Authentication code is required"),
});

const Validate2faPage = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDetails = await findUser(user.uid);
        if (userDetails.status === "success") {
          setAuthUser({
            ...userDetails.user,
          });
        }
      }
    };
    fetchUserDetails();
  }, []);

  const {
    handleSubmit,
    setFocus,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(validate2faSchema),
  });

  const validate2fa = async (token) => {
    try {
      const response = await validateOTPController(authUser?.id, token);

      if (response.status === "success") {
        navigate("/profile");
      } else if (response.status === "error") {
        setError("token", {
          type: "manual",
          message: "Invalid authentication code",
        });
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
      });
    }
  };

  const onSubmitHandler = (values) => {
    validate2fa(values.token);
  };

  useEffect(() => {
    setFocus("token");
  }, [setFocus]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        alignContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F9F9F9",
        width: "100%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "2rem", md: "3rem" }, // Responsividade para tamanhos diferentes
          fontWeight: 600,
          color: "#F9B800", // Cor ajustada para correspondência
          mb: 4,
        }}
      >
        Welcome Back
      </Typography>

      <Typography variant="h6" sx={{ mb: 4 }}>
        Verify the Authentication Code
      </Typography>

      <Card
        sx={{
          width: { xs: "90%", sm: "384px" }, // Responsividade para diferentes tamanhos de tela
          height: "auto", // Altura ajustada para conteúdo dinâmico
          padding: { xs: "16px", sm: "32px" }, // Padding responsivo
          borderRadius: "1rem",
          mx: "auto", // Centraliza o Card horizontalmente
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          sx={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" }, // Ajuste de tamanho do texto
              fontWeight: "bold",
              color: "#142149",
            }}
          >
            Two-Factor Authentication
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Open the two-step verification app on your mobile device to get your
            verification code.
          </Typography>
          <TextField
            {...register("token")}
            fullWidth
            label="Authentication Code"
            variant="outlined" // Adiciona uma borda ao TextField
          />
          <Typography sx={{ mt: 2, fontSize: "0.75rem", color: "red" }}>
            {errors.token ? errors.token.message : null}
          </Typography>
          <Button variant="contained" type="submit" sx={{ mt: 4 }}>
            Authenticate
          </Button>
          <MuiLink component={Link} to="/login">
            Back to basic login
          </MuiLink>
        </Box>
      </Card>
    </Box>
  );
};

export default Validate2faPage;
