import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TwoFactorAuth from "../../Components/TwoFactorAuth/TwoFactorAuth";
import React from "react";
import {
  generateOTP,
  disableOTP,
  findUser,
} from "../../controllers/auth.controller";
import { auth } from "../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Button, Card, Grid, Typography } from "@mui/material";

const ProfilePage = () => {
  const [secret, setSecret] = useState({
    otpauth_url: "",
    base32: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!openModal) {
      fetchUserDetails();
    }
  }, [openModal]);

  const generateQrCode = async () => {
    try {
      const response = await generateOTP(authUser.id);

      if (response.status === "success") {
        setOpenModal(true);
        console.log({
          base32: response.base32,
          otpauth_url: response.otpauth_url,
        });
        setSecret({
          base32: response.base32 || "",
          otpauth_url: response.otpauth_url || "",
        });
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response?.data?.detail ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const disableTwoFactorAuth = async () => {
    try {
      const response = await disableOTP(authUser?.id);
      console.log(response);

      if (response.status === "success") {
        setAuthUser((prev) => ({ ...prev, otp_enabled: false }));
      }

      toast.warning("Two Factor Authentication Disabled", {
        position: "top-right",
      });
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9F9F9",
        width: "100%",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          padding: "1rem",
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
            padding: "3rem",
            borderRadius: "1rem",
            margin: "2rem",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ fontSize: "2em", mb: 2 }}>
                  Profile Page
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1em" }}>
                  Name: {authUser?.name}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1em" }}>
                  Email: {authUser?.email}
                </Typography>
                {/* <Typography variant="h6" sx={{ fontSize: "1em" }}>
                  ID: {authUser?.id}
                </Typography> */}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h5" sx={{ fontSize: "1.5em", mb: 1 }}>
                  Mobile App Authentication (2FA)
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1em", mb: 2 }}>
                  Secure your account with TOTP two-factor authentication.
                </Typography>
                {authUser?.otp_enabled ? (
                  <Button
                    sx={{ width: "100%" }}
                    variant="contained"
                    type="button"
                    onClick={() => disableTwoFactorAuth()}
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button
                    sx={{ width: "100%" }}
                    variant="contained"
                    type="button"
                    onClick={() => generateQrCode()}
                  >
                    Setup 2FA
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>
        {openModal && (
          <TwoFactorAuth
            base32={secret.base32}
            otpauth_url={secret.otpauth_url}
            user_id={authUser?.id}
            closeModal={() => setOpenModal(false)}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
