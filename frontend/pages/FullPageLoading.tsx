import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function (): JSX.Element {
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const interval = 50;
    const handle = setInterval(() => {
      setDuration((x) => x + interval);
    }, interval);
    return () => {
      clearInterval(handle);
    };
  }, []);

  if (duration < 250) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center space-y-4">
        <CircularProgress />
        {duration > 2000 && <p>Still loading</p>}
      </div>
    );
  }
}
