import type {ReactNode} from "react";
import backgroundUrl from "@/assets/sign-in-background.jpg";

interface SignInLayoutProps {
  children: ReactNode;
}

/**
 * Full-screen auth backdrop: the fluid texture is scaled and offset to match the Figma crop
 * (3840×2160 inside a 1440×1024 frame), with the brand teal hard-light blended over it.
 */
export function SignInLayout({children}: SignInLayoutProps) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 px-4 py-10">
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute top-1/2 left-[39.7%] -z-20 aspect-video w-[max(266.67vw,375vh)] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary-500 mix-blend-hard-light" />
      {children}
    </main>
  );
}
