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
      style={{
        display: "grid",
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
        className="text-4xl lg:text-6xl text-center font-[600] text-ct-yellow-600 mb-4"
      >
        Welcome Back
      </Typography>

      <Typography variant="h6">Verify the Authentication Code</Typography>
      <Card
        sx={{
          width: "384px",
          height: "354px",
          padding: "32px",
          borderRadius: "1rem",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          style={{
            display: "grid",
            direction: "column",
            gap: "1rem",
          }}
        >
          <Typography
            variant="h4"
            className="text-center text-3xl font-semibold text-[#142149]"
          >
            Two-Factor Authentication
          </Typography>
          <Typography variant="caption" className="text-center text-sm">
            Open the two-step verification app on your mobile device to get your
            verification code.
          </Typography>
          <TextField
            {...register("token")}
            fullWidth
            label="Authentication Code"
          />

          <Typography className="mt-2 text-xs text-red-600">
            {errors.token ? errors.token.message : null}
          </Typography>

          <Button variant="contained" type="submit" className="mt-4">
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
