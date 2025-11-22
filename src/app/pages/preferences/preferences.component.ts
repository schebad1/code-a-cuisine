import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import {
  PreferencesStateService,
  TimeCategory,
  Cuisine,
  Diet,
} from './preferences-state.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [RouterLink, HeaderSecondaryComponent],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent {
  constructor(
    private readonly preferencesState: PreferencesStateService
  ) {}

  get portions(): number {
    return this.preferencesState.preferences.portions;
  }

  get cooking(): number {
    return this.preferencesState.preferences.cooking;
  }

  get timeCategory(): TimeCategory | null {
    return this.preferencesState.preferences.timeCategory;
  }

  get cuisine(): Cuisine | null {
    return this.preferencesState.preferences.cuisine;
  }

  get diet(): Diet | null {
    return this.preferencesState.preferences.diet;
  }

  get isPreferencesComplete(): boolean {
    const prefs = this.preferencesState.preferences;
    return !!(prefs.timeCategory && prefs.cuisine && prefs.diet);
  }
  
  increasePortions(): void {
    this.preferencesState.increasePortions();
  }

  decreasePortions(): void {
    this.preferencesState.decreasePortions();
  }

  increaseCooking(): void {
    this.preferencesState.increaseCooking();
  }

  decreaseCooking(): void {
    this.preferencesState.decreaseCooking();
  }

  selectTimeCategory(category: TimeCategory): void {
    this.preferencesState.selectTimeCategory(category);
  }

  selectCuisine(cuisine: Cuisine): void {
    this.preferencesState.selectCuisine(cuisine);
  }

  selectDiet(diet: Diet): void {
    this.preferencesState.selectDiet(diet);
  }
}