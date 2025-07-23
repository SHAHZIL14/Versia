import { useEffect, useState } from "react";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { runAuthWatcher } from "../../other/AuthWatcher";
const Verification = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      return;
    }
    authService
      .verifyEmailAddress(userId, secret)
      .then(function (response) {
        toast.success("Verified");
        navigate("/login");
      })
      .catch(function (error) {
        toast.error("Not verified!");
        navigate("/login");
      });
  }, []);
  return <div>verifying..</div>;
};

export default Verification;
