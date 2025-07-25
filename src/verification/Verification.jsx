import { useEffect } from "react";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
const Verification = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if(!userId || !secret){
      return toast.error("Invalid Link");
    }
    authService
      .verifyEmailAddress(userId, secret)
      .then(function (response) {
        toast.success("Verified");
      })
      .catch(function (error) {
        toast.error("Not verified!");
      })
      .finally(() => {
        authService.logout();
      });
  }, []);
  return <div>verifying..</div>;
};

export default Verification;
