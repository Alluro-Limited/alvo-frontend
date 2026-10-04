import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center md:px-8 lg:px-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] leading-[1.2] font-bold tracking-[-0.01em]">{m["not_found.title"]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.01em] text-grey-600">{m["not_found.description"]()}</p>
      </div>
      <Button render={<Link to="/" />} nativeButton={false}>
        {m["not_found.return_home"]()}
      </Button>
    </main>
  );
}
