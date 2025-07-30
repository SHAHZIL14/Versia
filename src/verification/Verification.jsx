import { useEffect, useState } from "react";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
const Verification = () => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(null); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) {
      toast.error("Invalid Link");
      setVerified(false); 
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    authService
      .verifyEmailAddress(userId, secret)
      .then(() => {
        toast.success("Verified! You can login now.");
        setVerified(true);
      })
      .catch(() => {
        toast.error("Verification failed.");
        setVerified(false);
      })
      .finally(() => {
        authService.logout();
        setTimeout(() => navigate("/auth"), 2000);
      });
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      {verified === true ? (
        <div className="flex flex-col items-center gap-2 text-white">
          <p>✅ Verified</p>
          <Check color="white" />
        </div>
      ) : verified === false ? (
        <div className="flex flex-col items-center gap-2 text-white">
          <p>❌ Verification Failed</p>
        </div>
      ) : (
        <ThreeDot
          color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
          text="Please wait, verifying you..."
          textColor="white"
        />
      )}
    </div>
  );
};


export default Verification;
