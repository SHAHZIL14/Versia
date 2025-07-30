import { useEffect } from "react";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { ThreeDot } from "react-loading-indicators";
const Verification = () => {
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
      })
      .catch(function (error) {
        toast.error("Not verified!");
      })
      .finally(() => {
        authService.logout();
      });
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        text="please wait ,verifying you..."
        textColor="white"
      />
    </div>
  );
};

export default Verification;
