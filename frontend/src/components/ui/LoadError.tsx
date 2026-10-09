import Button from "./Button";
import Card from "./Card";

/** Shown when a page's data could not be loaded. */
export default function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-lg font-extrabold">We couldn&apos;t load this page</p>
      <p className="font-bold text-wolf">{message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </Card>
  );
}