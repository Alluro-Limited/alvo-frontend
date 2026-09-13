export const blogHeroContent = {
  heading: "Notes on private, smarter delivery.",
  subhead: "Perspectives on privacy, logistics and building for Nigerian businesses.",
  texture: {
    src: "/blog/texture.png",
    alt: "",
  },
  icon: {
    src: "/blog/hero-icon.svg",
    alt: "",
  },
} as const;

export const blogPostsContent = {
  texture: {
    src: "/blog/card-texture.png",
    alt: "",
  },
  featured: {
    tag: "Featured · Privacy",
    title: "Why couriers should never know your name",
    body: "The case for anonymity as the default in last-mile delivery and how smart lockers make it practical, not just aspirational.",
    readTime: "8 min read",
  },
  statement: {
    cards: [
      {
        id: "delivery",
        icon: "home",
        heading: "Private, secure, affordable delivery for everyone.",
        body: "We combine IoT smart lockers, partner infrastructure and route optimization to cut logistics costs while keeping sender and recipient data confidential from end to end.",
        theme: "teal" as const,
      },
      {
        id: "network",
        icon: "home",
        heading: "A nationwide network you can trust.",
        body: "Starting in Lagos and expanding across Nigeria. An asset-light platform that grows through partners, not fleets.",
        theme: "cream" as const,
      },
    ],
  },
  cta: {
    heading: "Get new posts in your inbox.",
    subhead: "Occasional writing on privacy, logistics and product — no noise.",
    primary: {label: "See open roles", href: "/"},
    secondary: {label: "Get in touch", href: "mailto:hello@alvo.com"},
    background: {
      texture: {src: "/blog/cta/texture.png", alt: ""},
      client: {src: "/blog/cta/client.png", alt: "A smiling client with a delivered box"},
    },
  },
  values: {
    eyebrow: "WHAT WE VALUE",
    heading: "The principles behind the platform.",
    columns: 3 as const,
    items: [
      {
        id: "privacy",
        icon: "/blog/icons/privacy.svg",
        title: "Privacy first",
        body: "Anonymity isn't a feature we added. it's the foundation every decision is built on.",
      },
      {
        id: "integrity",
        icon: "/blog/icons/integrity.svg",
        title: "Integrity of custody",
        body: "Every parcel is accounted for at every handoff, with tamper-proof lockers and verified codes.",
      },
      {
        id: "efficiency",
        icon: "/blog/icons/efficiency.svg",
        title: "Efficiency over assets",
        body: "We use what already exists — routes and spaces — to keep costs and emissions down.",
      },
    ],
  },
  latest: {
    heading: "Latest posts",
    posts: [
      {
        id: "product",
        tag: "Product",
        title: "Inside Bulk Send: 10,000 parcels, one upload",
        body: "How batch dispatch works under the hood. validation, clustering and labels.",
        readTime: "6 min read",
      },
      {
        id: "logistics",
        tag: "LOGISTICS",
        title: "The asset-light case for African delivery",
        body: "Why partner infrastructure beats owned fleets on cost and reach.",
        readTime: "6 min read",
      },
      {
        id: "security",
        tag: "SECURITY",
        title: "How our lockers stay safe offline",
        body: "Sensors, tamper detection and sync — the anatomy of a smart locker.",
        readTime: "7 min read",
      },
      {
        id: "smes",
        tag: "SMES",
        title: "5 ways vendors lose customers at delivery",
        body: "And how private, reliable pickup keeps them coming back.",
        readTime: "4 min read",
      },
      {
        id: "couriers",
        tag: "COURIERS",
        title: "Routing that respects your fuel",
        body: "How clustering turns scattered drops into efficient runs.",
        readTime: "5 min read",
      },
      {
        id: "company",
        tag: "COMPANY",
        title: "Our Lagos and Abuja pilot, so far",
        body: "Early lessons from putting privacy-first delivery on the ground.",
        readTime: "6 min read",
      },
    ],
  },
} as const;
