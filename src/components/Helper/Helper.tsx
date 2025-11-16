import { PUBLIC_ROUTES } from "@/constants/path";
import { useAppStore } from "@/contexts/app.context";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return isAuthenticated ? (
    <>{children || <Outlet />}</>
  ) : (
    <Navigate to="/login" />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function RejectedRoute() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={PUBLIC_ROUTES.home} replace />;
}
