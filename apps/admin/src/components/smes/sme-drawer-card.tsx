interface SmeDrawerCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

/** Bordered section card inside the SME drawer — bold title row plus content. */
export function SmeDrawerCard({title, action, children}: SmeDrawerCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-grey-100/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base leading-[1.4] font-bold tracking-[0.16px] text-black">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
