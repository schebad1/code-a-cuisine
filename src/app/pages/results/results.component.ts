import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';
import { NgIf, NgForOf } from '@angular/common';
import {
  RecipeGenerationResponse,
  GeneratedRecipe,
} from '../../api/recipe-api.contracts';
import { PreferencesStateService } from '../preferences/preferences-state.service';

type ResultsData = RecipeGenerationResponse & {
  recipes: GeneratedRecipe[];
  recipeIds: string[];
};

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HeaderPrimaryComponent, RouterLink, NgIf, NgForOf],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  /** List of generated recipes returned by the API. */
  recipes: GeneratedRecipe[] = [];

  /** IDs of the saved recipes in Firestore. */
  recipeIds: string[] = [];

  /** API quota information returned from the backend. */
  quotaInfo = {
    limitPerIp: 0,
    remainingForIpToday: 0,
    limitGlobal: 0,
    remainingGlobalToday: 0,
  };

  /** Indicates whether the recipe generation request was successful. */
  success = true;

  /** Human-readable label for cuisine of the first recipe. */
  cuisineLabel = '';

  /** Human-readable time category label of the first recipe. */
  timeCategoryLabel = '';

  constructor(
    private readonly router: Router,
    private readonly preferencesState: PreferencesStateService,
  ) {}

  /**
   * Type guard to determine whether the response contains results data
   * in the expected format.
   *
   * @param response - Raw navigation state
   * @returns True if the object has valid recipes and recipeIds arrays
   */
  private hasResultsData(response: any): response is ResultsData {
    return (
      !!response &&
      Array.isArray(response.recipes) &&
      Array.isArray(response.recipeIds)
    );
  }

  /**
   * Lifecycle hook: Reads results data from navigation state or history state.
   * Redirects back to the generator page if no valid data is present.
   * Also extracts quota information and derives cuisine/time labels.
   */
  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateFromNav = nav?.extras.state as { data?: unknown } | undefined;
    const stateFromHistory = history.state as { data?: unknown } | undefined;

    const data = stateFromNav?.data ?? stateFromHistory?.data;

    if (!data) {
      this.router.navigate(['/generate-recipe']);
      return;
    }

    const response = data as ResultsData;

    if (!this.hasResultsData(response)) {
      this.router.navigate(['/generate-recipe']);
      return;
    }

    // Valid structure → extract fields
    this.recipes = response.recipes;
    this.recipeIds = response.recipeIds;
    this.quotaInfo = (response as any).quota ?? this.quotaInfo;
    this.success = (response as any).success ?? true;

    // Derive UI labels based on the first recipe
    if (this.recipes.length > 0) {
      const first = this.recipes[0];

      const cuisineMap: Record<string, string> = {
        german: 'German',
        italian: 'Italian',
        indian: 'Indian',
        japanese: 'Japanese',
        gourmet: 'Gourmet',
        fusion: 'Fusion',
      };

      this.cuisineLabel = cuisineMap[first.cuisine] ?? first.cuisine;
      this.timeCategoryLabel = this.getTimeCategoryLabel(first.totalMinutes);
    }
  }

  /**
   * Converts total minutes into a human-friendly time category.
   *
   * @param totalMinutes - Total cooking time
   * @returns A label such as "Quick", "Medium", or "Complex"
   */
  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 40) return 'Medium';
    return 'Complex';
  }

  /**
   * Opens a generated recipe by its index in the result list.
   *
   * @param index - Index of the recipe to open
   */
  openRecipe(index: number): void {
    const id = this.recipeIds[index];

    if (!id) {
      console.error('No recipe id for index', index, this.recipeIds);
      return;
    }

    this.router.navigate(['/recipes', id]);
  }

  /**
   * Resets preferences and navigates back to the ingredient input screen
   * to start a completely new recipe generation process.
   */
  startNewRecipe(): void {
    this.preferencesState.reset();
    this.router.navigate(['/generate-recipe']);
  }
}
