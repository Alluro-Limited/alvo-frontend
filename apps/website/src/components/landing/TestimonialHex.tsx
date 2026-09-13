import {testimonialsContent} from "@/content/landing";

type Person = (typeof testimonialsContent.people)[number];

export function TestimonialHex({
  person,
  fillerSrc,
  selected,
  onSelect,
}: {
  person?: Person;
  fillerSrc: string;
  selected: boolean;
  onSelect: () => void;
}) {
  if (!person) {
    return <img src={fillerSrc} alt="" aria-hidden="true" className="w-[72px] max-w-none opacity-60 grayscale" />;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Read ${person.name}'s testimonial`}
      className={`rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary-500 ${
        selected ? "z-10 scale-110" : "grayscale hover:grayscale-0"
      }`}
    >
      <img src={person.avatar} alt={person.name} className="w-[72px] max-w-none" />
    </button>
  );
}
