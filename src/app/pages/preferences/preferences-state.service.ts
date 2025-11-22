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

export interface Preferences {
  portions: number;
  cooking: number;
  timeCategory: TimeCategory | null;
  cuisine: Cuisine | null;
  diet: Diet | null;
}

@Injectable({
  providedIn: 'root',
})
export class PreferencesStateService {
  private _preferences: Preferences = {
    portions: 2,
    cooking: 1,
    timeCategory: null,
    cuisine: null,
    diet: null,
  };

  get preferences(): Preferences {
    return this._preferences;
  }

  increasePortions(): void {
    if (this._preferences.portions < 12) {
      this._preferences.portions++;
    }
  }

  decreasePortions(): void {
    if (this._preferences.portions > 1) {
      this._preferences.portions--;
    }
  }

  increaseCooking(): void {
    if (this._preferences.cooking < 3) {
      this._preferences.cooking++;
    }
  }

  decreaseCooking(): void {
    if (this._preferences.cooking > 1) {
      this._preferences.cooking--;
    }
  }

  selectTimeCategory(category: TimeCategory): void {
    this._preferences.timeCategory = category;
  }

  selectCuisine(cuisine: Cuisine): void {
    this._preferences.cuisine = cuisine;
  }

  selectDiet(diet: Diet): void {
    this._preferences.diet = diet;
  }
}
