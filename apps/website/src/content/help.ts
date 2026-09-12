export const helpHeroContent = {
  heading: "How can we help?",
  subhead: "Search guides and answers, or browse by topic below.",
  placeholder: "Search for a topic, e.g. 'access code'",
  icon: "/help/hero-icon.svg",
} as const;

export const helpCtaContent = {
  heading: "Still stuck?",
  subhead: "Our team is happy to help with anything the guides didn't cover.",
  primary: {label: "Contact support", href: "/contact"},
  secondary: {label: "How it works", href: "/#how-it-works"},
  background: {
    texture: {src: "/help/cta/texture.png", alt: ""},
    portrait: {src: "/help/cta/portrait.png", alt: ""},
    client: {src: "/help/cta/client-blur.png", alt: ""},
  },
} as const;

export const helpFaqContent = {
  eyebrow: "POPULAR QUESTIONS",
  heading: "Quick answers.",
  items: [
    {
      q: "How do I regenerate a lost access code?",
      a: "Open the parcel in your app and choose 'regenerate code'. The previous code stops working immediately for security.",
    },
    {
      q: "Where can I find a locker near me?",
      a: "The app displays lockers around you across partner locations. Filter by distance or availability to pick the most convenient.",
    },
    {
      q: "How do I contact support?",
      a: "Reach us any time from the contact page. Business and enterprise customers also get priority channels.",
    },
    {
      q: "What payment methods can I use?",
      a: "Card and wallet for individuals; wallet and card for businesses.",
    },
  ],
} as const;

type HelpTopic = {
  body: string;
  heading: string;
  icon: string;
  id: string;
  items: readonly {href: string; label: string}[];
};

export const helpTopicsContent: readonly HelpTopic[] = [
  {
    id: "sending",
    icon: "/help/icons/lock.svg",
    heading: "Sending & receiving",
    body: "Booking, drop-off, codes and pickup.",
    items: [
      {label: "How to send a parcel", href: "/blog/how-to-send-a-parcel"},
      {label: "Collecting from a locker", href: "/blog/collecting-from-a-locker"},
      {label: "Tracking your delivery", href: "/blog/tracking-your-delivery"},
    ],
  },
  {
    id: "business",
    icon: "/help/icons/bank-card.svg",
    heading: "For business",
    body: "Bulk Send, CSV, invoicing and roles.",
    items: [
      {label: "Getting started with Bulk Send", href: "/blog/getting-started-with-bulk-send"},
      {label: "Preparing your CSV", href: "/blog/preparing-your-csv"},
      {label: "Understanding volume rates", href: "/blog/understanding-volume-rates"},
    ],
  },
  {
    id: "couriers",
    icon: "/help/icons/lock.svg",
    heading: "For couriers",
    body: "Manifests, navigation and payouts.",
    items: [
      {label: "Accepting a manifest", href: "/blog/accepting-a-manifest"},
      {label: "How payouts work", href: "/blog/how-payouts-work"},
      {label: "Requirements to drive", href: "/blog/requirements-to-drive"},
    ],
  },
  {
    id: "privacy",
    icon: "/help/icons/shield.svg",
    heading: "Privacy & security",
    body: "How your data stays masked.",
    items: [
      {label: "Locker access methods", href: "/blog/locker-access-methods"},
      {label: "Our privacy model", href: "/blog/our-privacy-model"},
      {label: "Regenerating a code", href: "/blog/regenerating-a-code"},
    ],
  },
  {
    id: "api",
    icon: "/help/icons/code.svg",
    heading: "API & developers",
    body: "Endpoints, webhooks and integration.",
    items: [
      {label: "API overview", href: "/blog/api-overview"},
      {label: "Webhook events", href: "/blog/webhook-events"},
      {label: "Get API access", href: "/blog/get-api-access"},
    ],
  },
  {
    id: "account",
    icon: "/help/icons/lock.svg",
    heading: "Account & billing",
    body: "Payments, wallet and receipts.",
    items: [
      {label: "Payment methods", href: "/blog/payment-methods"},
      {label: "Business wallet", href: "/blog/business-wallet"},
      {label: "Contact support", href: "/blog/contact-support"},
    ],
  },
] as const;
