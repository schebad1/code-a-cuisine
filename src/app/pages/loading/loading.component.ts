import { Component, OnInit } from '@angular/core';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';
import { RecipeApiService } from '../../api/recipe-api.service';
import { IngredientsStateService } from '../generate-recipe/ingredients-state.service';
import { PreferencesStateService } from '../preferences/preferences-state.service';
import { Router } from '@angular/router';
import {
  RecipeGenerationResponse,
  GeneratedRecipe,
} from '../../api/recipe-api.contracts';
import { RecipeLibraryService } from '../../api/recipe-library.service';

type RecipeResponseWithRecipes = RecipeGenerationResponse & {
  recipes: GeneratedRecipe[];
};

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
    private readonly recipeLibrary: RecipeLibraryService,
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

    this.recipeApi.generateRecipes(request).subscribe({
      next: async (apiResponse: any) => {
        const normalized = this.normalizeApiResponse(apiResponse);

        if (!normalized) {
          this.router.navigate(['/generate-recipe']);
          return;
        }

        try {
          const recipeIds = await this.saveAllRecipes(normalized.recipes);

          this.router.navigate(['/results'], {
            state: {
              data: {
                ...normalized,
                recipeIds,
              },
            },
          });
        } catch {
          this.router.navigate(['/generate-recipe']);
        }
      },
      error: () => {
        this.router.navigate(['/generate-recipe']);
      },
    });
  }

  private async saveAllRecipes(recipes: GeneratedRecipe[]): Promise<string[]> {
    const ids: string[] = [];

    for (const recipe of recipes) {
      const id = await this.recipeLibrary.saveGeneratedRecipe(recipe);
      ids.push(id);
    }

    return ids;
  }

  private normalizeApiResponse(
    apiResponse: any,
  ): RecipeResponseWithRecipes | null {
    let body: any = apiResponse;

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return null;
      }
    }

    if (Array.isArray(body) && body.length > 0) {
      body = body[0];
    }

    if (body && body.body) {
      body = body.body;
    }

    if (body && body.json) {
      body = body.json;
    }

    if (body && body.data) {
      body = body.data;
    }

    if (!body || !Array.isArray(body.recipes)) {
      return null;
    }

    return body as RecipeResponseWithRecipes;
  }
}
