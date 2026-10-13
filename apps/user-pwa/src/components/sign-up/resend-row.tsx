import {useEffect, useState} from "react";
import {m} from "@/paraglide/messages";

const RESEND_SECONDS = 30;

function formatCountdown(seconds: number): string {
  return `00:${String(seconds).padStart(2, "0")}`;
}

interface ResendRowProps {
  onResend: () => void;
  onChangeMethod: () => void;
}

/** "Resend code in 00:xx" countdown that flips to the resend link at zero, plus "Try another method". */
export function ResendRow({onResend, onChangeMethod}: ResendRowProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {secondsLeft > 0 ? (
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">
          {m["su.resend_in"]({time: formatCountdown(secondsLeft)})}
        </p>
      ) : (
        <p className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px]">
          <span className="text-grey-500">{m["su.no_code"]()}</span>
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(RESEND_SECONDS);
              onResend();
            }}
            className="font-medium text-primary-500"
          >
            {m["su.resend"]()}
          </button>
        </p>
      )}
      <button type="button" onClick={onChangeMethod} className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500">
        {m["su.try_another"]()}
      </button>
    </div>
  );
}
