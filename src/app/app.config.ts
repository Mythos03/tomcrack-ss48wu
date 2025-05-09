import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FirebaseService } from './services/firebase.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    FirebaseService
  ]
};
