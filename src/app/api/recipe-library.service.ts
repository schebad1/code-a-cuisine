import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  docData,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FirestoreRecipe, Cuisine } from './recipe-seed.data';
import { GeneratedRecipe } from './recipe-api.contracts';

export { Cuisine } from './recipe-seed.data';

/**
 * Lightweight representation of a recipe, used for lists and overviews.
 */
export interface RecipeListItem {
  /** Firestore document ID of the recipe. */
  id: string;

  /** Recipe title. */
  title: string;

  /** Total cooking time in minutes. */
  cookingTime: number;

  /** Diet identifier (e.g. "none", "vegan", "vegetarian"). */
  diet: string;

  /** Time category label derived from cooking time (Quick / Medium / Complex). */
  speed: string;

  /** Number of likes for this recipe. */
  likes: number;

  /** Cuisine classification for this recipe. */
  cuisine: Cuisine;
}

/**
 * Result of a paginated recipe query.
 */
export interface RecipePageResult {
  /** List of recipes for the requested page. */
  items: RecipeListItem[];

  /**
   * Firestore document snapshot to be used as a cursor
   * when loading the next page. `null` if there is no further page.
   */
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeLibraryService {
  /** Firestore collection reference for recipes. */
  private readonly recipesCollection = collection(this.firestore, 'recipes');

  constructor(private readonly firestore: Firestore) {}

  /**
   * Maps total minutes to a human-readable speed label.
   *
   * @param totalMinutes - Total preparation and cooking time
   * @returns "Quick", "Medium" or "Complex"
   */
  private mapSpeed(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 45) return 'Medium';
    return 'Complex';
  }

  /**
   * Maps a Firestore recipe document into a `RecipeListItem`.
   *
   * @param doc - Raw document data (including id)
   * @returns A normalized list item
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
   * Returns all recipes for a given cuisine, or all recipes when cuisine is null.
   *
   * @param cuisine - Cuisine filter or null for all cuisines
   * @returns Observable emitting a list of recipe list items
   */
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

  /**
   * Loads a paginated list of recipes for an optional cuisine filter.
   * Uses Firestore cursors to fetch pages in descending `createdAt` order.
   *
   * @param cuisine - Cuisine filter or null for all cuisines
   * @param pageSize - Number of recipes per page
   * @param startAfterDoc - Cursor to start after, or null/undefined for first page
   * @returns A page result containing items and a cursor for the next page
   */
  async getRecipesPage(
    cuisine: Cuisine | null,
    pageSize: number,
    startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<RecipePageResult> {
    const constraints: any[] = [];

    if (cuisine) {
      constraints.push(where('cuisine', '==', cuisine));
    }

    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(pageSize));

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    const q = query(this.recipesCollection, ...constraints);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const items: RecipeListItem[] = docs.map((d) =>
      this.mapToListItem({
        id: d.id,
        ...(d.data() as any),
      })
    );

    const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

    return { items, lastDoc };
  }

  /**
   * Fetches a single recipe by its Firestore ID.
   *
   * @param id - Recipe document ID
   * @returns Observable emitting the recipe or null if not found or on error
   */
  getRecipeById(id: string): Observable<FirestoreRecipe | null> {
    const ref = doc(this.firestore, 'recipes', id);

    return docData(ref, { idField: 'id' }).pipe(
      map((d: any) => (d ? (d as FirestoreRecipe) : null)),
      catchError(() => of(null))
    );
  }

  /**
   * Recursively replaces all `undefined` values in the given object/array
   * with `null`. This is important for Firestore, which does not accept
   * `undefined` as a field value.
   *
   * @param value - Arbitrary value, object or array to clean
   * @returns Cleaned value with no `undefined` fields
   */
  private cleanUndefined(value: any): any {
    if (Array.isArray(value)) {
      return value.map((v) => this.cleanUndefined(v));
    }

    if (value && typeof value === 'object') {
      const cleaned: any = {};
      for (const key of Object.keys(value)) {
        const val = value[key];
        cleaned[key] = val === undefined ? null : this.cleanUndefined(val);
      }
      return cleaned;
    }

    return value;
  }

  /**
   * Calculates a deterministic hash string for a generated recipe.
   * Only stable fields (title, time, diet, cuisine, ingredients, steps)
   * are included so that the same recipe structure results in the same hash.
   *
   * @param recipe - Generated recipe to hash
   * @returns Hash string representing the recipe payload
   */
  private calculateRecipeHash(recipe: GeneratedRecipe): string {
    const payload = {
      title: recipe.title ?? '',
      totalMinutes: recipe.totalMinutes ?? 0,
      diet: recipe.diet ?? 'none',
      cuisine: recipe.cuisine ?? '',
      ingredients: (recipe.ingredients || []).map((ing: any) => ({
        name: ing.name ?? '',
        quantity: ing.quantity ?? 0,
        unit: ing.unit ?? '',
      })),
      steps: (recipe.steps || []).map((step: any) => ({
        text: step.text ?? '',
      })),
    };

    const str = JSON.stringify(payload);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }

    return hash.toString();
  }

  /**
   * Looks for an existing recipe document with the given checksum.
   *
   * @param checksum - Previously computed recipe hash
   * @returns The existing recipe ID if found, otherwise null
   */
  private async findExistingRecipeByHash(
    checksum: string
  ): Promise<string | null> {
    const q = query(this.recipesCollection, where('checksum', '==', checksum));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const firstDoc = snapshot.docs[0];
    return firstDoc.id;
  }

  /**
   * Normalizes `isFromUser` into a strict boolean.
   *
   * - true / "true" / 1  -> true
   * - false / "false" / 0 -> false
   * - everything else -> true (defensively treated as user ingredient)
   *
   * @param raw - Raw value from the generated ingredient
   * @returns Normalized boolean flag
   */
  private normalizeIsFromUser(raw: any): boolean {
    if (raw === true) return true;
    if (raw === false) return false;

    if (typeof raw === 'string') {
      const v = raw.toLowerCase().trim();
      if (v === 'true') return true;
      if (v === 'false') return false;
    }

    if (raw === 1) return true;
    if (raw === 0) return false;

    // Fallback: prefer treating it as user ingredient rather than losing it as an extra
    return true;
  }

  /**
   * Saves a generated recipe into Firestore.
   *
   * - Computes a checksum and checks if an identical recipe already exists.
   *   If so, returns the existing document ID.
   * - Normalizes ingredients and steps, including helper assignments.
   * - Adds random likes for display purposes.
   *
   * @param recipe - Generated recipe to persist
   * @returns The Firestore document ID of the saved (or existing) recipe
   */
  async saveGeneratedRecipe(recipe: GeneratedRecipe): Promise<string> {
    const checksum = this.calculateRecipeHash(recipe);

    const existingId = await this.findExistingRecipeByHash(checksum);
    if (existingId) {
      return existingId;
    }

    const ingredients = (recipe.ingredients || []).map((ing: any) => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      isFromUser: this.normalizeIsFromUser(ing.isFromUser),
      isOptional: ing.isOptional ?? false,
    }));

    const steps = (recipe.steps || []).map((step: any, i: number) => {
      const raw = step.assignedToHelper;

      const assigned: 1 | 2 | 3 | 4 =
        typeof raw === 'number' && raw >= 1 && raw <= 4
          ? (raw as 1 | 2 | 3 | 4)
          : 1;

      return {
        order: step.order ?? i + 1,
        text: step.text,
        durationMinutes: step.durationMinutes ?? undefined,
        parallelGroup: step.parallelGroup ?? undefined,
        assignedToHelper: assigned,
      };
    });

    const data: Omit<FirestoreRecipe, 'id'> & { checksum: string } = {
      title: recipe.title,
      description: recipe.description ?? '',
      diet: recipe.diet ?? 'none',
      totalMinutes: recipe.totalMinutes ?? 0,
      cuisine: recipe.cuisine as Cuisine,
      ingredients,
      steps,
      nutrition: recipe.nutrition,
      likes: Math.floor(Math.random() * 116) + 5,
      source: 'ai',
      createdAt: serverTimestamp() as any,
      checksum,
    };

    const cleaned = this.cleanUndefined(data);
    const docRef = await addDoc(this.recipesCollection, cleaned as any);
    return docRef.id;
  }
}
