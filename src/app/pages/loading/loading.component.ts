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

  /**
   * Lifecycle hook: initiates recipe generation based on user-provided
   * ingredients and preferences. Handles success, error, and quota cases,
   * and navigates accordingly.
   */
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

        // Failed to normalize → bad or malformed API response
        if (!normalized) {
          this.router.navigate(['/generate-recipe']);
          return;
        }

        // Quota exceeded or API returned no recipes
        if (!normalized.success || !normalized.recipes?.length) {
          this.router.navigate(['/results'], {
            state: {
              data: {
                ...normalized,
                recipeIds: [],
              },
            },
          });
          return;
        }

        // Successful response → save recipes and navigate to results
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

      // Network error or API unreachable
      error: () => {
        this.router.navigate(['/generate-recipe']);
      },
    });
  }

  /**
   * Saves all generated recipes to the recipe library.
   *
   * @param recipes - List of generated recipes
   * @returns A promise resolving to an array of recipe IDs
   */
  private async saveAllRecipes(recipes: GeneratedRecipe[]): Promise<string[]> {
    const ids: string[] = [];

    for (const recipe of recipes) {
      const id = await this.recipeLibrary.saveGeneratedRecipe(recipe);
      ids.push(id);
    }

    return ids;
  }

  /**
   * Extracts and normalizes the API response so the application can work
   * with a consistent format. Handles various API wrapper formats, strings,
   * nested `body`, `json`, `data` fields, and array-wrapped responses.
   *
   * @param apiResponse - Raw response returned by the recipe API
   * @returns A normalized response or `null` if invalid
   */
  private normalizeApiResponse(
    apiResponse: any,
  ): RecipeResponseWithRecipes | null {
    let body: any = apiResponse;

    // Allow stringified JSON
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return null;
      }
    }

    // Some providers wrap data in arrays
    if (Array.isArray(body) && body.length > 0) {
      body = body[0];
    }

    // Strip common wrapper formats
    if (body && body.body) body = body.body;
    if (body && body.json) body = body.json;
    if (body && body.data) body = body.data;

    // Must have a recipes array to be valid
    if (!body || !Array.isArray(body.recipes)) {
      return null;
    }

    return body as RecipeResponseWithRecipes;
  }
}
