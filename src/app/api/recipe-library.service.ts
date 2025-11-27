import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cuisine } from './recipe-seed.data';
import { FirestoreRecipe } from './recipe-seed.data';

export { Cuisine } from './recipe-seed.data';

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
  private readonly recipesCollection = collection(this.firestore, 'recipes');

  constructor(private readonly firestore: Firestore) {}

  private mapSpeed(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 45) return 'Medium';
    return 'Complex';
  }

  private mapToListItem(doc: any): RecipeListItem {
    const totalMinutes = doc.totalMinutes ?? 0;

    return {
      id: doc.id,
      title: doc.title ?? 'Untitled',
      cookingTime: totalMinutes,
      diet: doc.diet ?? 'none',
      speed: this.mapSpeed(totalMinutes),
      likes: doc.likes ?? 0,
      cuisine: doc.cuisine as Cuisine,
    };
  }

  getRecipesByCuisine(cuisine: Cuisine | null): Observable<RecipeListItem[]> {
    let q;

    if (cuisine) {
      q = query(this.recipesCollection, where('cuisine', '==', cuisine));
    } else {
      q = this.recipesCollection;
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs: any[]) => docs.map((d) => this.mapToListItem(d)))
    );
  }

  getRecipeById(id: string): Observable<FirestoreRecipe | null> {
    const ref = doc(this.firestore, 'recipes', id);

    return docData(ref, { idField: 'id' }).pipe(
      map((d: any) => (d ? (d as FirestoreRecipe) : null)),
      catchError(() => of(null))
    );
  }
}
