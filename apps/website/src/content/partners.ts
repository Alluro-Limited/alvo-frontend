export const partnersHeroContent = {
  headline: "Turn your space or fleet into a delivery node.",
  subhead:
    "Alvo is asset-light by design, we grow through partners. Host a locker, move parcels, or integrate your technology, and share in the value.",
  primaryCta: "Apply to partner",
  primaryHref: "#apply",
  secondaryCta: "About lockers",
  secondaryHref: "/smart-lockers",
} as const;

export const partnersWaysContent = {
  eyebrow: "WAYS TO PARTNER",
  heading: "Three ways to plug in.",
  items: [
    {
      id: "hosts",
      icon: "/partners/icons/car.svg",
      title: "Locker hosts",
      body: "Estates, malls, fuel stations, hotels and religious houses host a locker and earn from every parcel it moves.",
      tone: "success" as const,
    },
    {
      id: "logistics",
      icon: "/partners/icons/home.svg",
      title: "Logistics partners",
      body: "Fleet owners and transport operators put existing routes to work carrying Alvo manifests.",
      tone: "accent" as const,
    },
    {
      id: "technology",
      icon: "/partners/icons/plugin.svg",
      title: "Technology partners",
      body: "Platforms and stores integrate Alvo delivery directly into their own products via our API.",
      tone: "secondary" as const,
    },
  ],
} as const;

export const partnersFormContent = {
  heading: "Tell us about your space or fleet",
  submit: "Submit application",
  fields: {
    organisation: {
      label: "Organisation",
      placeholder: "Business or estate name",
    },
    partnerType: {
      label: "Partner type",
      placeholder: "Select partner type",
      options: ["Locker host", "Logistics partner", "Technology partner"],
    },
    location: {
      label: "Location",
      placeholder: "Enter full address",
    },
    notes: {
      label: "Anything else?",
      placeholder: "Tell us a little about your space, footfall or fleet",
    },
  },
} as const;

export const partnersCtaContent = {
  heading: "Let's bring private delivery to your neighbourhood.",
  subhead: "Apply to host a locker or partner your fleet — we'll handle the rest.",
  primaryCta: "Apply now",
  primaryHref: "#apply",
  secondaryCta: "Ask a question",
  secondaryHref: "#question",
  client: {src: "/sme/cta/client.png", alt: "A person preparing a parcel to place into an Alvo locker"},
} as const;

export const partnersWhyHostContent = {
  eyebrow: "WHY HOST",
  heading: "Benefits of joining the network.",
  columns: 4 as const,
  items: [
    {
      id: "revenue",
      icon: "/partners/icons/naira.svg",
      title: "New revenue",
      body: "Earn from footfall and parcels with minimal effort.",
    },
    {
      id: "visitors",
      icon: "/partners/icons/visitors.svg",
      title: "More visitors",
      body: "Pickups bring people to your location, again and again.",
    },
    {
      id: "risk",
      icon: "/partners/icons/safety.svg",
      title: "Zero risk",
      body: "We install, maintain and insure the hardware.",
    },
    {
      id: "insights",
      icon: "/partners/icons/chart.svg",
      title: "Data & insights",
      body: "See parcel volume, peak times, and customer patterns.",
    },
  ],
} as const;
