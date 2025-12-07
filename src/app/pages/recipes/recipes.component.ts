import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { NgForOf, NgIf } from '@angular/common';
import {
  RecipeListItem,
  RecipeLibraryService,
  RecipePageResult,
} from '../../api/recipe-library.service';
import { Cuisine } from '../../api/recipe-seed.data';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterModule, NgForOf, NgIf],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  /** Currently selected cuisine filter or `null` for all cuisines. */
  cuisine: Cuisine | null = null;

  /** Human-readable label for the currently selected cuisine. */
  cuisineLabel = 'All recipes';

  /** Recipes currently displayed for the active page. */
  recipes: RecipeListItem[] = [];

  /** Number of recipes to load per page. */
  pageSize = 20;

  /** Index of the currently active page (0-based). */
  currentPageIndex = 0;

  /** Cached pages of recipes, each index representing a page. */
  pages: RecipeListItem[][] = [];

  /**
   * Firestore cursors for each loaded page.
   * The element at index N is used as `startAfter` for page N.
   */
  pageCursors: (QueryDocumentSnapshot<DocumentData> | null)[] = [null];

  /** Indicates whether a page is currently being loaded. */
  isLoading = false;

  /**
   * Indicates if there might be more pages to load.
   * Set to false when a page is returned with fewer items than `pageSize`.
   */
  hasMore = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeLibrary: RecipeLibraryService
  ) {}

  /**
   * Lifecycle hook: reads the optional cuisine filter from the query params,
   * validates it, updates labels, and loads the initial page.
   */
  ngOnInit(): void {
    const cuisineParam = this.route.snapshot.queryParamMap.get('cuisine') as Cuisine | null;

    if (cuisineParam && this.isValidCuisine(cuisineParam)) {
      this.cuisine = cuisineParam;
      this.cuisineLabel = this.mapCuisineToLabel(cuisineParam);
    } else {
      this.cuisine = null;
      this.cuisineLabel = 'All recipes';
    }

    this.goToPage(0);
  }

  /**
   * Type guard: checks whether the given string is a valid `Cuisine` value.
   *
   * @param value - Raw cuisine value from query parameters
   * @returns True if the value is a valid cuisine
   */
  private isValidCuisine(value: string): value is Cuisine {
    return (
      value === 'german' ||
      value === 'italian' ||
      value === 'indian' ||
      value === 'japanese' ||
      value === 'gourmet' ||
      value === 'fusion'
    );
  }

  /**
   * Maps a cuisine enum value to a user-facing label.
   *
   * @param cuisine - Cuisine enum value
   * @returns Human-readable label for the given cuisine
   */
  private mapCuisineToLabel(cuisine: Cuisine): string {
    switch (cuisine) {
      case 'german':
        return 'German cuisine';
      case 'italian':
        return 'Italian cuisine';
      case 'indian':
        return 'Indian cuisine';
      case 'japanese':
        return 'Japanese cuisine';
      case 'gourmet':
        return 'Gourmet cuisine';
      case 'fusion':
        return 'Fusion cuisine';
      default:
        return 'All recipes';
    }
  }

  /**
   * Loads a specific page of recipes from the backend and updates
   * local pagination state. Uses Firestore cursors for efficient paging.
   *
   * @param pageIndex - Zero-based page index to load
   */
  private async loadPage(pageIndex: number): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const startAfterDoc =
        pageIndex === 0 ? null : this.pageCursors[pageIndex];

      const result: RecipePageResult = await this.recipeLibrary.getRecipesPage(
        this.cuisine,
        this.pageSize,
        startAfterDoc || undefined
      );

      if (result.items.length === 0 && pageIndex > 0) {
        this.hasMore = false;
        return;
      }

      this.pages[pageIndex] = result.items;
      this.currentPageIndex = pageIndex;
      this.recipes = result.items;

      if (result.lastDoc) {
        this.pageCursors[pageIndex + 1] = result.lastDoc;
      }

      this.hasMore = result.items.length === this.pageSize;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navigates to the given page index, using cached data if available.
   * If the page is not cached yet, it calls `loadPage`.
   *
   * @param pageIndex - Zero-based page index to navigate to
   */
  async goToPage(pageIndex: number): Promise<void> {
    if (pageIndex < 0) return;

    if (pageIndex < this.pages.length && this.pages[pageIndex]) {
      this.currentPageIndex = pageIndex;
      this.recipes = this.pages[pageIndex];
      return;
    }

    if (!this.hasMore && pageIndex >= this.pages.length) {
      return;
    }

    await this.loadPage(pageIndex);
  }

  /**
   * Navigates to the next page if available.
   */
  async nextPage(): Promise<void> {
    const nextIndex = this.currentPageIndex + 1;
    if (!this.hasMore && nextIndex >= this.pages.length) return;
    await this.goToPage(nextIndex);
  }

  /**
   * Navigates to the previous page if available.
   */
  async prevPage(): Promise<void> {
    const prevIndex = this.currentPageIndex - 1;
    if (prevIndex < 0) return;
    await this.goToPage(prevIndex);
  }

  /**
   * Number of real pages that have been loaded so far.
   * If no pages are cached but there are recipes, returns 1.
   */
  get totalPages(): number {
    return this.pages.length || (this.recipes.length > 0 ? 1 : 0);
  }

  /**
   * Pages that should be shown in the UI.
   *
   * Includes:
   * - All real pages that have been loaded.
   * - Optionally one "virtual" next page when:
   *   - exactly one page is loaded
   *   - `hasMore` is true
   *   - the current page is the first one
   *
   * This allows the UI to render a clickable "next" page indicator
   * even if the data has not been preloaded yet.
   */
  get displayPagesArray(): number[] {
    const realPages = this.totalPages;

    const shouldShowExtra =
      this.hasMore &&
      realPages === 1 &&
      this.currentPageIndex === 0;

    const count = realPages + (shouldShowExtra ? 1 : 0);
    return Array.from({ length: count }, (_, i) => i);
  }
}
