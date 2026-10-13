import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";

const LOADING_MS = 1400;

/** The "Loading - Home" frame: three pulsing dots while the session warms up after verify. */
export function LoadingHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => void navigate({to: "/home", replace: true}), LOADING_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white" role="status">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="size-2 animate-bounce rounded-full bg-grey-400" style={{animationDelay: `${delay}ms`}} />
        ))}
      </div>
    </main>
  );
}
