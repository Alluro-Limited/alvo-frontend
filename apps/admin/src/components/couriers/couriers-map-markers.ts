import dropboxIcon from "@/assets/courier-dropbox.svg";
import type {CourierTrack} from "@/types/couriers-types";
import {courierAvatarPalette, courierInitials} from "./courier-avatar";

/** Purple avatar pin with the pointer tail — one per courier on assignment. */
export function createCourierPinElement(track: CourierTrack): HTMLElement {
  const el = document.createElement("div");
  el.className = "flex cursor-pointer flex-col items-center";
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", track.name);
  el.tabIndex = 0;

  const circle = document.createElement("div");
  circle.className =
    "flex size-12 items-center justify-center overflow-clip rounded-full border-2 border-white bg-accent-500 shadow-[0_0_7px_1px_rgba(0,0,0,0.15)]";
  if (track.photoUrl) {
    const img = document.createElement("img");
    img.src = track.photoUrl;
    img.alt = "";
    img.className = "size-full object-cover";
    circle.appendChild(img);
  } else {
    const initials = document.createElement("span");
    initials.className = `flex size-full items-center justify-center text-xs font-bold ${courierAvatarPalette(track.courierId)}`;
    initials.textContent = courierInitials(track.name);
    circle.appendChild(initials);
  }

  const tail = document.createElement("div");
  tail.className = "-mt-0.5 size-0 border-x-[7px] border-t-[10px] border-x-transparent border-t-accent-500";

  el.append(circle, tail);
  return el;
}

/** Teal cube pin marking a pickup node. */
export function createNodePinElement(): HTMLElement {
  const el = document.createElement("div");
  el.className =
    "flex size-12 items-center justify-center rounded-full border-2 border-white bg-primary-500 shadow-[0_0_7px_1px_rgba(0,0,0,0.15)]";
  const icon = document.createElement("div");
  icon.className = "size-5 bg-white";
  icon.style.maskImage = `url(${dropboxIcon})`;
  icon.style.maskSize = "contain";
  icon.style.maskRepeat = "no-repeat";
  icon.style.maskPosition = "center";
  el.appendChild(icon);
  return el;
}
