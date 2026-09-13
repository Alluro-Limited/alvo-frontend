import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

import {defineCollections, defineConfig, frontmatterSchema} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import {z} from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const blogSchema = frontmatterSchema
  .omit({description: true})
  .extend({
    author: z.string(),
    date: z.string(),
    image: z.string(),
    category: z.enum(["Product", "Logistics", "Engineering", "Privacy", "Company"]),
    featured: z.boolean().default(false),
    excerpt: z.string(),
  })
  .strict();

export const blog = defineCollections({
  type: "doc",
  dir: resolve(__dirname, "../blog-posts"),
  files: ["**/*.mdx"],
  schema: blogSchema,
  postprocess: {
    includeProcessedMarkdown: true,
  },
});

export default defineConfig({
  plugins: [lastModified()],
});
