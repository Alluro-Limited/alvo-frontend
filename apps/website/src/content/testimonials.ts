export const testimonialsContent = {
  eyebrow: "LOVED BY SENDERS",
  heading: "The privacy people didn't know they were missing.",
  map: {src: "/landing/testimonials/map.png"},
  // Decorative placeholder faces that fill the wall between real testimonials.
  fillerAvatars: ["/landing/testimonials/avatar-1.png", "/landing/testimonials/avatar-2.png"],
  // PLACEHOLDER testimonials — replace copy, names, roles, photos and `cell` positions
  // with real senders. Each entry becomes a selectable avatar that swaps the quote card.
  // `cell` is the flat position in the wall grid (0-based, across the rows below).
  people: [
    {
      id: "ajadi-samson",
      name: "Ajadi Samson",
      role: "sender",
      quote:
        "As a vendor, my customers' addresses never touch a courier's phone. That alone made me switch, and the bulk upload saves my Mondays.",
      avatar: "/landing/testimonials/avatar-featured.png",
      cell: 16,
    },
    {
      id: "chidinma-okafor",
      name: "Chidinma Okafor",
      role: "vendor",
      quote: "I ship from Yaba to buyers I've never met and none of them ever see my number. Payouts hit the same day, every day.",
      avatar: "/landing/testimonials/avatar-1.png",
      cell: 2,
    },
    {
      id: "tunde-bakare",
      name: "Tunde Bakare",
      role: "SME owner",
      quote:
        "Dropped a CSV of 300 orders before breakfast, labels came back print-ready. What used to take my team a full day now takes minutes.",
      avatar: "/landing/testimonials/avatar-2.png",
      cell: 9,
    },
    {
      id: "aisha-bello",
      name: "Aisha Bello",
      role: "sender",
      quote: "Collecting from a locker near my office at 9pm feels safer than waiting on a rider who knows exactly where I live.",
      avatar: "/landing/testimonials/avatar-1.png",
      cell: 13,
    },
    {
      id: "emeka-nwosu",
      name: "Emeka Nwosu",
      role: "merchant",
      quote: "The volume rates dropped as we scaled, and one invoice per batch means my accountant finally stopped complaining.",
      avatar: "/landing/testimonials/avatar-2.png",
      cell: 20,
    },
    {
      id: "fatima-yusuf",
      name: "Fatima Yusuf",
      role: "vendor",
      quote: "My customers trust me more knowing their details stay private. That trust is worth more than the money I save on delivery.",
      avatar: "/landing/testimonials/avatar-1.png",
      cell: 5,
    },
    {
      id: "oluwaseun-adeyemi",
      name: "Oluwaseun Adeyemi",
      role: "sender",
      quote: "Code in, parcel out. No calls, no haggling at the door, no strangers with my address. It just works.",
      avatar: "/landing/testimonials/avatar-2.png",
      cell: 23,
    },
    {
      id: "ngozi-eze",
      name: "Ngozi Eze",
      role: "SME owner",
      quote: "The live dashboard shows on-time rates per batch, so I finally know which routes to trust. My repeat customers noticed.",
      avatar: "/landing/testimonials/avatar-1.png",
      cell: 26,
    },
  ],
  // Grid shape: avatars per row, top to bottom.
  rows: [6, 7, 8, 7],
} as const;
