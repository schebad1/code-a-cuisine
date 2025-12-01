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
  cuisine: Cuisine | null = null;
  cuisineLabel = 'All recipes';

  recipes: RecipeListItem[] = [];

  pageSize = 20;
  currentPageIndex = 0;
  pages: RecipeListItem[][] = [];
  pageCursors: (QueryDocumentSnapshot<DocumentData> | null)[] = [null];
  isLoading = false;
  hasMore = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeLibrary: RecipeLibraryService
  ) {}

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

  async nextPage(): Promise<void> {
    const nextIndex = this.currentPageIndex + 1;
    if (!this.hasMore && nextIndex >= this.pages.length) return;
    await this.goToPage(nextIndex);
  }

  async prevPage(): Promise<void> {
    const prevIndex = this.currentPageIndex - 1;
    if (prevIndex < 0) return;
    await this.goToPage(prevIndex);
  }

  // Reale Seiten, die bereits geladen wurden
  get totalPages(): number {
    return this.pages.length || (this.recipes.length > 0 ? 1 : 0);
  }

  // Seiten, die in der UI angezeigt werden sollen:
  // reale Seiten + ggf. eine "virtuelle" nächste Seite, wenn hasMore = true.
  get displayPagesArray(): number[] {
    const realPages = this.totalPages;
    const extra = this.hasMore ? 1 : 0;
    const count = realPages + extra;
    return Array.from({ length: count }, (_, i) => i);
  }
}
