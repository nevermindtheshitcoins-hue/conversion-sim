'use client';

import { Wand2, PanelRight } from "lucide-react";

export function WelcomeDisplay() {
  return (
    <div className="text-center flex flex-col items-center justify-center h-[500px]">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
            <Wand2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-headline font-bold text-foreground">
            Welcome to the Scenario Insights Generator
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
            Your AI-powered assistant for creating questions and reports.
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <PanelRight className="w-5 h-5"/>
            <span>Get started by selecting a tool from the control panel on the right.</span>
        </div>
    </div>
  )
}
