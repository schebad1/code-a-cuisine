import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

/**
 * Global application configuration for Angular's standalone bootstrap API.
 *
 * This config registers:
 * - the router with all application routes,
 * - the Angular HttpClient,
 * - the Firebase application instance,
 * - the Firestore database connection.
 *
 * All providers here are available application-wide.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /** Registers the Angular router using the defined application routes. */
    provideRouter(routes),

    /** Provides HttpClient for making HTTP requests. */
    provideHttpClient(),

    /**
     * Initializes the Firebase application using environment configuration.
     * This is required for Firestore and any other Firebase services.
     */
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    /**
     * Registers Firestore as a provider, enabling database access
     * throughout the application.
     */
    provideFirestore(() => getFirestore()),
  ],
};
