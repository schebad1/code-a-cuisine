import { Routes } from '@angular/router';

/**
 * Application-wide route configuration.
 *
 * Each route lazily loads its associated standalone component to improve
 * initial load performance and reduce bundle size.
 */
export const routes: Routes = [
  {
    /** Landing page (hero section). */
    path: '',
    loadComponent: () =>
      import('./pages/hero/hero.component').then((m) => m.HeroComponent),
  },
  {
    /** Ingredient input screen where the user defines ingredients. */
    path: 'generate-recipe',
    loadComponent: () =>
      import('./pages/generate-recipe/generate-recipe.component').then(
        (m) => m.GenerateRecipeComponent
      ),
  },
  {
    /** Screen where the user selects cooking preferences (time, cuisine, diet). */
    path: 'preferences',
    loadComponent: () =>
      import('./pages/preferences/preferences.component').then(
        (m) => m.PreferencesComponent
      ),
  },
  {
    /**
     * Loading page: triggers the recipe generation API call.
     * User never stays here manually — it's an intermediate page.
     */
    path: 'loading',
    loadComponent: () =>
      import('./pages/loading/loading.component').then(
        (m) => m.LoadingComponent
      ),
  },
  {
    /**
     * Results page: displays generated recipes and quota information.
     */
    path: 'results',
    loadComponent: () =>
      import('./pages/results/results.component').then(
        (m) => m.ResultsComponent
      ),
  },
  {
    /**
     * Detailed view of a single recipe from the cookbook or API results.
     */
    path: 'recipes/:id',
    loadComponent: () =>
      import('./pages/recipe-view/recipe-view.component').then(
        (m) => m.RecipeViewComponent
      ),
  },
  {
    /**
     * Displays the user's cookbook (top liked recipes).
     */
    path: 'cookbook',
    loadComponent: () =>
      import('./pages/cookbook/cookbook.component').then(
        (m) => m.CookbookComponent
      ),
  },
  {
    /**
     * Paginated list of all recipes in the database, optionally filtered by cuisine.
     */
    path: 'recipes',
    loadComponent: () =>
      import('./pages/recipes/recipes.component').then(
        (m) => m.RecipesComponent
      ),
  },

  /** Fallback: redirect unknown routes back to the home page. */
  { path: '**', redirectTo: '' },
];
