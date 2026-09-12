export function IncognitoIcon({className}: {className?: string}) {
  return (
    <span
      className={`relative inline-flex size-[42px] items-center justify-center overflow-hidden rounded border-[3px] border-white bg-accent-500 ${className ?? ""}`}
    >
      <img alt="" className="size-8" src="/landing/hero/frame.svg" />
    </span>
  );
}
