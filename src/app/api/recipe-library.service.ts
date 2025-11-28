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

export interface RecipeListItem {
  id: string;
  title: string;
  cookingTime: number;
  diet: string;
  speed: string;
  likes: number;
  cuisine: Cuisine;
}

export interface RecipePageResult {
  items: RecipeListItem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
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

  getRecipeById(id: string): Observable<FirestoreRecipe | null> {
    const ref = doc(this.firestore, 'recipes', id);

    return docData(ref, { idField: 'id' }).pipe(
      map((d: any) => (d ? (d as FirestoreRecipe) : null)),
      catchError(() => of(null))
    );
  }

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

  private async findExistingRecipeByHash(checksum: string): Promise<string | null> {
    const q = query(this.recipesCollection, where('checksum', '==', checksum));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const firstDoc = snapshot.docs[0];
    return firstDoc.id;
  }

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
      isFromUser: ing.isFromUser ?? false,
      isOptional: ing.isOptional ?? false,
    }));

    const steps = (recipe.steps || []).map((step: any, i: number) => ({
      order: step.order ?? i + 1,
      text: step.text,
      durationMinutes: step.durationMinutes ?? undefined,
      parallelGroup: step.parallelGroup ?? undefined,
      assignedToHelper:
        step.assignedToHelper === 1 || step.assignedToHelper === 2
          ? step.assignedToHelper
          : i % 2 === 0
          ? 1
          : 2,
    }));

    const data: Omit<FirestoreRecipe, 'id'> & { checksum: string } = {
      title: recipe.title,
      description: recipe.description ?? '',
      diet: recipe.diet ?? 'none',
      totalMinutes: recipe.totalMinutes ?? 0,
      cuisine: recipe.cuisine as Cuisine,
      ingredients,
      steps,
      nutrition: recipe.nutrition,
      likes: 0,
      source: 'ai',
      createdAt: serverTimestamp() as any,
      checksum,
    };

    const cleaned = this.cleanUndefined(data);
    const docRef = await addDoc(this.recipesCollection, cleaned as any);
    return docRef.id;
  }
}
