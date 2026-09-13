type StatementCard = {
  id: string;
  heading: string;
  body: string;
  theme: "teal" | "cream";
  icon: string;
  label?: string;
};

type StatementCardsProps = {
  cards: readonly StatementCard[];
  icons: Record<string, React.ReactNode>;
};

export function StatementCards({cards, icons}: StatementCardsProps) {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto grid max-w-360 gap-6 lg:grid-cols-2">
        {cards.map((card) => {
          const isTeal = card.theme === "teal";

          return (
            <div
              key={card.id}
              className={`flex min-h-[480px] flex-col justify-between rounded-xl p-10 ${isTeal ? "bg-primary-500 text-white" : "bg-cream text-black"}`}
            >
              <div className="flex items-start gap-3">
                {icons[card.icon]}
                {card.label ? <span className="font-sans text-lg font-medium leading-[1.4] tracking-[0.18px]">{card.label}</span> : null}
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="font-sans text-[28px] font-bold leading-[1.1] tracking-[-0.32px] lg:text-[32px]">{card.heading}</h2>
                <p className={`font-sans text-lg font-normal leading-[1.4] tracking-[0.18px] ${isTeal ? "text-white" : "text-grey-600"}`}>
                  {card.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
