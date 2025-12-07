/**
 * Diet classification used for recipes.
 */
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

/**
 * Cuisine classification used for recipes.
 */
export type Cuisine =
  | 'german'
  | 'italian'
  | 'indian'
  | 'japanese'
  | 'gourmet'
  | 'fusion';

/**
 * Ingredient structure used in seed data and stored recipes.
 */
export interface SeedIngredient {
  /** Ingredient name. */
  name: string;

  /** Numeric quantity of the ingredient. */
  quantity: number;

  /** Unit for the quantity (e.g. "g", "ml", "piece"). */
  unit: string;

  /**
   * Indicates whether this ingredient originally came from user input.
   * For seeded recipes this is typically `false`.
   */
  isFromUser: boolean;

  /**
   * Marks ingredient as optional.
   * If omitted or false, the ingredient is considered required.
   */
  isOptional?: boolean;
}

/**
 * One instruction step in a seeded recipe.
 */
export interface SeedStep {
  /** Step order, starting from 1. */
  order: number;

  /** Instruction text for this step. */
  text: string;

  /** Optional duration of this step in minutes. */
  durationMinutes?: number;

  /**
   * Optional group key used to indicate that steps can be executed in parallel.
   * Steps with the same `parallelGroup` can run concurrently.
   */
  parallelGroup?: string;

  /**
   * Index of the helper assigned to this step (1–4).
   */
  assignedToHelper: 1 | 2 | 3 | 4;
}

/**
 * Basic nutrition information per portion for a seeded recipe.
 */
export interface SeedNutrition {
  /** Energy in kilocalories per portion. */
  energyKcalPerPortion: number;

  /** Protein in grams per portion. */
  proteinGramsPerPortion: number;

  /** Fat in grams per portion. */
  fatGramsPerPortion: number;

  /** Carbohydrates in grams per portion. */
  carbsGramsPerPortion: number;
}

/**
 * Recipe shape as it is stored in Firestore.
 */
export interface FirestoreRecipe {
  /** Firestore document ID. */
  id: string;

  /** Recipe title. */
  title: string;

  /** Optional short description of the recipe. */
  description?: string;

  /** Diet classification. */
  diet: Diet;

  /** Total time needed for the recipe in minutes. */
  totalMinutes: number;

  /** Cuisine classification. */
  cuisine: Cuisine;

  /** Ingredients required for the recipe. */
  ingredients: SeedIngredient[];

  /** Ordered list of steps describing how to cook the recipe. */
  steps: SeedStep[];

  /** Optional nutrition information per portion. */
  nutrition?: SeedNutrition;

  /** Number of likes for this recipe. */
  likes: number;

  /** Origin of the recipe (AI generated or static seed). */
  source: 'ai' | 'seed';

  /** Firestore timestamp for when the recipe was created. */
  createdAt: any;
}

/**
 * Seed recipe shape used for initialization.
 * `createdAt` is added when inserting into Firestore.
 */
export type SeedFirestoreRecipe = Omit<FirestoreRecipe, 'createdAt'>;

/**
 * Initial recipes used to seed the Firestore database.
 * Intentionally left empty – can be filled manually if needed.
 */
export const SEED_RECIPES: SeedFirestoreRecipe[] = [];
