import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  cookingTime: number; // kommt aus totalMinutes
  diet: string;
  speed: string;       // leiten wir aus cookingTime ab
  likes: number;
  cuisine: Cuisine;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeLibraryService {
  // Verweis auf die Firestore-Collection "recipes"
  private readonly recipesCollection = collection(this.firestore, 'recipes');

  constructor(private readonly firestore: Firestore) {}

  /**
   * Hilfsfunktion: ordnet die "speed"-Kategorie nach Kochzeit zu.
   * (Anlehnung an deine Zeit-Kategorien)
   */
  private mapSpeed(totalMinutes: number): string {
    if (totalMinutes <= 20) {
      return 'Quick';         // Schnell
    } else if (totalMinutes <= 45) {
      return 'Medium';        // Mittel
    } else {
      return 'Complex';       // Aufwendig
    }
  }

  /**
   * Mappt ein Firestore-Rezept-Dokument auf das UI-Modell RecipeListItem.
   * Erwartet Felder: id, title, totalMinutes, diet, cuisine, likes
   */
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

  /**
   * Holt Rezepte aus Firestore, optional gefiltert nach Cuisine.
   * Nutzt deine Collection "recipes".
   */
  getRecipesByCuisine(cuisine: Cuisine | null): Observable<RecipeListItem[]> {
    let q;

    if (cuisine) {
      q = query(this.recipesCollection, where('cuisine', '==', cuisine));
    } else {
      // Alle Rezepte (kein Cuisine-Filter)
      q = this.recipesCollection;
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs: any[]) => docs.map((d) => this.mapToListItem(d)))
    );
  }
}
