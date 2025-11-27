import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { NgForOf } from '@angular/common';
import { RecipeListItem, RecipeLibraryService } from '../../api/recipe-library.service';
import { Cuisine } from '../../api/recipe-seed.data';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterModule, NgForOf],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  cuisine: Cuisine | null = null;
  cuisineLabel = 'All recipes';

  recipes: RecipeListItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeLibrary: RecipeLibraryService,
  ) {}

  ngOnInit(): void {
    const cuisineParam = this.route.snapshot.queryParamMap.get(
      'cuisine',
    ) as Cuisine | null;

    if (cuisineParam && this.isValidCuisine(cuisineParam)) {
      this.cuisine = cuisineParam;
      this.cuisineLabel = this.mapCuisineToLabel(cuisineParam);
    } else {
      this.cuisine = null;
      this.cuisineLabel = 'All recipes';
    }

    this.loadRecipes();
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

  private loadRecipes(): void {
    this.recipeLibrary.getRecipesByCuisine(this.cuisine).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }
}
