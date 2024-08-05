import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  verifyOTP as verifyOTPController,
  findUser,
} from "../../controllers/auth.controller";
import { auth } from "../../Firebase/firebase";
import {
  Box,
  Button,
  Input,
  ListItem,
  Modal,
  Typography,
  Divider,
  List,
} from "@mui/material";

const TwoFactorAuth = ({ otpauth_url, base32, user_id, closeModal }) => {
  const [qrcodeUrl, setQrcodeUrl] = useState("");
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDetails = await findUser(user.uid);
        if (userDetails.status === "success") {
          setAuthUser(userDetails.user);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const {
    handleSubmit,
    register,
    setFocus,
    setError,
    formState: { errors },
  } = useForm();

  const verifyOtp = async (token) => {
    try {
      const response = await verifyOTPController(user_id, token);
      if (response.status === "success") {
        closeModal();
        toast.success("Two-Factor Auth Enabled Successfully", {
          position: "top-right",
        });
      } else if (response.status === "error") {
        setError("token", {
          type: "manual",
          message: "Código Invalido",
        });
      }
    } catch (error) {
      toast.error("An error occurred while verifying the OTP.", {
        position: "top-right",
      });
    }
  };

  const onSubmitHandler = (values) => {
    verifyOtp(values.token);
  };

  useEffect(() => {
    if (otpauth_url) {
      QRCode.toDataURL(otpauth_url)
        .then(setQrcodeUrl)
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [otpauth_url]);

  useEffect(() => {
    setFocus("token");
  }, [setFocus]);

  return (
    <Modal open={true} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" },
          maxWidth: 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
        >
          Two-Factor Authentication (2FA)
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "#1919a4", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Configuring Google Authenticator or Authy
          </Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              Install Google Authenticator (iOS - Android) or Authy (iOS -
              Android).
            </ListItem>
            <ListItem sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              In the authenticator app, select "+" icon.
            </ListItem>
            <ListItem sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              Select "Scan a barcode (or QR code)" and use the phone's camera to
              scan this barcode.
            </ListItem>
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{ color: "#1919a4", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Scan QR Code
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ width: "100%", maxWidth: 256, height: "auto" }}
              src={qrcodeUrl}
              alt="QR Code"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "#1919a4", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Or Enter Code Into Your App
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            SecretKey: {base32} (Base32 encoded)
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "#1919a4", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Verify Code
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            For changing the setting, please verify the authentication code:
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Input
            {...register("token", {
              required: "Authentication code is required",
            })}
            sx={{
              mb: 2,
              bgcolor: "grey.50",
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
              width: "100%",
              p: 1,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
            placeholder="Authentication Code"
          />
          <Typography
            sx={{
              color: "red",
              mb: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {errors.token ? errors.token.message : null}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              type="button"
              onClick={closeModal}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              type="submit"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Verify & Activate
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TwoFactorAuth;
