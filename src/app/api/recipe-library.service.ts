import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Cuisine =
  | 'german'
  | 'italian'
  | 'indian'
  | 'japanese'
  | 'gourmet'
  | 'fusion';

export interface RecipeListItem {
  id: string;
  title: string;
  cookingTime: number;
  diet: string;
  speed: string;
  likes: number;
  cuisine: Cuisine;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeLibraryService {

  private readonly dummyRecipes: RecipeListItem[] = [
    {
      id: '1',
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: 20,
      diet: 'Vegetarian',
      speed: 'Quick',
      likes: 66,
      cuisine: 'italian',
    },
    {
      id: '2',
      title: 'Creamy lemon garlic gnocchi',
      cookingTime: 15,
      diet: 'Vegetarian',
      speed: 'Easy',
      likes: 41,
      cuisine: 'italian',
    },
    {
      id: '3',
      title: 'Classic Lasagna',
      cookingTime: 50,
      diet: 'None',
      speed: 'Complex',
      likes: 83,
      cuisine: 'italian',
    },
    {
      id: '4',
      title: 'Schnitzel with potato salad',
      cookingTime: 35,
      diet: 'None',
      speed: 'Medium',
      likes: 52,
      cuisine: 'german',
    },
  ];


  getRecipesByCuisine(cuisine: Cuisine | null): Observable<RecipeListItem[]> {
    if (!cuisine) {
      return of(this.dummyRecipes);
    }

    const filtered = this.dummyRecipes.filter(
      (recipe) => recipe.cuisine === cuisine,
    );
    return of(filtered);
  }
}
