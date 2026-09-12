import {testimonialsContent} from "@/content/landing";

type Person = (typeof testimonialsContent.people)[number];

export function TestimonialCard({person}: {person: Person}) {
  return (
    <figure className="flex max-w-[490px] flex-col items-center gap-4 rounded-2xl bg-white/60 p-6 text-center backdrop-blur-sm">
      <blockquote className="text-lg leading-[1.4] tracking-[0.01em] text-black">“{person.quote}”</blockquote>
      <figcaption className="flex items-center gap-1 text-base tracking-[0.01em]">
        <span className="font-medium text-primary-500">{person.name}</span>
        <span className="text-grey-500">/ {person.role}</span>
      </figcaption>
    </figure>
  );
}
