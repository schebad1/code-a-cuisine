import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';
import { NgIf, NgForOf } from '@angular/common';
import {
  RecipeGenerationResponse,
  GeneratedRecipe,
} from '../../api/recipe-api.contracts';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HeaderPrimaryComponent, RouterLink, NgIf, NgForOf],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  recipes: GeneratedRecipe[] = [];
  quotaInfo = {
    limitPerIp: 0,
    remainingForIpToday: 0,
    limitGlobal: 0,
    remainingGlobalToday: 0,
  };
  cuisineLabel = '';
  timeCategoryLabel = '';

  constructor(private readonly router: Router) {}

  private hasRecipes(
    response: any,
  ): response is RecipeGenerationResponse & { recipes: GeneratedRecipe[] } {
    return !!response && Array.isArray(response.recipes);
  }

  ngOnInit(): void {
    console.log('ResultsComponent init');
    console.log('router.getCurrentNavigation():', this.router.getCurrentNavigation());
    console.log('history.state:', history.state);

    const nav = this.router.getCurrentNavigation();
    const stateFromNav = nav?.extras.state as { data?: unknown } | undefined;
    const stateFromHistory = history.state as { data?: unknown } | undefined;

    const data = stateFromNav?.data ?? stateFromHistory?.data;

    if (!data) {
      console.warn('Keine Recipe-Daten im Router-State – redirect zurück.');
      this.router.navigate(['/generate-recipe']);
      return;
    }

    console.log('Data in ResultsComponent:', data);

    const response = data as RecipeGenerationResponse;

    if (!this.hasRecipes(response) || response.recipes.length === 0) {
      console.error(
        'Rezept-Generierung fehlgeschlagen oder ungültiges Response-Format (keine recipes):',
        response,
      );
      this.router.navigate(['/generate-recipe']);
      return;
    }

    this.recipes = response.recipes;
    this.quotaInfo = (response as any).quota ?? this.quotaInfo;

    console.log('Erhaltene Rezepte:', this.recipes);
    console.log('Quota:', this.quotaInfo);

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
    if (totalMinutes <= 20) {
      return 'Quick';
    }
    if (totalMinutes <= 40) {
      return 'Medium';
    }
    return 'Complex';
  }
}
