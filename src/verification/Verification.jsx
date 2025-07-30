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
      return toast.error("Invalid Link");
    }
    authService
      .verifyEmailAddress(userId, secret)
      .then(function (response) {
        toast.success("Verified!, you can login now.");
        setVerified(true);
        navigate("/auth");
      })
      .catch(function (error) {
        toast.error("Not verified!");
        setVerified(false);
        navigate("/auth");
      })
      .finally(() => {
        authService.logout();
        navigate("/auth");
      });
  }, [verified]);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      {verified ? (
        <div >
          <p>Verified</p>
          <Check color="white" />
        </div>
      ) : (
        <ThreeDot
          color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
          text="please wait ,verifying you..."
          textColor="white"
        />
      )}
    </div>
  );
};

export default Verification;
