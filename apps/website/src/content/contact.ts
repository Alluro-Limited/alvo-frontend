export const contactHeroContent = {
  heading: "Let's talk.",
  subhead: "Whether you're sending, scaling, partnering or just curious — we'd love to hear from you.",
} as const;

export const contactCardsContent = {
  cards: [
    {
      id: "support",
      icon: "lock",
      title: "Support",
      body: "Help with a parcel, locker or your account.",
      cta: "Visit help center",
      href: "/help",
    },
    {
      id: "partnerships",
      icon: "users",
      title: "Partnerships",
      body: "Host a locker or join as a logistics partner.",
      cta: "Become a partner",
      href: "/partners",
    },
  ],
} as const;

export const contactFormContent = {
  eyebrow: "SEND A MESSAGE",
  heading: "We'll get back to you",
  fields: {
    name: {label: "Name", placeholder: "Your name"},
    email: {label: "Email", placeholder: "you@example.com"},
    topic: {label: "Topic", placeholder: "Select a topic"},
    message: {label: "Message", placeholder: "How can we help you?"},
  },
  topics: ["Support", "Partnerships", "Sales", "General"],
  submit: "Send message",
} as const;

export const contactOfficeContent = {
  eyebrow: "OFFICE",
  heading: "Find us in Lagos",
  map: {
    src: "/contact/map.png",
    alt: "Map showing Alvo's Lagos office location",
  },
  label: "Lagos, Nigeria",
} as const;
