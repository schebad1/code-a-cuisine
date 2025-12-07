import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Bootstraps the Angular application using the standalone API.
 * 
 * `AppComponent` is initialized as the root component, and `appConfig`
 * provides all global providers such as routing, HttpClient, and Firebase.
 *
 * Any bootstrap errors are logged to the console.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
