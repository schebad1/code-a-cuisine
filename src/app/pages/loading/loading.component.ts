import { Component, OnInit } from '@angular/core';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';
import { RecipeApiService } from '../../api/recipe-api.service';
import { IngredientsStateService } from '../generate-recipe/ingredients-state.service';
import { PreferencesStateService } from '../preferences/preferences-state.service';
import { Router } from '@angular/router';
import { RecipeGenerationResponse } from '../../api/recipe-api.contracts';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [HeaderPrimaryComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  constructor(
    private readonly recipeApi: RecipeApiService,
    private readonly ingredientsState: IngredientsStateService,
    private readonly preferencesState: PreferencesStateService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const ingredients = this.ingredientsState.ingredients;
    const prefs = this.preferencesState.preferences;

    const request = {
      ingredients,
      preferences: {
        portions: prefs.portions,
        cookingHelpers: prefs.cooking,
        timeCategory: prefs.timeCategory!,
        cuisine: prefs.cuisine!,
        diet: prefs.diet!,
      },
      clientMeta: {
        appVersion: '0.1.0',
        locale: navigator.language || 'de-DE',
      },
    };

    console.log('Sende Request an n8n:', request);

    this.recipeApi.generateRecipes(request).subscribe({
      next: (apiResponse: any) => {
        console.log('n8n Antwort raw:', apiResponse);

        const normalized = this.normalizeApiResponse(apiResponse);

        if (!normalized) {
          console.error('Konnte API-Response nicht normalisieren, gehe zurück.');
          this.router.navigate(['/generate-recipe']);
          return;
        }

        console.log('Normalisierte Antwort für /results:', normalized);

        this.router.navigate(['/results'], {
          state: { data: normalized },
        });
      },
      error: (err) => {
        console.error('Fehler bei der Rezept-Generierung:', err);
        this.router.navigate(['/generate-recipe']);
      },
    });
  }

  private normalizeApiResponse(apiResponse: any): RecipeGenerationResponse | null {
    let body: any = apiResponse;

    if (typeof body === 'string') {
      try {
        console.log('Versuche String-Response zu parsen...');
        body = JSON.parse(body);
      } catch (e) {
        console.error('Konnte String-Response nicht parsen:', e, 'Body:', body);
        return null;
      }
    }

    if (Array.isArray(body) && body.length > 0) {
      console.log('Response ist ein Array, nehme erstes Element.');
      body = body[0];
    }

    if (body && body.body) {
      console.log('Wrapper body gefunden, entpacke.');
      body = body.body;
    }

    if (body && body.json) {
      console.log('Wrapper json gefunden, entpacke.');
      body = body.json;
    }

    if (body && body.data) {
      console.log('Wrapper data gefunden, entpacke.');
      body = body.data;
    }

    if (!body || !Array.isArray(body.recipes)) {
      console.error(
        'Normalisierte Response hat kein recipes-Array:',
        body,
      );
      return null;
    }

    return body as RecipeGenerationResponse;
  }
}
