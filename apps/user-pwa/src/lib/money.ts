/** ₦1,500-style formatting used by the Send Securely cost breakdowns. */
export function naira(amount: number): string {
  return `₦${amount.toLocaleString("en-US")}`;
}

/** ₦5,420.00-style formatting — the wallet balance and ledger amounts always show kobo. */
export function nairaExact(amount: number): string {
  return `₦${amount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}
