import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { Router, RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';
import {
  RecipeLibraryService,
  RecipeListItem,
  Cuisine,
} from '../../api/recipe-library.service';
import { PreferencesStateService } from '../preferences/preferences-state.service';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink, NgForOf],
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.scss'],
})
export class CookbookComponent implements OnInit {
  /**
   * Contains the top five recipes with the highest number of likes.
   */
  mostLikedRecipes: RecipeListItem[] = [];

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly recipeLibrary: RecipeLibraryService,
    private readonly preferencesState: PreferencesStateService
  ) {}

  /**
   * Lifecycle hook: Loads all recipes, sorts them by like count,
   * and stores the top five.
   */
  ngOnInit(): void {
    this.recipeLibrary.getRecipesByCuisine(null).subscribe((items) => {
      const sorted = [...items].sort(
        (a, b) => (b.likes ?? 0) - (a.likes ?? 0)
      );
      this.mostLikedRecipes = sorted.slice(0, 5);
    });
  }

  /**
   * Navigates back to the previous page in the browser history.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Opens the recipe list filtered by a specific cuisine.
   *
   * @param cuisine - The selected cuisine
   */
  openCuisine(cuisine: Cuisine): void {
    this.router.navigate(['/recipes'], {
      queryParams: { cuisine },
    });
  }

  /**
   * Opens the detail page for a specific recipe.
   *
   * @param id - The recipe ID
   */
  openRecipe(id: string): void {
    this.router.navigate(['/recipes', id]);
  }

  /**
   * Starts the creation process for a new recipe.
   * Resets any previously stored preferences.
   */
  startNewRecipe(): void {
    this.preferencesState.reset();
    this.router.navigate(['/generate-recipe']);
  }
}