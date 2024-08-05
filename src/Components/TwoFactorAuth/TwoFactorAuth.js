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
import { Box, Button, Input, ListItem, Modal, Typography } from "@mui/material";

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
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box>
          <Typography variant="h5">Two-Factor Authentication (2FA)</Typography>
          <Box className="p-6 space-y-4">
            <Typography variant="h6">
              Configuring Google Authenticator or Authy
            </Typography>
            <Box>
              <ListItem>
                Install Google Authenticator (IOS - Android) or Authy (IOS -
                Android).
              </ListItem>
              <ListItem>In the authenticator app, select "+" icon.</ListItem>
              <ListItem>
                Select "Scan a barcode (or QR code)" and use the phone's camera
                to scan this barcode.
              </ListItem>
            </Box>
            <Box>
              <Typography>Scan QR Code</Typography>
              <Box className="flex justify-center">
                <img
                  className="block w-64 h-64 object-contain"
                  src={qrcodeUrl}
                  alt="qrcode url"
                />
              </Box>
            </Box>
            <Box>
              <h4>Or Enter Code Into Your App</h4>
              <p className="text-sm">SecretKey: {base32} (Base32 encoded)</p>
            </Box>
            <Box>
              <h4>Verify Code</h4>
              <Typography className="text-sm">
                For changing the setting, please verify the authentication code:
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
              <Input
                {...register("token", {
                  required: "Authentication code is required",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
                placeholder="Authentication Code"
              />
              <Typography className="mt-2 text-xs text-red-600">
                {errors.token ? errors.token.message : null}
              </Typography>

              <Box>
                <Button variant="outlined" type="button" onClick={closeModal}>
                  Close
                </Button>
                <Button variant="outlined" type="submit">
                  Verify & Activate
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TwoFactorAuth;
