export const aboutHeroContent = {
  heading: "Delivery should respect the people using it.",
  subhead:
    "Alvo was built on a simple conviction: you shouldn't have to hand your name, number and home address to a stranger just to send a parcel.",
} as const;

export const aboutMissionContent = {
  paragraphs: [
    "Alvo is a privacy-first, asset-light logistics platform transforming how individuals and businesses send, receive and manage parcels across Nigeria. By combining IoT-enabled smart lockers, dynamic route optimisation and a zero-exposure data policy, Alvo delivers a courier experience where neither sender nor recipient ever has to share a name, number or home address with a driver.",
    "Currently live in Lagos, Alvo is also proud to offer Bulk Send, a batch-dispatch platform that lets SMEs, online vendors and fulfilment centres ship up to 2,000 parcels in a single upload, with consolidated billing and recipient privacy preserved on every order.",
  ],
  image: {
    src: "/about/mission.png",
    alt: "A person using the Alvo locker interface and mobile app to send or collect a parcel",
  },
} as const;

export const aboutCardsContent = {
  cards: [
    {
      id: "mission",
      icon: "mission",
      label: "Mission",
      heading: "Private, secure, affordable delivery for everyone.",
      body: "We combine IoT smart lockers, partner infrastructure and route optimization to cut logistics costs while keeping sender and recipient data confidential from end to end.",
      theme: "teal" as const,
    },
    {
      id: "vision",
      icon: "vision",
      label: "Vision",
      heading: "A nationwide network you can trust.",
      body: "Starting in Lagos and expanding across Nigeria. An asset-light platform that grows through partners, not fleets.",
      theme: "cream" as const,
    },
  ],
} as const;

export const aboutValuesContent = {
  eyebrow: "WHAT WE VALUE",
  heading: "The principles behind the platform.",
  columns: 3 as const,
  items: [
    {
      id: "privacy",
      icon: "/about/icons/privacy.svg",
      title: "Privacy first",
      body: "Anonymity isn't a feature we added. it's the foundation every decision is built on.",
    },
    {
      id: "integrity",
      icon: "/about/icons/integrity.svg",
      title: "Integrity of custody",
      body: "Every parcel is accounted for at every handoff, with tamper-proof lockers and verified codes.",
    },
    {
      id: "efficiency",
      icon: "/about/icons/efficiency.svg",
      title: "Efficiency over assets",
      body: "We use what already exists — routes and spaces — to keep costs and emissions down.",
    },
  ],
} as const;

export const aboutCtaContent = {
  heading: "Come build private logistics with us.",
  subhead: "Whether you want to send, host a locker, drive, or join the team there's a place for you.",
  primaryCta: "See open roles",
  primaryHref: "/",
  secondaryCta: "Get in touch",
  secondaryHref: "mailto:hello@alvo.com",
  background: {
    src: "/about/cta/background.png",
    alt: "A courier delivering an Alvo parcel",
  },
} as const;
