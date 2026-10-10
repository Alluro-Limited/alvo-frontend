import type {
  SmeBatch,
  SmeDetail,
  SmeFlag,
  SmeRow,
  SmeSuspension,
  SmeVerification,
  SmeVerificationItem,
  SmeVerificationItemStatus,
} from "@/types/smes-types";

const CONTACT_FIRST = ["Adaeze", "Tobiloba", "Chisom", "Hauwa", "Emeka", "Ngozi", "Kelechi", "Omotola"];
const CONTACT_LAST = ["Nwosu", "Bankole", "Agu", "Zubairu", "Anyaoku", "Eze", "Okoro", "Danladi"];
const BANKS = ["Paystack", "Moniepoint", "Kuda", "GTBank", "Zenith Bank"];
const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com"];

const CAC_CHECKLIST = [
  "Document is a valid CAC certificate",
  "Business name matches the registered company name",
  "CAC registration number is legible",
  "Issue date is recent and certificate is not expired",
  "Certificate is stamped / digitally authenticated",
];
const PUBLIC_SEARCH_CHECKLIST = [
  "Public search result matches the CAC registration number",
  "Registered address matches the business location on file",
  "Company status on the registry is active",
];

/** What each verification level implies for the two review items. */
const ITEM_STATUS: Record<SmeVerification, {cac: SmeVerificationItemStatus; search: SmeVerificationItemStatus}> = {
  verified: {cac: "approved", search: "approved"},
  partial: {cac: "submitted", search: "submitted"},
  unverified: {cac: "not_uploaded", search: "submitted"},
};

/** The verification card items for a row — re-derived by the mock when approvals happen. */
export function verificationItemsFor(row: SmeRow): SmeVerificationItem[] {
  const states = ITEM_STATUS[row.verification];
  return [
    {
      key: "cac_certificate",
      label: "CAC Certificate",
      status: states.cac,
      fileName: states.cac === "not_uploaded" ? null : "cac_certificate.pdf",
      checklist: CAC_CHECKLIST,
    },
    {
      key: "public_search",
      label: "Public search",
      status: states.search,
      fileName: null,
      checklist: PUBLIC_SEARCH_CHECKLIST,
    },
  ];
}

/** Verification level derived from item statuses — approvals move the row's pill forward. */
export function verificationFor(items: SmeVerificationItem[]): SmeVerification {
  if (items.every((item) => item.status === "approved")) return "verified";
  if (items.every((item) => item.status === "not_uploaded")) return "unverified";
  return "partial";
}

/** Deterministic batches — newest first; `now` anchors the Today/Yesterday groups. */
export function batchesFor(row: SmeRow, now: Date): SmeBatch[] {
  const seed = row.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  // Unverified and suspended businesses have not submitted batches yet — renders the empty tab.
  if (row.verification === "unverified" || row.status === "suspended") return [];
  const count = 2 + (seed % 8);
  return Array.from({length: count}, (_, i) => {
    const at = new Date(now.getTime() - (i * (24 + (seed % 12)) + (seed % 9)) * 3_600_000);
    return {
      id: `B-${2200 + ((seed * 7 + i * 131) % 800)}`,
      parcels: 20 + ((seed * 13 + i * 37) % 380),
      amountKobo: (40_000 + ((seed * 977 + i * 61_300) % 700_000)) * 100,
      createdAt: at.toISOString(),
      status: i === 0 && seed % 3 === 0 ? "active" : "completed",
    };
  });
}

/** Builds the drawer payload for an SME row, folding in live flag/suspension records. */
export function smeDetailFor(
  row: SmeRow,
  index: number,
  ctx: {flag: SmeFlag | null; suspension: SmeSuspension | null; now: Date}
): SmeDetail {
  const {flag, suspension, now} = ctx;
  const seed = row.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const contactName = `${CONTACT_FIRST[index % CONTACT_FIRST.length]} ${CONTACT_LAST[(index * 3) % CONTACT_LAST.length]}`;
  const domain = EMAIL_DOMAINS[seed % EMAIL_DOMAINS.length];
  return {
    ...row,
    ref: `SME-${String(index + 1).padStart(3, "0")}`,
    businessType: row.industry,
    businessPhone: `0801 234 ${String(5670 + index).padStart(4, "0")}`,
    businessEmail: `${row.businessName.toLowerCase().replace(/[^a-z]+/g, "")}@${domain}`,
    contactName,
    contactEmail: `${contactName.toLowerCase().replace(/\s+/g, "")}${seed % 1000}@${domain}`,
    contactPhone: `0801 234 ${String(5680 + index).padStart(4, "0")}`,
    cacNumber: `RC-${1000000 + ((seed * 131) % 900000)}`,
    flag,
    suspension,
    dvaEnabled: row.status !== "suspended" && seed % 5 !== 1,
    walletBalanceKobo: 620_000 + ((seed * 91_300) % 4_800_000),
    dvaAccount: String(2_004_900_000 + ((seed * 7_919) % 90_000)),
    bank: BANKS[seed % BANKS.length],
    verificationItems: verificationItemsFor(row),
    batches: batchesFor(row, now),
  };
}
