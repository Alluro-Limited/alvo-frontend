// @ts-nocheck
/// <reference types="vite/client" />
import {server} from "fumadocs-mdx/runtime/server";
import type * as Config from "../source.config";

const create = server<
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

export const blog = await create.doc(
  "blog",
  "../blog-posts",
  import.meta.glob(["./**/*.mdx"], {
    base: "./../../blog-posts",
    query: "?collection=blog",
    eager: true,
  })
);
