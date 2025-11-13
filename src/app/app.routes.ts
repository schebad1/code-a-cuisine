import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/hero/hero.component').then(m => m.HeroComponent) },
  { path: 'generate-recipe', loadComponent: () => import('./pages/generate-recipe/generate-recipe.component').then(m => m.GenerateRecipeComponent) },
  { path: 'preferences', loadComponent: () => import('./pages/preferences/preferences.component').then(m => m.PreferencesComponent) },
  { path: 'loading', loadComponent: () => import('./pages/loading/loading.component').then(m => m.LoadingComponent) },
  { path: 'results', loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent) },
  {path: 'recipe-view',loadComponent: () => import('./pages/recipe-view/recipe-view.component').then(m => m.RecipeViewComponent)},
  { path: 'cookbook', loadComponent: () => import('./pages/cookbook/cookbook.component').then(m => m.CookbookComponent) },
  { path: 'recipes', loadComponent: () => import('./pages/recipes/recipes.component').then(m => m.RecipesComponent) },
  { path: '**', redirectTo: '' },
];