import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const userData = useSelector((state) => state.auth.userData);
  const loading = useSelector((state) => state.auth.loading);
  if (loading) return null; // Don't render anything while loading

  if (!userData || Object.keys(userData).length === 0){
    return <Navigate to="/auth" />;}
  return <Outlet />;
};

export default ProtectedRoute;
