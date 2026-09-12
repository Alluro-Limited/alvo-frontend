export const smeHeroContent = {
  headline: "Ship your whole order book in one upload.",
  subhead:
    "For Instagram vendors, online stores, WhatsApp businesses SMEs and local brands, Bulk Send turns dozens of deliveries into a single, private, perfectly-routed operation.",
  primaryCta: "Start with Bulk Send",
  primaryHref: "#download",
  secondaryCta: "Talk to sales",
  secondaryHref: "#contact",
  image: {src: "/sme/hero.jpg", alt: "A small-business owner labelling a parcel of products for shipping"},
} as const;

export const smeCaseStudyContent = {
  eyebrow: "Case Study",
  heading: ["From 3 frantic hours", "to 8 quiet minutes."],
  body: "A Lagos thrift brand shipping 200+ weekly orders moved from hand-writing waybills to a single CSV upload — and stopped sharing customer addresses entirely.",
  stats: [
    {id: "dispatch", label: "Dispatch time", value: "−93%"},
    {id: "cost", label: "Delivery cost", value: "−34%"},
    {id: "leaks", label: "Address leaks", value: "Zero"},
  ],
} as const;

export const smeFeatureTabsContent = {
  eyebrow: "One Platform",
  heading: "Everything your dispatch desk needs.",
  tabs: [
    {id: "batch", label: "Batch shipping"},
    {id: "analytics", label: "Analytics"},
    {id: "wallet", label: "Wallet & invoices"},
    {id: "team", label: "Team & roles"},
  ],
  defaultTab: "batch",
  panels: {
    batch: {
      heading: "Upload once. We do the rest.",
      body: "Drop a CSV or hit our API. Alvo validates the data, generates a unique ID per parcel, clusters by region, and produces a print-ready label sheet.",
      bullets: [
        "Up to 10,000 parcels per batch, validated in seconds.",
        "Inline error preview & rollback before anything ships.",
        "QR label sheets for thermal printers at partner hubs.",
      ],
    },
    analytics: {
      heading: "Know your delivery performance.",
      body: "A live dashboard for batch analytics, delivery success and revenue insight so you can see what's working and where parcels stall.",
      bullets: [
        "Delivery success rate and SLA tracking per batch.",
        "Revenue and cost-per-delivery insights over time.",
        "Exportable reports for your books.",
      ],
    },
    wallet: {
      heading: "One bill. One wallet. No surprises.",
      body: "Pay for an entire batch in a single transaction — wallet, card or invoice — with discounted tiers as your volume grows.",
      bullets: [
        "Consolidated invoicing across all parcels in a batch.",
        "Prepaid credit packages for frequent senders.",
        "Volume rate tiers that drop as you scale.",
      ],
    },
    team: {
      heading: "Bring your team, keep control.",
      body: "Add staff with role-based permissions so the right people can create batches, approve spend, or just track — nothing more.",
      bullets: [
        "Granular roles for operations, finance and viewers.",
        "Audit trail of who created and dispatched each batch.",
        "Strict isolation between business accounts.",
      ],
    },
  },
  mockups: {
    batch: {
      picker: ["Upload CSV", "Manual entry"],
      downloadTemplate: "Download CSV template",
      required: "Required: name · phone · locker_id · parcel_size",
      fileName: "orders_march.csv",
      fileMeta: "842 rows · validated",
      clusters: [
        {name: "Ikeja cluster", count: "312 parcels", status: "Ready"},
        {name: "VI cluster", count: "280 parcels", status: "Ready"},
        {name: "Lekki cluster", count: "250 parcels", status: "Review"},
      ],
    },
    analytics: {
      stats: [
        {label: "Total shipments", value: "2,878", hint: "Across all batches ever created", tone: "primary"},
        {label: "Total spend", value: "₦203,219", hint: "Avg. ₦672 per shipment all time", tone: "primary"},
        {label: "Active shipment", value: "38", hint: "Across 2 active batches", tone: "secondary"},
        {label: "Delivered", value: "1,248", hint: "Last 30 days", tone: "success"},
      ],
    },
    wallet: {
      bank: "Paystack",
      accountNumber: "0123456789",
      accountName: "Bank name • Alvo",
      tabs: ["Wallet", "Invoice"],
      activeTab: "Wallet",
      transactions: [
        {
          title: "Wallet top-up · Bank transfer",
          amount: "+₦25,000",
          meta: "Ref: KS-20238-PAY · Paystack Titans",
          date: "09/03/26 | 09:55 AM",
          type: "credit",
        },
        {
          title: "Batch payment · BT-20241",
          amount: "-₦15,000",
          meta: "96 shipments · March restock",
          date: "13 Mar 2026 · 3:18 PM",
          type: "debit",
        },
      ],
    },
    team: {
      members: [
        {name: "Chidi - Owner", role: "Full access", tone: "success"},
        {name: "Bisi - Operations", role: "Create & ship", tone: "success"},
        {name: "Femi - Finance", role: "Billing only", tone: "warning"},
      ],
    },
  },
} as const;

export const smeTestimonialsContent = {
  eyebrow: "Business Voices",
  heading: ["Owners who got", "their Mondays back."],
  testimonials: [
    {
      id: "adaeze",
      quote: ["The CSV upload alone changed my week. I", "batch 200 orders on Sunday night and", "forget about it."],
      name: "Adaeze O.",
      role: "Thrift brand · Lagos",
    },
    {
      id: "kelechi",
      quote: ["My customers trust me more knowing", "their address never leaves my system.", "That's worth everything."],
      name: "Kelechi M.",
      role: "Skincare store · Abuja",
    },
    {
      id: "ifeanyi",
      quote: ["One invoice for the whole week instead of", "chasing dozens of receipts. Bookkeeping", "got boring — in a good way."],
      name: "Ifeanyi D.",
      role: "Electronics vendor · Lagos",
    },
  ],
} as const;

export const smeFaqContent = {
  eyebrow: "Business FAQ",
  heading: "The essentials for senders.",
  items: [
    {
      q: "What format does the CSV need?",
      a: "Each row carries an anonymized recipient reference, parcel weight/size, destination zone and delivery priority. We provide a template, validate on upload, and let you fix errors before anything ships.",
    },
    {
      q: "How is recipient data protected?",
      a: "Recipient identifiers are hashed and anonymized on upload. Couriers route by locker and code; no PII ever appears in courier-facing screens.",
    },
    {
      q: "Is there an API?",
      a: "Yes. Endpoints cover bulk upload, status, label generation and payment, with webhook updates so your store stays in sync automatically.",
    },
    {
      q: "What about volume discounts?",
      a: "Rates tier down as your monthly volume grows, and prepaid credit packages give frequent senders the best price. Talk to sales for a custom quote.",
    },
  ],
} as const;

export const smeCtaContent = {
  heading: ["Your next batch is five", "minutes away."],
  subhead: "Onboard in minutes, ship privately at scale, and only pay when parcels move.",
  primaryCta: "Start with Bulk Send",
  primaryHref: "#download",
  secondaryCta: "Watch a demo",
  secondaryHref: "#demo",
  client: {src: "/sme/cta/client.png", alt: "A business owner holding a labelled parcel and a phone"},
} as const;
