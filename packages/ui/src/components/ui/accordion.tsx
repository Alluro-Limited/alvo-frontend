import {Accordion as AccordionPrimitive} from "@base-ui/react/accordion";

import {cn} from "cnfast";

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;
type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;
type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;
type AccordionPanelProps = React.ComponentProps<typeof AccordionPrimitive.Panel>;

function Accordion({className, ...props}: AccordionProps) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex w-full flex-col gap-4", className)} {...props} />;
}

function AccordionItem({className, ...props}: AccordionItemProps) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("rounded-2xl bg-grey-100", className)} {...props} />;
}

function AccordionTrigger({className, children, ...props}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/acc flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl py-2 pr-2 pl-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50",
          className
        )}
        {...props}
      >
        {children}
        <span className="flex size-[52px] shrink-0 items-center justify-center rounded-lg bg-grey-200 text-black">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="transition-transform duration-200 group-data-[panel-open]/acc:rotate-45"
          >
            <path d="M10 4v12M4 10h12" />
          </svg>
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionPanel({className, ...props}: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0",
        className
      )}
      {...props}
    />
  );
}

export {Accordion, AccordionItem, AccordionTrigger, AccordionPanel};
export type {AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionPanelProps};
