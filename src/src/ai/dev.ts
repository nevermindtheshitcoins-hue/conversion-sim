/*
 * Entry point for genkit development server.  This file loads
 * environment variables and registers all AI flows.  At runtime
 * genkit inspects this module to expose HTTP endpoints for the
 * diagnosed flows defined in src/ai/flows.
 */

'use server';

import { config } from 'dotenv';
config();

// Import our conversion flow to register its endpoints.  Other flows
// can be imported here as needed.
import '@/ai/flows/conversion-flow';