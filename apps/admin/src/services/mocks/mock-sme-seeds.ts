import type {SmeRow, SmeStatus, SmeVerification} from "@/types/smes-types";

/** Hand-authored rows mirroring the Figma table — PRV business ids, industries, locations, mixed statuses. */
const SHOWCASE: SmeRow[] = [
  {
    id: "PRV-9103",
    businessName: "Emmaj Textile",
    industry: "Clothing Textile",
    location: "Lekki Phase 1, Lagos",
    verification: "verified",
    joinedAt: "2026-04-15T09:12:00Z",
    status: "active",
  },
  {
    id: "PRV-9018",
    businessName: "NextGen Fintech",
    industry: "Financial Service",
    location: "Ikoyi, Lagos",
    verification: "verified",
    joinedAt: "2026-11-25T11:40:00Z",
    status: "active",
  },
  {
    id: "PRV-8205",
    businessName: "Atlantic Commerce Ltd.",
    industry: "Financial Service",
    location: "Lekki, Lagos",
    verification: "verified",
    joinedAt: "2026-05-20T08:05:00Z",
    status: "active",
  },
  {
    id: "PRV-3714",
    businessName: "BlueWave Technologies",
    industry: "Gadget Retail",
    location: "Yaba, Lagos",
    verification: "verified",
    joinedAt: "2026-03-12T14:22:00Z",
    status: "flagged",
  },
  {
    id: "PRV-0357",
    businessName: "Urban Pulse Media",
    industry: "Healthcare",
    location: "Surulere, Lagos",
    verification: "partial",
    joinedAt: "2026-06-05T10:48:00Z",
    status: "suspended",
  },
  {
    id: "PRV-6589",
    businessName: "Lagos Green Energy",
    industry: "Manufacturing",
    location: "Ikeja, Lagos",
    verification: "verified",
    joinedAt: "2026-08-22T16:31:00Z",
    status: "active",
  },
  {
    id: "PRV-2640",
    businessName: "Meemy Couture",
    industry: "Fashion & Beauty",
    location: "Yaba, Lagos",
    verification: "verified",
    joinedAt: "2026-09-30T09:03:00Z",
    status: "active",
  },
  {
    id: "PRV-4826",
    businessName: "Nigerian Digital Solutions",
    industry: "Technology",
    location: "Lekki, Lagos",
    verification: "verified",
    joinedAt: "2026-07-18T13:57:00Z",
    status: "active",
  },
  {
    id: "PRV-7492",
    businessName: "LagosTech Innovations",
    industry: "Technology",
    location: "Surulere, Lagos",
    verification: "verified",
    joinedAt: "2026-10-11T12:26:00Z",
    status: "active",
  },
  {
    // The drawer storyboard row — the "Zuri Commerce Ltd" detail screens hang off this business.
    id: "PRV-1002",
    businessName: "Zuri Commerce Ltd",
    industry: "E-commerce",
    location: "153 Eket-Oron Road, Victoria Island, Lagos state.",
    verification: "verified",
    joinedAt: "2025-03-12T10:00:00Z",
    status: "active",
  },
];

const NAMES = [
  "Apex Logistics Mart",
  "TrueValue Stores",
  "Brightline Supplies",
  "Oasis Retail Group",
  "Cedar Point Trading",
  "Nova Pharmaceuticals",
  "Primefield Agro",
  "Sterling Homeware",
  "Urban Edge Apparel",
  "Vantage Electronics",
  "Harbor Foods Ltd",
  "Pinnacle Books & Media",
  "Swift Mart NG",
  "Azure Wellness Co",
  "Terra Build Materials",
  "Lumina Fashion House",
  "Corebridge Telecoms",
  "Everpure Beverages",
];
const INDUSTRIES = [
  "E-commerce",
  "Gadget Retail",
  "Fashion & Beauty",
  "Healthcare",
  "Manufacturing",
  "Technology",
  "Financial Service",
  "Clothing Textile",
];
const LOCATIONS = [
  "Lekki, Lagos",
  "Ikoyi, Lagos",
  "Yaba, Lagos",
  "Surulere, Lagos",
  "Ikeja, Lagos",
  "Victoria Island, Lagos",
  "Ajah, Lagos",
];
const STATUSES: SmeStatus[] = ["active", "flagged", "suspended"];
const VERIFICATIONS: SmeVerification[] = ["verified", "partial", "unverified"];

/** Deterministic filler rows — ids start at PRV-4402 so they never collide with the showcase set. */
function generatedRows(count: number): SmeRow[] {
  return Array.from({length: count}, (_, i) => {
    // ~85% active, ~10% flagged, ~5% suspended; ~80% verified.
    const status: SmeStatus = i % 20 === 11 ? "suspended" : i % 10 === 7 ? "flagged" : STATUSES[0];
    const verification: SmeVerification = i % 10 === 3 ? "partial" : i % 20 === 17 ? "unverified" : VERIFICATIONS[0];
    const month = (i % 12) + 1;
    const day = (i % 27) + 1;
    return {
      id: `PRV-${4402 + i}`,
      businessName: NAMES[i % NAMES.length],
      industry: INDUSTRIES[(i * 3) % INDUSTRIES.length],
      location: LOCATIONS[(i * 5) % LOCATIONS.length],
      verification,
      joinedAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T09:00:00Z`,
      status,
    };
  });
}

export const SME_SEEDS: SmeRow[] = [...SHOWCASE, ...generatedRows(333)];
