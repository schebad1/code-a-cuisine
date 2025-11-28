import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';
import { NgIf, NgForOf } from '@angular/common';
import {
  RecipeGenerationResponse,
  GeneratedRecipe,
} from '../../api/recipe-api.contracts';

type ResultsData = RecipeGenerationResponse & {
  recipes: GeneratedRecipe[];
  recipeIds: string[];
};

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HeaderPrimaryComponent, RouterLink, NgIf, NgForOf],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  recipes: GeneratedRecipe[] = [];
  recipeIds: string[] = [];

  quotaInfo = {
    limitPerIp: 0,
    remainingForIpToday: 0,
    limitGlobal: 0,
    remainingGlobalToday: 0,
  };

  cuisineLabel = '';
  timeCategoryLabel = '';

  constructor(private readonly router: Router) {}

  private hasResultsData(response: any): response is ResultsData {
    return (
      !!response &&
      Array.isArray(response.recipes) &&
      Array.isArray(response.recipeIds)
    );
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateFromNav = nav?.extras.state as { data?: unknown } | undefined;
    const stateFromHistory = history.state as { data?: unknown } | undefined;

    const data = stateFromNav?.data ?? stateFromHistory?.data;

    if (!data) {
      this.router.navigate(['/generate-recipe']);
      return;
    }

    const response = data as ResultsData;

    if (!this.hasResultsData(response) || response.recipes.length === 0) {
      this.router.navigate(['/generate-recipe']);
      return;
    }

    this.recipes = response.recipes;
    this.recipeIds = response.recipeIds;
    this.quotaInfo = (response as any).quota ?? this.quotaInfo;

    if (this.recipes.length > 0) {
      const first = this.recipes[0];

      const cuisineMap: Record<string, string> = {
        german: 'German',
        italian: 'Italian',
        indian: 'Indian',
        japanese: 'Japanese',
        gourmet: 'Gourmet',
        fusion: 'Fusion',
      };

      this.cuisineLabel = cuisineMap[first.cuisine] ?? first.cuisine;
      this.timeCategoryLabel = this.getTimeCategoryLabel(first.totalMinutes);
    }
  }

  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 40) return 'Medium';
    return 'Complex';
  }

  openRecipe(index: number): void {
    const id = this.recipeIds[index];

    if (!id) {
      console.error('No recipe id for index', index, this.recipeIds);
      return;
    }

    this.router.navigate(['/recipes', id]);
  }
}
