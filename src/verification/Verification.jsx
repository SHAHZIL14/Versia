import { useEffect, useState } from "react";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
const Verification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) {
      toast.error("Invalid Link");
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    authService
      .verifyEmailAddress(userId, secret)
      .then(() => {
        toast.success("Verified ✅ you can log in now.");
      })
      .catch(() => {
        toast.error("Verification failed ❌");
      })
      .finally(() => {
        authService.logout();
        navigate("/auth");
      });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        text="Please wait, verifying you..."
        textColor="white"
      />
    </div>
  );
};

export default Verification;
