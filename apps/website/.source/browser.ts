// @ts-nocheck
/// <reference types="vite/client" />
import {browser} from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {
      blog: {
        /**
         * Last modified date of document file, obtained from version control.
         */
        lastModified?: Date;
      };
    };
  }
>();
const browserCollections = {
  blog: create.doc(
    "blog",
    import.meta.glob(["./**/*.mdx"], {
      base: "./../../blog-posts",
      query: "?collection=blog",
      eager: false,
    })
  ),
};
export default browserCollections;
