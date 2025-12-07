import { Injectable } from '@angular/core';

export type TimeCategory = 'quick' | 'medium' | 'complex';
export type Cuisine =
  | 'german'
  | 'italian'
  | 'indian'
  | 'japanese'
  | 'gourmet'
  | 'fusion';
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

/**
 * Represents the user's recipe generation preferences.
 */
export interface Preferences {
  /** Number of portions the recipe should serve. */
  portions: number;

  /** Cooking experience level or assistance needed (1–4). */
  cooking: number;

  /** Desired time category for the recipe. */
  timeCategory: TimeCategory | null;

  /** Selected cuisine preference. */
  cuisine: Cuisine | null;

  /** Selected dietary preference. */
  diet: Diet | null;
}

@Injectable({
  providedIn: 'root',
})
export class PreferencesStateService {
  /**
   * Internal state object holding the current user preferences.
   */
  private _preferences: Preferences = {
    portions: 2,
    cooking: 1,
    timeCategory: null,
    cuisine: null,
    diet: null,
  };

  /**
   * Returns the current user preferences.
   */
  get preferences(): Preferences {
    return this._preferences;
  }

  /**
   * Increases the portion count up to a maximum of 12.
   */
  increasePortions(): void {
    if (this._preferences.portions < 12) {
      this._preferences.portions++;
    }
  }

  /**
   * Decreases the portion count down to a minimum of 1.
   */
  decreasePortions(): void {
    if (this._preferences.portions > 1) {
      this._preferences.portions--;
    }
  }

  /**
   * Increases cooking helper level up to a maximum of 4.
   */
  increaseCooking(): void {
    if (this._preferences.cooking < 4) {
      this._preferences.cooking++;
    }
  }

  /**
   * Decreases cooking helper level down to a minimum of 1.
   */
  decreaseCooking(): void {
    if (this._preferences.cooking > 1) {
      this._preferences.cooking--;
    }
  }

  /**
   * Sets the time category preference.
   *
   * @param category - Selected time category
   */
  selectTimeCategory(category: TimeCategory): void {
    this._preferences.timeCategory = category;
  }

  /**
   * Sets the cuisine preference.
   *
   * @param cuisine - Selected cuisine type
   */
  selectCuisine(cuisine: Cuisine): void {
    this._preferences.cuisine = cuisine;
  }

  /**
   * Sets the dietary preference.
   *
   * @param diet - Selected diet type
   */
  selectDiet(diet: Diet): void {
    this._preferences.diet = diet;
  }

  /**
   * Resets all preferences back to their default values.
   */
  reset(): void {
    this._preferences = {
      portions: 2,
      cooking: 1,
      timeCategory: null,
      cuisine: null,
      diet: null,
    };
  }
}
