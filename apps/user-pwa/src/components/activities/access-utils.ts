import qrCodeUrl from "@/assets/qr-code.svg";

export function copyText(text: string) {
  void navigator.clipboard?.writeText(text).catch(() => undefined);
}

export function saveQr() {
  const a = document.createElement("a");
  a.href = qrCodeUrl;
  a.download = "alvo-access-code.svg";
  a.click();
}

export function shareCode(code: string) {
  if (navigator.share) void navigator.share({text: code}).catch(() => undefined);
  else copyText(code);
}
