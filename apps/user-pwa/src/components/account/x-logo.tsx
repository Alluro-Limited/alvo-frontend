import {createLucideIcon} from "lucide-react";

/** The Instagram brand mark — lucide ships no brand icons, so the shapes are defined here. */
export const InstagramLogo = createLucideIcon("InstagramLogo", [
  ["rect", {width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5"}],
  ["path", {d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}],
  ["line", {x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5"}],
]);

/** The X (Twitter) brand mark — lucide ships no brand icons, so the path is defined here. */
export const XLogo = createLucideIcon("XLogo", [
  [
    "path",
    {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      fill: "currentColor",
      stroke: "none",
    },
  ],
]);
