import {Home} from "lucide-react";

import {StatementCards} from "@/components/StatementCards";
import {blogPostsContent} from "@/content/blog";

const icons = {
  home: <Home className="size-10 shrink-0" />,
} as const;

export function BlogStatement() {
  return <StatementCards cards={blogPostsContent.statement.cards} icons={icons} />;
}
