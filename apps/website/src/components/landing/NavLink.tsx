import {Link} from "@tanstack/react-router";
import type {ReactNode} from "react";

// Internal route paths ("/", "/couriers") navigate client-side to avoid a full-page
// reload flash; in-page hash anchors ("#how-it-works") stay plain anchors.
export function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
