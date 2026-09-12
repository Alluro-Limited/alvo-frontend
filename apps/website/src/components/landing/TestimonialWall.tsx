import {useState} from "react";

import {TestimonialCard} from "./TestimonialCard";
import {TestimonialHex} from "./TestimonialHex";

import {testimonialsContent} from "@/content/landing";

type Person = (typeof testimonialsContent.people)[number];

export function TestimonialWall() {
  const {rows, people, fillerAvatars, map} = testimonialsContent;
  const [selectedId, setSelectedId] = useState<string>(people[0].id);
  const selected = people.find((person) => person.id === selectedId) ?? people[0];

  const personByCell = new Map<number, Person>();
  people.forEach((person) => personByCell.set(person.cell, person));

  const rowRanges = rows.map((count, index) => ({
    count,
    start: rows.slice(0, index).reduce((total, value) => total + value, 0),
  }));

  return (
    <div className="relative w-full">
      <img
        src={map.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[1440px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-30"
      />

      <div className="relative flex flex-col items-center gap-10">
        <div className="flex flex-col items-center">
          {rowRanges.map(({count, start}, rowIndex) => (
            <div key={start} className={`flex justify-center gap-x-1.5 ${rowIndex > 0 ? "-mt-3" : ""}`}>
              {Array.from({length: count}, (_, columnIndex) => {
                const cell = start + columnIndex;
                const person = personByCell.get(cell);
                return (
                  <TestimonialHex
                    key={cell}
                    person={person}
                    fillerSrc={fillerAvatars[cell % fillerAvatars.length]}
                    selected={person?.id === selectedId}
                    onSelect={() => {
                      if (person) setSelectedId(person.id);
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <TestimonialCard person={selected} />
      </div>
    </div>
  );
}
