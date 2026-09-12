export const courierHeroContent = {
  headline: ["Earn on the routes", "you already drive."],
  subhead:
    "Accept a manifest, pick up by code, deliver to a locker, get paid. No customer addresses, no doorstep drama — just efficient runs and clear payouts.",
  primaryCta: "Get the app",
  primaryHref: "#download",
  secondaryCta: "See how it works",
  secondaryHref: "#how-it-works",
} as const;

export const courierAppContent = {
  eyebrow: "Your day, simplified",
  heading: "Everything you need in one app.",
  subhead: "Alvo matches you to parcels along your path, then guides you locker to locker. You never handle a customer's personal details.",
  features: [
    "Smart assignments by route overlap, capacity and SLA.",
    "Turn-by-turn navigation between locker nodes.",
    "One-tap proof of delivery and performance scoring.",
    "Wallet with transparent, on-time payouts.",
  ],
  media: {
    src: "/courier/app-preview.png",
    alt: "The Alvo courier app showing a package details screen with locker route and access code",
  },
} as const;

export const courierStepsContent = {
  eyebrow: "Why drivers stay",
  heading: "From application to first run in four steps.",
  cta: "Download App",
  ctaHref: "#download",
  steps: [
    {
      id: "apply",
      icon: "/courier/icon-apply.svg",
      title: "Apply",
      description: "Share your details and vehicle type. Cars, bikes and vans all welcome.",
      phone: "/courier/steps/phone-1.png",
    },
    {
      id: "verify",
      icon: "/courier/icon-verify.svg",
      title: "Get verified",
      description: "Quick checks on ID and documents keep the network trusted.",
      phone: "/courier/steps/phone-2.png",
    },
    {
      id: "drive",
      icon: "/courier/icon-drive.svg",
      title: "Start driving",
      description: "Accept your first manifest and get paid as you go.",
      phone: "/courier/steps/phone-3.png",
    },
    {
      id: "apply-again",
      icon: "/courier/icon-apply.svg",
      title: "Apply",
      description: "Share your details and vehicle type. Cars, bikes and vans all welcome.",
      phone: "/courier/steps/phone-4.png",
    },
  ],
} as const;

export const courierCtaContent = {
  heading: "Turn your route into income.",
  subhead: "Join the couriers moving parcels privately and efficiently across Lagos and Abuja.",
  cta: "Get the app",
  ctaHref: "#download",
  image: {src: "/courier/cta-car.jpg", alt: "A smiling Alvo courier at the wheel of a car"},
} as const;

export const courierFaqContent = {
  eyebrow: "REQUIREMENTS",
  heading: "What you'll need.",
  items: [
    {
      q: "What vehicles qualify?",
      a: "Motorbikes, cars and vans are all supported. We match parcel size and volume to your capacity when assigning manifests.",
    },
    {
      q: "How and when do I get paid?",
      a: "Earnings accrue in your in-app wallet with each completed delivery and are paid out on a clear, regular schedule. Every payout is itemized.",
    },
    {
      q: "Do I need to commit to fixed hours?",
      a: "No. You choose when to go online. Manifests are offered based on your location and availability, so you can drive as much or as little as you like.",
    },
  ],
} as const;

export const courierBenefitsContent = {
  eyebrow: "Why drivers stay",
  heading: "Good money, less hassle.",
  cards: [
    {
      id: "pay",
      icon: "/courier/icon-pay.svg",
      title: "Good money, less hassle.",
      description: "See what each run pays before you accept, and watch your wallet update as you deliver.",
    },
    {
      id: "schedule",
      icon: "/courier/icon-schedule.svg",
      title: "Flexible schedule",
      description: "Go online when it suits you. Fit deliveries around your existing trips and other work.",
    },
    {
      id: "routes",
      icon: "/courier/icon-routes.svg",
      title: "Fuller routes",
      description: "Clustered manifests mean more drops per trip and less empty driving across town.",
    },
    {
      id: "safe",
      icon: "/courier/icon-safe.svg",
      title: "Safer for you too",
      description: "You never carry customer contacts. Codes and lockers keep both sides anonymous.",
    },
  ],
} as const;
