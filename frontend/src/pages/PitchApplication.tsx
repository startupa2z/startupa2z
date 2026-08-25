import { Navigate, useSearchParams } from "react-router-dom";

const PitchApplication = () => {
  const [searchParams] = useSearchParams();
  const preview = import.meta.env.DEV && searchParams.get("preview") === "1";
  return <Navigate to={preview ? "/welcome?intent=pitch&preview=1" : "/welcome?intent=pitch"} replace />;
};

export default PitchApplication;
