import { PUBLIC_ROUTES } from "@/constants/path";
import { useAppStore } from "@/contexts/app.context";
import { setAccessTokenToLS, setRefreshTokenToLS } from "@/utils/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Google = () => {
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated } = useAppStore();
  const navigate = useNavigate();
  console.log(
    searchParams.get("refresh_token"),
    searchParams.get("access_token")
  );

  useEffect(() => {
    if (
      !searchParams ||
      !searchParams.get("access_token") ||
      !searchParams.get("refresh_token")
    ) {
      navigate(PUBLIC_ROUTES.notFound);
    } else {
      setAccessTokenToLS(searchParams.get("access_token") as string);
      setRefreshTokenToLS(searchParams.get("refresh_token") as string);
      setIsAuthenticated(
        (searchParams.get("access_token") as string) ? true : false
      );
    }
  }, [searchParams, navigate]);
  return <div>Google</div>;
};

export default Google;
