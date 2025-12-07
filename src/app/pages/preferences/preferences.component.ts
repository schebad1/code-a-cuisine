import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import {
  PreferencesStateService,
  TimeCategory,
  Cuisine,
  Diet,
} from './preferences-state.service';
import { IngredientsStateService } from '../generate-recipe/ingredients-state.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [RouterLink, HeaderSecondaryComponent],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent {
  constructor(
    private readonly preferencesState: PreferencesStateService,
    private readonly ingredientsState: IngredientsStateService,
    private readonly router: Router
  ) {}

  /** Current number of portions selected by the user. */
  get portions(): number {
    return this.preferencesState.preferences.portions;
  }

  /** Current cooking helper level (1–4). */
  get cooking(): number {
    return this.preferencesState.preferences.cooking;
  }

  /** Selected time category preference. */
  get timeCategory(): TimeCategory | null {
    return this.preferencesState.preferences.timeCategory;
  }

  /** Selected cuisine preference. */
  get cuisine(): Cuisine | null {
    return this.preferencesState.preferences.cuisine;
  }

  /** Selected diet preference. */
  get diet(): Diet | null {
    return this.preferencesState.preferences.diet;
  }

  /**
   * Checks whether all required preferences have been chosen:
   * - time category
   * - cuisine
   * - diet
   */
  get isPreferencesComplete(): boolean {
    const prefs = this.preferencesState.preferences;
    return !!(prefs.timeCategory && prefs.cuisine && prefs.diet);
  }

  /** Increases the portion count (max 12). */
  increasePortions(): void {
    this.preferencesState.increasePortions();
  }

  /** Decreases the portion count (min 1). */
  decreasePortions(): void {
    this.preferencesState.decreasePortions();
  }

  /** Increases the cooking helper level (max 4). */
  increaseCooking(): void {
    this.preferencesState.increaseCooking();
  }

  /** Decreases the cooking helper level (min 1). */
  decreaseCooking(): void {
    this.preferencesState.decreaseCooking();
  }

  /**
   * Selects a time category.
   *
   * @param category - The chosen time category
   */
  selectTimeCategory(category: TimeCategory): void {
    this.preferencesState.selectTimeCategory(category);
  }

  /**
   * Selects a cuisine.
   *
   * @param cuisine - The chosen cuisine
   */
  selectCuisine(cuisine: Cuisine): void {
    this.preferencesState.selectCuisine(cuisine);
  }

  /**
   * Selects a dietary preference.
   *
   * @param diet - The chosen diet
   */
  selectDiet(diet: Diet): void {
    this.preferencesState.selectDiet(diet);
  }

  /**
   * Triggered when the user clicks "Generate recipe".
   *
   * - Validates that all preferences are selected.
   * - Navigates to the loading screen where the recipe API call is made.
   *
   * IMPORTANT:
   * Ingredients must NOT be cleared here. The backend (n8n) requires
   * the original ingredient list. Ingredients are only reset after the
   * recipe generation run is completed.
   */
  onGenerate(): void {
    if (!this.isPreferencesComplete) {
      return;
    }

    this.router.navigate(['/loading']);
  }
}
