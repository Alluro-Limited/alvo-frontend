import {useState} from "react";

import {Footer} from "@/components/landing/Footer";
import {Navbar} from "@/components/landing/Navbar";
import {TrackingActions} from "@/components/tracking/TrackingActions";
import {TrackingInput} from "@/components/tracking/TrackingInput";
import {TrackingNotFound} from "@/components/tracking/TrackingNotFound";
import {TrackingSuccess} from "@/components/tracking/TrackingSuccess";
import {trackingContent} from "@/content/tracking";

type TrackingStatus = "idle" | "success" | "not-found";

export function TrackingPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<TrackingStatus>("idle");

  const handleTrack = () => {
    if (!code.trim()) {
      setStatus("idle");
      return;
    }
    if (code.trim().toUpperCase() === trackingContent.successCode.toUpperCase()) {
      setStatus("success");
    } else {
      setStatus("not-found");
    }
  };

  return (
    <>
      <Navbar />
      <main id="main" className="relative flex min-h-screen flex-col items-center bg-white pb-24 pt-56">
        <TrackingInput code={code} onChange={setCode} onTrack={handleTrack} />

        {status === "success" && (
          <div className="mt-16 w-full px-4">
            <TrackingSuccess />
          </div>
        )}

        {status === "not-found" && (
          <div className="mt-16 w-full px-4">
            <TrackingNotFound />
          </div>
        )}

        <div className="mt-16">
          <TrackingActions />
        </div>
      </main>
      <Footer />
    </>
  );
}
