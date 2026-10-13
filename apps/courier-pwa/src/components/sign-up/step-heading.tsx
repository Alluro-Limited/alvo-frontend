interface StepHeadingProps {
  title: string;
  description: string;
}

export function StepHeading({title, description}: StepHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[28px] leading-[35px] font-bold tracking-[-0.01em]">{title}</h1>
      <p className="text-[15px] leading-[22px] text-grey-600">{description}</p>
    </div>
  );
}
