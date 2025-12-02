export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';
export type Cuisine = 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';

export interface SeedIngredient {
  name: string;
  quantity: number;
  unit: string;
  isFromUser: boolean;
  isOptional?: boolean;
}

export interface SeedStep {
  order: number;
  text: string;
  durationMinutes?: number;
  parallelGroup?: string;
  assignedToHelper: 1 | 2 | 3 | 4; 
}

export interface SeedNutrition {
  energyKcalPerPortion: number;
  proteinGramsPerPortion: number;
  fatGramsPerPortion: number;
  carbsGramsPerPortion: number;
}

export interface FirestoreRecipe {
  id: string;
  title: string;
  description?: string;
  diet: Diet;
  totalMinutes: number;
  cuisine: Cuisine;
  ingredients: SeedIngredient[];
  steps: SeedStep[];
  nutrition?: SeedNutrition;
  likes: number;
  source: 'ai' | 'seed';
  createdAt: any;
}

export type SeedFirestoreRecipe = Omit<FirestoreRecipe, 'createdAt'>;


export const SEED_RECIPES: SeedFirestoreRecipe[] = [
 

];


