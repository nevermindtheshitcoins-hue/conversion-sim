'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast";
import type { ActionResult } from '@/app/actions';
import { submitScenario, submitReportData } from '@/app/actions';
import type { GenerateScenarioQuestionsOutput } from '@/ai/flows/generate-scenario-questions';
import type { GenerateInsightfulReportOutput } from '@/ai/flows/generate-insightful-report';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Wand2 } from 'lucide-react';

import { Logo } from '@/components/app/logo';
import { QuestionDisplay } from '@/components/app/question-display';
import { ReportDisplay } from '@/components/app/report-display';
import { WelcomeDisplay } from '@/components/app/welcome-display';
import { LoadingSkeleton } from '@/components/app/loading-skeleton';

type ResultState = {
  type: 'questions' | 'report';
  data: any;
} | null;

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-semibold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}

export function MainPage() {
  const [result, setResult] = useState<ResultState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [questionState, questionFormAction] = useFormState<ActionResult<GenerateScenarioQuestionsOutput>, FormData>(submitScenario, null);
  const [reportState, reportFormAction] = useFormState<ActionResult<GenerateInsightfulReportOutput>, FormData>(submitReportData, null);

  const questionFormRef = useRef<HTMLFormElement>(null);
  const reportFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!questionState) return;
    setIsLoading(false);
    if (questionState.success) {
      setResult({ type: 'questions', data: questionState.data });
      questionFormRef.current?.reset();
    } else if (questionState.error) {
      toast({
        variant: 'destructive',
        title: 'Question Generation Failed',
        description: questionState.error,
      });
    }
  }, [questionState, toast]);

  useEffect(() => {
    if (!reportState) return;
    setIsLoading(false);
    if (reportState.success) {
      setResult({ type: 'report', data: reportState.data });
      reportFormRef.current?.reset();
    } else if (reportState.error) {
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: reportState.error,
      });
    }
  }, [reportState, toast]);
  
  const handleFormAction = (action: (formData: FormData) => void) => (formData: FormData) => {
    setIsLoading(true);
    setResult(null);
    action(formData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 sm:p-6 lg:p-8 border-b">
        <div className="max-w-7xl mx-auto">
          <Logo />
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Leverage AI to instantly create probing questions from any scenario or generate concise, insightful reports from raw data.
          </p>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="min-h-[600px] shadow-lg">
              <CardContent className="p-6">
                {isLoading ? <LoadingSkeleton /> :
                 !result ? <WelcomeDisplay /> :
                 result.type === 'questions' ? <QuestionDisplay questionsData={result.data} /> :
                 result.type === 'report' ? <ReportDisplay reportData={result.data} /> :
                 <WelcomeDisplay />
                }
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="font-headline">Control Panel</CardTitle>
                <CardDescription>Select a generator and provide your input.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="questions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="report">Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="questions" className="mt-4">
                     <form ref={questionFormRef} action={handleFormAction(questionFormAction)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="scenario">Scenario Description</Label>
                          <Textarea id="scenario" name="scenario" placeholder="Describe the situation, context, or case study..." rows={8} required />
                          <p className="text-sm text-muted-foreground">Provide a detailed scenario to generate relevant questions.</p>
                        </div>
                        <SubmitButton><Wand2 className="mr-2"/> Generate Questions</SubmitButton>
                     </form>
                  </TabsContent>
                  <TabsContent value="report" className="mt-4">
                    <form ref={reportFormRef} action={handleFormAction(reportFormAction)} className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="data">Data / Observations</Label>
                          <Textarea id="data" name="data" placeholder="Paste your raw data, notes, or key observations here..." rows={8} required />
                          <p className="text-sm text-muted-foreground">Input unstructured data to generate a concise, formatted report.</p>
                      </div>
                      <SubmitButton><Wand2 className="mr-2"/> Generate Report</SubmitButton>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
