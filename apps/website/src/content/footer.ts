export const footerContent = {
  brand: {
    name: "Alvo",
    mark: "/landing/footer/logo-mark.svg",
    blurb: "Privacy-first parcel delivery, powered by smart lockers and the routes already moving through your city.",
  },
  download: {
    title: "Download the App",
    subtitle: "Available for iOS and Android",
    qr: "/landing/hero/qr.svg",
    href: "/#final-cta",
  },
  columns: [
    {
      title: "PRODUCT",
      links: [
        {label: "Send a parcel", href: "/"},
        {label: "Receive a parcel", href: "/"},
        {label: "Smart lockers", href: "/smart-lockers"},
        {label: "Live tracking", href: "/tracking"},
      ],
    },
    {
      title: "SOLUTIONS",
      links: [
        {label: "For SMEs", href: "/business"},
        {label: "Couriers", href: "/couriers"},
      ],
    },
    {
      title: "COMPANY",
      links: [
        {label: "About", href: "/about"},
        {label: "Careers", href: "/"},
        {label: "Blog", href: "/blog"},
        {label: "Help center", href: "/help"},
      ],
    },
    {
      title: "MORE",
      links: [
        {label: "How it works", href: "/#how-it-works"},
        {label: "Pricing", href: "/business"},
        {label: "Become a locker host", href: "/partners"},
        {label: "Contact", href: "/contact"},
      ],
    },
  ],
  copyright: "© 2025 Alvo. All rights reserved.",
  socials: [
    {label: "Alvo on X", icon: "/landing/footer/social-x.svg", href: "#"},
    {label: "Alvo on Instagram", icon: "/landing/footer/social-instagram.svg", href: "#"},
    {label: "Alvo on LinkedIn", icon: "/landing/footer/social-linkedin.svg", href: "#"},
  ],
} as const;
