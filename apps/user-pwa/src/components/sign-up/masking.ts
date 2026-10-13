/** "+234 801 *** 5678" — first three and last four digits of the local number. */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return `+234 ${phone}`;
  return `+234 ${phone.slice(0, 3)} *** ${phone.slice(-4)}`;
}

/** "j***@gmail.com" — first letter of the local part plus the domain. */
export function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.split("@");
  return `${user.slice(0, 1)}***@${domain}`;
}
