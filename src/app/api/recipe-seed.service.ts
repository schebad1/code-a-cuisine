import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { SEED_RECIPES, FirestoreRecipe } from './recipe-seed.data';

@Injectable({
  providedIn: 'root',
})
export class RecipeSeedService {
  constructor(private firestore: Firestore) {}

  async seedInitialRecipes(): Promise<void> {
    const recipesCollection = collection(this.firestore, 'recipes');

    for (const recipe of SEED_RECIPES) {
      const recipeDoc = doc(recipesCollection, recipe.id);

      const recipeToSave: FirestoreRecipe = {
        ...recipe,
        createdAt: serverTimestamp() as any,
      };

      await setDoc(recipeDoc, recipeToSave, { merge: false });
      console.log('[Seed] Recipe written:', recipe.id);
    }

    console.log('[Seed] All recipes seeded.');
  }
}
