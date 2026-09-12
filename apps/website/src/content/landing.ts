export type HeroHeadlineSegment = {type: "text"; value: string} | {type: "icon"; value: "parcel" | "incognito"};

export const heroContent = {
  badge: "Privacy-first logistics",
  headlineLines: [
    [
      {type: "text", value: "Your parcel"},
      {type: "icon", value: "parcel"},
      {type: "text", value: "travels."},
    ],
    [
      {type: "text", value: "Your identity"},
      {type: "icon", value: "incognito"},
      {type: "text", value: "doesn't."},
    ],
  ] as const satisfies readonly (readonly HeroHeadlineSegment[])[],
  subhead: "Locker-to-locker delivery. Couriers see only a code, never your name, number, or address.",
  primaryCta: "Get the app",
  secondaryCta: "Track package",
  qrTitle: "Download the App",
  qrSubtitle: "Available for iOS and Android",
} as const;

export const privacyContent = {
  eyebrow: "WHY ALVO",
  heading: ["A delivery network built", "around your privacy."],
  subhead: "Most couriers know exactly who you are and where you live. We designed Alvo so they never have to.",
  image: {src: "/landing/privacy/locker.png", alt: "An Alvo smart parcel locker with a touchscreen for secure parcel access"},
  reasons: [
    {
      id: "anonymous",
      icon: "/landing/privacy/icon-anonymous.svg",
      title: "Anonymous by default",
      description:
        "Sender and recipient details are masked end-to-end. Couriers route by locker and code, never a name, phone number, or doorstep.",
      tags: ["Zero-exposure", "NDPR & GDPR"],
    },
    {
      id: "lockers",
      icon: "/landing/privacy/icon-lockers.svg",
      title: "Tamper-proof lockers",
      description:
        "IoT smart lockers with sensors and verified custody at every handoff. QR, OTP and NFC access mean your parcel is only opened by the right person.",
      tags: ["IoT secured", "Chain of custody"],
    },
    {
      id: "cheaper",
      icon: "/landing/privacy/icon-cheaper.svg",
      title: "30–40% cheaper",
      description:
        "An asset-light model that rides existing routes and partner spaces instead of fleets and warehouses. Lower overhead, lower prices, paid only at point of service.",
      tags: ["Asset-light", "Pay-at-service"],
    },
  ],
} as const;

export const howItWorksContent = {
  heading: "How it works",
  steps: [
    {
      id: "book",
      title: "Book it",
      description: "Create a parcel in the app or at any console. A tracking code is issued instantly — no personal details shared.",
    },
    {
      id: "drop",
      title: "Drop it off",
      description: "Scan the QR at your nearest smart locker. The right compartment opens, you place it, done.",
    },
    {
      id: "route",
      title: "Smart routing",
      description: "Our engine clusters parcels by path and assigns a courier already heading that way — by code, not by customer.",
    },
    {
      id: "collect",
      title: "Collect it",
      description: "The recipient gets an access code and grabs it from a locker near them, 24/7, with no waiting around.",
    },
  ],
} as const;

export const featureRows = [
  {
    id: "smart-lockers",
    eyebrow: "SMART LOCKERS",
    heading: "Your Parcel's Safest Stop, Minutes Away",
    learnMoreHref: "/smart-lockers",
    reverse: false,
    media: {src: "/landing/features/media-lockers.png", alt: "Alvo app package details screen shown on a phone against a teal backdrop"},
    points: [
      {
        title: "Open around the clock",
        description:
          "Solar-ready, sensor-equipped lockers hosted by estates, malls, fuel stations and hotels — collect on your schedule, 24/7, with no doorstep handoff.",
      },
      {
        title: "Resilient by design",
        description: "Every compartment reports tampering in real time, keeps working offline, and syncs the moment it reconnects.",
      },
    ],
  },
  {
    id: "for-business",
    eyebrow: "For SMEs & merchants",
    heading: "Ship a Hundred Orders Before Your Coffee's Cold",
    learnMoreHref: "/business",
    reverse: true,
    media: {src: "/landing/features/media-dashboard.png", alt: "Alvo merchant dashboard showing batch order analytics"},
    points: [
      {
        title: "Up to 10,000 parcels per batch",
        description:
          "Drop a CSV or call the API — Alvo validates the data, generates parcel IDs, clusters routes and produces print-ready labels, recipient privacy intact on every order.",
      },
      {
        title: "Batch analytics, live",
        description:
          "A dashboard for delivery success, on-time rates and spend — with volume rates that fall as you scale and one consolidated invoice per batch.",
      },
    ],
  },
  {
    id: "couriers",
    eyebrow: "For couriers",
    heading: "Earn on the Routes You Already Drive",
    learnMoreHref: "/couriers",
    reverse: false,
    media: {src: "/landing/features/media-earnings.png", alt: "Alvo courier earnings screen showing wallet balance and payouts"},
    points: [
      {
        title: "Manifests sorted by your path",
        description: "Multi-parcel runs matched to route overlap, capacity and SLA, more drops per trip, less empty driving across town.",
      },
      {
        title: "Privacy protects you too",
        description:
          "You never carry a customer's address book. Accept, pick up, deliver by code, get paid, with transparent, on-time payouts.",
      },
    ],
  },
] as const;

export const statsContent = {
  heading: "Built to scale, measured by trust.",
  subhead: "Real numbers from a network designed for integrity first, speed second, and privacy always.",
  stats: [
    {id: "integrity", value: "99.9%", label: "Parcel integrity", icon: "/landing/stats/icon-integrity.svg"},
    {id: "lockers", value: "500+", label: "Smart locker planned", icon: "/landing/stats/icon-lockers.svg"},
    {id: "couriers", value: "100+", label: "Independent couriers", icon: "/landing/stats/icon-couriers.svg"},
    {id: "privacy", value: "0", label: "Privacy incident", icon: "/landing/stats/icon-privacy.svg"},
  ],
} as const;

export {testimonialsContent} from "./testimonials";

export const coverageContent = {
  eyebrow: "COVERAGE",
  heading: ["Live in Lagos state.", "Growing fast."],
  subhead:
    "We're piloting across Lagos, with nationwide expansion underway. Every new partner space becomes another locker minutes from your customers.",
  pills: ["Active now", "Abuja soon"],
  map: {src: "/landing/coverage/map.png", alt: "Map of Africa with a location pin marking Lagos, Nigeria"},
} as const;

export const faqContent = {
  eyebrow: "FAQ",
  heading: "Questions, answered.",
  items: [
    {
      q: "How do couriers deliver without my details?",
      a: "Every parcel is routed by locker location and a tracking code. Your name, number and address are masked end-to-end, so couriers only ever see where to collect and where to drop, never who you are.",
    },
    {
      q: "What if no one is home to receive it?",
      a: "There's no doorstep handoff. Parcels rest safely in a smart locker until the recipient collects them with an access code, any time of day. No missed-delivery games.",
    },
    {
      q: "How much does it cost?",
      a: "Individuals pay per send at the point of service, no subscription. Businesses get transparent volume rates, typically 30–40% below traditional courier pricing thanks to our asset-light model.",
    },
    {
      q: "Can I send many parcels at once?",
      a: "Yes, Bulk Send lets you upload up to 10,000 parcels per batch via CSV or API. We generate IDs, cluster routes, produce label sheets and bill you once, with recipient privacy preserved on every order.",
    },
    {
      q: "How safe are the lockers?",
      a: "Each compartment opens only with verified QR, OTP or NFC access and is monitored by environmental and tamper sensors. Lockers keep working offline and sync the moment they reconnect.",
    },
    {
      q: "Where is Alvo available?",
      a: "We're live across Lagos and Abuja, with nationwide expansion in progress. New partner locations are added regularly, so coverage near you keeps growing.",
    },
  ],
} as const;

export const finalCtaContent = {
  heading: ["Send something today.", "Keep it private forever."],
  subhead: "Join the senders, businesses and couriers moving smarter across Nigeria, without giving away a thing.",
  texture: {src: "/landing/final-cta/texture.jpg"},
} as const;

export const navContent = {
  brand: "Alvo",
  links: [
    {label: "How it works", href: "/#how-it-works"},
    {label: "Smart lockers", href: "/smart-lockers"},
    {label: "For business", href: "/business"},
    {label: "Partners", href: "/partners"},
    {label: "About us", href: "/about"},
    {label: "Couriers", href: "/couriers"},
  ],
  cta: "Download App",
  downloadHref: "/#final-cta",
  menuLabel: "Toggle navigation menu",
} as const;
