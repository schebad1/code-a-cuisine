import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  RecipeGenerationRequest,
  RecipeGenerationResponse,
} from '../api/recipe-api.contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeApiService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a recipe generation request to the backend workflow (n8n).
   *
   * The backend takes the user's ingredients and preferences and responds
   * with either a list of generated recipes or an error including quota info.
   *
   * @param request - The recipe generation request payload
   * @returns Observable emitting a recipe generation response
   */
  generateRecipes(
    request: RecipeGenerationRequest
  ): Observable<RecipeGenerationResponse> {
    const url = 'https://schebad.app.n8n.cloud/webhook/recipes/generate';

    return this.http.post<RecipeGenerationResponse>(url, request);
  }
}
