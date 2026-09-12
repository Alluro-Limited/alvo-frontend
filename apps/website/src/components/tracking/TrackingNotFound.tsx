import {trackingContent} from "@/content/tracking";

export function TrackingNotFound() {
  const {notFound} = trackingContent;

  return (
    <div className="mx-auto flex w-full max-w-[938px] items-center justify-center rounded-xl bg-grey-100 py-20">
      <div className="flex w-[365px] flex-col items-center gap-4 text-center">
        <img alt={notFound.iconAlt} className="size-14" src={notFound.icon} />
        <div className="flex flex-col gap-1">
          <p className="font-sans text-sm font-medium tracking-[0.14px] text-black">{notFound.heading}</p>
          <p className="font-sans text-xs font-normal tracking-[0.12px] text-grey-500">
            {notFound.message}
            <span className="font-medium text-black">{notFound.code}</span>
            {notFound.suffix}
            <a href={notFound.supportHref} className="text-primary-500 hover:underline">
              {notFound.support}
            </a>
            {notFound.end}
          </p>
        </div>
      </div>
    </div>
  );
}
