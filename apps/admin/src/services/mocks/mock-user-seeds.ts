import type {UserRow, UserStatus, UserVerification} from "@/types/users-types";

/** Hand-authored rows mirroring the Figma table — USR ids, joined dates, mixed statuses. */
const SHOWCASE: UserRow[] = [
  {
    id: "USR-9103",
    name: "Damilola Akinyemi",
    email: "tylerd@mail.com",
    phone: "0801 234 5601",
    verification: "verified",
    joinedAt: "2026-04-15T09:12:00Z",
    status: "active",
  },
  {
    id: "USR-9018",
    name: "Idris Saidu",
    email: "owenr@outlook.com",
    phone: "0801 234 5602",
    verification: "verified",
    joinedAt: "2026-11-25T11:40:00Z",
    status: "active",
  },
  {
    id: "USR-8205",
    name: "Sa'adatu Bashir",
    email: "asababoy@gmail.com",
    phone: "0801 234 5603",
    verification: "verified",
    joinedAt: "2026-05-20T08:05:00Z",
    status: "active",
  },
  {
    id: "USR-3714",
    name: "Tobiloba Bankole",
    email: "abigailh@icloud.com",
    phone: "0801 234 5604",
    verification: "verified",
    joinedAt: "2026-03-12T14:22:00Z",
    status: "flagged",
  },
  {
    id: "USR-0357",
    name: "Sadiya Maiwada",
    email: "adamawapeak@hotmail.com",
    phone: "0801 234 5605",
    verification: "partial",
    joinedAt: "2026-06-05T10:48:00Z",
    status: "suspended",
  },
  {
    id: "USR-6589",
    name: "Apeli Tonbara",
    email: "kanoroyalty@gmail.com",
    phone: "0801 234 5606",
    verification: "verified",
    joinedAt: "2026-08-22T16:31:00Z",
    status: "active",
  },
  {
    id: "USR-2640",
    name: "Ebiye Inengite",
    email: "osunomoluabi@icloud.com",
    phone: "0801 234 5607",
    verification: "verified",
    joinedAt: "2026-09-30T09:03:00Z",
    status: "active",
  },
  {
    id: "USR-4826",
    name: "Zainab Jibrin",
    email: "owerriconnect@gmail.com",
    phone: "0801 234 5608",
    verification: "verified",
    joinedAt: "2026-07-18T13:57:00Z",
    status: "active",
  },
  {
    id: "USR-7492",
    name: "Sade Abiodun",
    email: "landonc@yandex.com",
    phone: "0801 234 5609",
    verification: "verified",
    joinedAt: "2026-10-11T12:26:00Z",
    status: "active",
  },
  {
    id: "USR-1002",
    name: "Emeka Okonkwo",
    email: "emakaokonkwo781@gmail.com",
    phone: "0801 234 5678",
    verification: "verified",
    joinedAt: "2025-03-12T10:00:00Z",
    status: "active",
  },
];

const FIRST = [
  "Aminu",
  "Chidinma",
  "Osas",
  "Yetunde",
  "Kunle",
  "Halima",
  "Nnamdi",
  "Fadeke",
  "Ibrahim",
  "Adaeze",
  "Tosin",
  "Balarabe",
  "Efe",
  "Ngozi",
  "Suleiman",
  "Omotola",
  "Danjuma",
  "Kelechi",
];
const LAST = [
  "Abubakar",
  "Eze",
  "Okoro",
  "Adeyemi",
  "Danladi",
  "Nwosu",
  "Balogun",
  "Haruna",
  "Igbinedion",
  "Chukwu",
  "Musa",
  "Olawale",
  "Umeh",
  "Sule",
  "Adebanjo",
  "Yakubu",
];
const DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com", "mail.com", "hotmail.com"];
const STATUSES: UserStatus[] = ["active", "flagged", "suspended"];
const VERIFICATIONS: UserVerification[] = ["verified", "partial", "unverified"];

/** Deterministic filler rows — ids start at USR-4402 so they never collide with the showcase set. */
function generatedRows(count: number): UserRow[] {
  return Array.from({length: count}, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 7) % LAST.length];
    // ~85% active, ~10% flagged, ~5% suspended; ~80% verified.
    const status: UserStatus = i % 20 === 11 ? "suspended" : i % 10 === 7 ? "flagged" : STATUSES[0];
    const verification: UserVerification = i % 10 === 3 ? "partial" : i % 20 === 17 ? "unverified" : VERIFICATIONS[0];
    const month = (i % 12) + 1;
    const day = (i % 27) + 1;
    return {
      id: `USR-${4402 + i}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@${DOMAINS[i % DOMAINS.length]}`,
      phone: `080${(i % 9) + 1} ${String(200 + (i % 700)).padStart(3, "0")} ${String(1000 + ((i * 37) % 9000)).padStart(4, "0")}`,
      verification,
      joinedAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T09:00:00Z`,
      status,
    };
  });
}

export const USER_SEEDS: UserRow[] = [...SHOWCASE, ...generatedRows(333)];
