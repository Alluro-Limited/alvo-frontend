import {m} from "@/paraglide/messages";
import navAddWhiteUrl from "@/assets/nav-add-white.svg";
import navAddUrl from "@/assets/nav-add.svg";
import navHelpWhiteUrl from "@/assets/nav-help-white.svg";
import navHelpUrl from "@/assets/nav-help.svg";
import navHomeWhiteUrl from "@/assets/nav-home-white.svg";
import navHomeUrl from "@/assets/nav-home.svg";
import navSettingsWhiteUrl from "@/assets/nav-settings-white.svg";
import navSettingsUrl from "@/assets/nav-settings.svg";
import navShipmentsWhiteUrl from "@/assets/nav-shipments-white.svg";
import navShipmentsUrl from "@/assets/nav-shipments.svg";
import navWalletWhiteUrl from "@/assets/nav-wallet-white.svg";
import navWalletUrl from "@/assets/nav-wallet.svg";

export interface ShellNavItem {
  to: string;
  label: () => string;
  /** Grey and white variants of the exported Figma icon. */
  icon: string;
  iconActive: string;
  /** `data-tour` anchor the onboarding tour attaches a tooltip to. */
  tourId?: string;
}

/**
 * Sidebar destinations from the Figma shell. Unbuilt sections point at placeholder
 * routes inside the app layout until the real screens land.
 */
export const HOME_NAV_ITEMS: ShellNavItem[] = [
  {to: "/dashboard", label: m["nav.home"], icon: navHomeUrl, iconActive: navHomeWhiteUrl},
  {to: "/new-shipment", label: m["nav.new_shipment"], icon: navAddUrl, iconActive: navAddWhiteUrl, tourId: "new-shipment"},
  {to: "/shipments", label: m["nav.shipments"], icon: navShipmentsUrl, iconActive: navShipmentsWhiteUrl, tourId: "shipments"},
  {to: "/wallet", label: m["nav.wallet"], icon: navWalletUrl, iconActive: navWalletWhiteUrl, tourId: "wallet"},
];

export const PREFERENCE_NAV_ITEMS: ShellNavItem[] = [
  {to: "/settings", label: m["nav.settings"], icon: navSettingsUrl, iconActive: navSettingsWhiteUrl},
  {to: "/help", label: m["nav.help_support"], icon: navHelpUrl, iconActive: navHelpWhiteUrl},
];

const ALL_NAV_ITEMS = [...HOME_NAV_ITEMS, ...PREFERENCE_NAV_ITEMS];

/** Resolves the header title for the current pathname, matching nested routes by longest prefix. */
export function navLabelForPath(pathname: string): (() => string) | undefined {
  const match = ALL_NAV_ITEMS.filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`)).sort(
    (a, b) => b.to.length - a.to.length
  )[0];
  return match?.label;
}
