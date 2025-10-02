/**
 * Entry point for genkit development server.
 * 
 * This file serves as the main entry point for the genkit development server.
 * It loads environment variables and registers all AI flows. At runtime,
 * genkit inspects this module to expose HTTP endpoints for the defined flows.
 * 
 * @fileoverview Genkit development server entry point
 * @author Business Assessment Tool Team
 * @version 1.0.0
 * 
 * @requires dotenv - For loading environment variables
 * @requires @/ai/flows/conversion-flow - Main conversion flow registration
 * 
 * @example
 * // Start the development server
 * npm run genkit:dev
 * 
 * @see {@link https://firebase.google.com/docs/genkit} Genkit documentation
 */

'use server';

import { config } from 'dotenv';
config();

// Import our conversion flow to register its endpoints.  Other flows
// can be imported here as needed.
import '@/ai/flows/conversion-flow';