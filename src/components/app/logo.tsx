import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-md">
        <BrainCircuit className="w-7 h-7" />
      </div>
      <span className="font-headline text-2xl font-bold text-primary tracking-tight">
        Scenario Insights
      </span>
    </div>
  );
}
