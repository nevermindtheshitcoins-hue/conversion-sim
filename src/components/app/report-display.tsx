'use client';

import type { GenerateInsightfulReportOutput } from '@/ai/flows/generate-insightful-report';
import { Button } from '@/components/ui/button';
import { FileText, Quote as QuoteIcon, Target } from 'lucide-react';

interface ParsedReport {
  title?: string;
  dateline?: string;
  lede?: string;
  supportingSentences: string[];
  quote?: string;
  cta?: string;
}

function parseReport(reportText: string): ParsedReport {
    const lines = reportText.split('\n');
    const result: ParsedReport = { supportingSentences: [] };

    let collectingSupporting = false;
    let tempLede = '';
    let inLede = false;

    for (const line of lines) {
        if (line.startsWith('Title:')) {
            result.title = line.replace('Title:', '').trim();
            inLede = false;
            collectingSupporting = false;
        } else if (line.startsWith('Dateline:')) {
            result.dateline = line.replace('Dateline:', '').trim();
            inLede = true; // Assume Lede starts after dateline
            collectingSupporting = false;
        } else if (line.startsWith('Lede:')) {
            tempLede = line.replace('Lede:', '').trim();
            inLede = true;
            collectingSupporting = false;
        } else if (line.startsWith('Supporting Sentences:')) {
            inLede = false;
            collectingSupporting = true;
        } else if (line.startsWith('Quote:')) {
            result.quote = line.replace('Quote:', '').trim();
            inLede = false;
            collectingSupporting = false;
        } else if (line.startsWith('CTA:')) {
            result.cta = line.replace('CTA:', '').trim();
            inLede = false;
            collectingSupporting = false;
        } else if (inLede) {
            tempLede += ' ' + line.trim();
        } else if (collectingSupporting && line.trim()) {
            result.supportingSentences.push(line.trim().replace(/^- /, ''));
        }
    }
    result.lede = tempLede.trim();
    return result;
}

export function ReportDisplay({ reportData }: { reportData: GenerateInsightfulReportOutput }) {
  const parsed = parseReport(reportData.report);

  return (
    <article className="space-y-6">
       <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary"/>
        <h2 className="text-2xl font-headline text-foreground">Insightful Report</h2>
      </div>

      {parsed.title && <h1 className="text-3xl font-headline font-bold text-foreground">{parsed.title}</h1>}
      {parsed.dateline && <p className="text-sm font-semibold text-muted-foreground">{parsed.dateline}</p>}
      
      {parsed.lede && <p className="text-base leading-relaxed text-foreground/90">{parsed.lede}</p>}
      
      {parsed.supportingSentences.length > 0 && (
        <div className="space-y-2">
            <h3 className="font-headline text-lg font-semibold">Key Findings</h3>
            <ul className="list-disc list-outside space-y-2 pl-5 text-foreground/80">
                {parsed.supportingSentences.map((sentence, index) => <li key={index}>{sentence}</li>)}
            </ul>
        </div>
      )}

      {parsed.quote && (
        <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80 my-6">
            <QuoteIcon className="w-5 h-5 text-accent inline-block mr-2" />
            {parsed.quote}
        </blockquote>
      )}

      {parsed.cta && (
         <div className="bg-accent/30 border border-accent/50 rounded-lg p-4 text-center mt-8">
            <Target className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <p className="font-semibold text-accent-foreground">{parsed.cta}</p>
            <Button variant="link" className="text-accent-foreground font-bold">Take Action Now</Button>
         </div>
      )}
    </article>
  );
}
