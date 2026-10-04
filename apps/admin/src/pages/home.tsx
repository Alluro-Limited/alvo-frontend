import {m} from "@/paraglide/messages";

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center md:px-8 lg:px-10">
      <h1 className="text-[28px] leading-[1.2] font-bold tracking-[-0.01em]">{m["home.title"]()}</h1>
      <p className="text-[16px] leading-[1.4] tracking-[0.01em] text-grey-600">{m["home.description"]()}</p>
    </main>
  );
}
