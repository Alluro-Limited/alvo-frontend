export const smartLockersHeroContent = {
  headline: "A safe, private home for every parcel.",
  subhead:
    "IoT-enabled lockers hosted across estates, malls, fuel stations and hotels — sensor-guarded, always open, and unlockable only by the right person.",
  primaryCta: "Find a locker near you",
  primaryHref: "#find",
  secondaryCta: "Host a locker",
  secondaryHref: "#host",
} as const;

export const smartLockersAccessContent = {
  eyebrow: "Three ways in",
  heading: "Your code, your choice.",
  subhead: "Whatever's fastest at the locker — scan, type, or tap.",
  items: [
    {
      id: "qr",
      icon: "/smart-lockers/icons/qr-code.svg",
      title: "QR code:",
      body: "scan and the right door opens instantly.",
      rotate: false,
    },
    {
      id: "otp",
      icon: "/smart-lockers/icons/keyboard.svg",
      title: "OTP:",
      body: "a one-time PIN sent straight to the recipient.",
      rotate: false,
    },
    {
      id: "nfc",
      icon: "/smart-lockers/icons/nfc.svg",
      title: "NFC:",
      body: "tap your phone, no app needed at the door.",
      rotate: true,
    },
  ],
} as const;

export const smartLockersBenefitsContent = {
  eyebrow: "WHY LOCKERS WIN",
  heading: "Safer than a doorstep. Easier than a queue.",
  columns: 3 as const,
  items: [
    {
      id: "tamper",
      icon: "/smart-lockers/icons/shield.svg",
      title: "Tamper detection",
      body: "Sensors flag any unauthorized attempt and lock down the compartment, with an instant alert to operations.",
    },
    {
      id: "availability",
      icon: "/smart-lockers/icons/time.svg",
      title: "24/7 availability",
      body: "No business hours, no missed deliveries. Drop off and collect whenever it suits you, day or night.",
    },
    {
      id: "offline",
      icon: "/smart-lockers/icons/offline.svg",
      title: "Offline-resilient",
      body: "Lockers keep operating without a network and sync every event the moment they reconnect.",
    },
    {
      id: "environment",
      icon: "/smart-lockers/icons/sensors.svg",
      title: "Environmental sensors",
      body: "Temperature and humidity awareness keeps sensitive parcels in good condition while they wait.",
    },
    {
      id: "nearby",
      icon: "/smart-lockers/icons/location.svg",
      title: "Always nearby",
      body: "Hosted by everyday partners across your city, so there's a locker minutes from where you already are.",
    },
    {
      id: "custody",
      icon: "/smart-lockers/icons/lock.svg",
      title: "Verified custody",
      body: "Every open and close is logged against a code, building an auditable chain from drop-off to pickup.",
    },
  ],
} as const;

export const smartLockersCtaContent = {
  heading: ["Got space? Become a", "locker host."],
  subhead: "Estates, malls, fuel stations and hotels earn by hosting a Alvo locker and bring private delivery to their neighbourhood.",
  primaryCta: "Apply to host",
  primaryHref: "#host",
  secondaryCta: "See how it works",
  secondaryHref: "#how",
  client: {src: "/sme/cta/client.png", alt: "A person preparing a parcel to place into an Alvo locker"},
} as const;
