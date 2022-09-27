import { Navigate } from "react-router-dom";

export default function (): JSX.Element {
  // For now, redirect to the explore page instead
  return (
    <div className="grow">
      <Navigate to="/explore" replace={true} />
    </div>
  );
}
