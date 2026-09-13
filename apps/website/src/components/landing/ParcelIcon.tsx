export function ParcelIcon({className}: {className?: string}) {
  return (
    <span
      className={`relative inline-flex size-[42px] items-center justify-center overflow-hidden rounded border-[3px] border-white bg-success-500 ${className ?? ""}`}
    >
      <span className="absolute right-[7px] top-1/2 inline-flex -translate-y-1/2 gap-3">
        {Array.from({length: 6}).map((_, i) => (
          <img key={i} alt="" className="h-[22px] w-[28px] shrink-0" src="/landing/hero/parcel-box.png" />
        ))}
      </span>
    </span>
  );
}
