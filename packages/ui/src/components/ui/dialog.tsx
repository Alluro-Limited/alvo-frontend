import {Dialog as DialogPrimitive} from "@base-ui/react/dialog";

import {cn} from "cnfast";

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type DialogBackdropProps = React.ComponentProps<typeof DialogPrimitive.Backdrop>;
type DialogPopupProps = React.ComponentProps<typeof DialogPrimitive.Popup>;
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/** The dimmed page behind a modal: grey veil + light blur, per the Figma overlay. */
function DialogBackdrop({className, ...props}: DialogBackdropProps) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn("fixed inset-0 bg-grey-500/30 backdrop-blur-[3px]", className)}
      {...props}
    />
  );
}

function DialogPopup({className, ...props}: DialogPopupProps) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white", className)}
      {...props}
    />
  );
}

function DialogTitle({className, ...props}: DialogTitleProps) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-2xl leading-[1.2] font-medium", className)} {...props} />;
}

function DialogDescription({className, ...props}: DialogDescriptionProps) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm leading-[1.4]", className)} {...props} />;
}

function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export {Dialog, DialogPortal, DialogBackdrop, DialogPopup, DialogTitle, DialogDescription, DialogClose};
