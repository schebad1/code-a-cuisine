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

  generateRecipes(
    request: RecipeGenerationRequest
  ): Observable<RecipeGenerationResponse> {
    const url = 'https://schebad.app.n8n.cloud/webhook-test/recipes/generate';
  
    return this.http.post<RecipeGenerationResponse>(url, request);
  }
  
}
