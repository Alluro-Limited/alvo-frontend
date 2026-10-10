/** Parses a comma-separated domain list (e.g. `VITE_WORK_EMAIL_DOMAINS`) into lowercase, trimmed entries. */
export function parseWorkEmailDomains(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

export const workEmailDomains = parseWorkEmailDomains(import.meta.env.VITE_WORK_EMAIL_DOMAINS);
