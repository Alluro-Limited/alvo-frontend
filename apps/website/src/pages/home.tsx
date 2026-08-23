import {Button} from "@alvo/ui";

export function Home() {
  return (
    <div className="flex min-h-screen flex-col items-start gap-6 bg-background p-12 text-foreground">
      <h1 className="text-3xl font-bold">Alvo</h1>
      <div className="flex gap-4">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
