import { Ingredient } from '../pages/generate-recipe/ingredients-state.service';
import {
  TimeCategory,
  Cuisine,
  Diet,
} from '../pages/preferences/preferences-state.service';

/**
 * Request payload for recipe generation.
 * Contains the user-provided ingredients, preferences and optional client metadata.
 */
export interface RecipeGenerationRequest {
  /** List of ingredients the user has entered. */
  ingredients: Ingredient[];

  /** User preferences affecting how recipes are generated. */
  preferences: {
    /** Number of portions to generate the recipe for. */
    portions: number;

    /** Number of helpers / cooks involved in preparing the recipe. */
    cookingHelpers: number;

    /** Desired time category (e.g. quick, medium, complex). */
    timeCategory: TimeCategory;

    /** Desired cuisine type. */
    cuisine: Cuisine;

    /** Dietary preference or restriction. */
    diet: Diet;
  };

  /** Optional metadata about the client sending the request. */
  clientMeta?: {
    /** Client application version, used for debugging or analytics. */
    appVersion?: string;

    /** Client locale (e.g. "de-DE", "en-US"). */
    locale?: string;
  };
}

/**
 * Quota information describing how many requests are allowed.
 * Returned with both success and error responses.
 */
export interface QuotaInfo {
  /** Maximum number of requests allowed per IP per day. */
  limitPerIp: number;

  /** Remaining number of requests for this IP for the current day. */
  remainingForIpToday: number;

  /** Global maximum number of requests allowed per day. */
  limitGlobal: number;

  /** Remaining global requests for the current day. */
  remainingGlobalToday: number;
}

/**
 * Ingredient object returned from recipe generation.
 * Extends the basic ingredient data with origin and optional flag.
 */
export interface GeneratedIngredient {
  /** Ingredient name. */
  name: string;

  /** Numeric quantity of the ingredient. */
  quantity: number;

  /** Unit for the quantity (e.g. "gram", "ml", "piece"). */
  unit: string;

  /**
   * Indicates whether this ingredient came from user input.
   * `false` means it was added by the system as an extra.
   */
  isFromUser: boolean;

  /**
   * Marks ingredient as optional.
   * If omitted or false, the ingredient is considered required.
   */
  isOptional?: boolean;
}

/**
 * Basic nutrition information for a recipe on a per-portion basis.
 */
export interface RecipeNutrition {
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
 * One step in the generated cooking instructions.
 */
export interface GeneratedStep {
  /** Step order, starting at 1. */
  order: number;

  /** Human-readable instruction text for this step. */
  text: string;

  /**
   * Optional duration in minutes for this step.
   * Can be used for scheduling or UI timelines.
   */
  durationMinutes?: number;

  /**
   * Optional identifier indicating which steps can run in parallel.
   * Steps with the same parallelGroup can be executed concurrently.
   */
  parallelGroup?: string;

  /**
   * Index of the helper this step is assigned to.
   * Starts at 1. If omitted, defaults to the main cook.
   */
  assignedToHelper?: number;
}

/**
 * A fully generated recipe including instructions and metadata.
 */
export interface GeneratedRecipe {
  /** Stable unique identifier of the recipe. */
  id: string;

  /** Human-readable recipe title. */
  title: string;

  /** Optional short description or subtitle of the recipe. */
  description?: string;

  /** Total preparation and cooking time in minutes. */
  totalMinutes: number;

  /** Cuisine type of the recipe. */
  cuisine: Cuisine;

  /** Diet classification of the recipe. */
  diet: Diet;

  /** Full list of ingredients used in this recipe. */
  ingredients: GeneratedIngredient[];

  /** Ordered list of steps describing how to cook the recipe. */
  steps: GeneratedStep[];

  /** Optional nutrition information per portion. */
  nutrition?: RecipeNutrition;
}

/**
 * Successful response from the recipe generation API.
 */
export interface RecipeGenerationSuccessResponse {
  /** Indicates a successful generation result. Always true for this type. */
  success: true;

  /** Quota information for this request. */
  quota: QuotaInfo;

  /** List of generated recipes returned by the backend. */
  recipes: GeneratedRecipe[];
}

/**
 * Error response from the recipe generation API.
 */
export interface RecipeGenerationErrorResponse {
  /** Indicates a failed generation result. Always false for this type. */
  success: false;

  /** Quota information for this request. */
  quota: QuotaInfo;

  /** Error details describing the failure. */
  error: {
    /** Machine-readable error code. */
    code: 'QUOTA_EXCEEDED_IP' | 'QUOTA_EXCEEDED_GLOBAL' | 'UNKNOWN_ERROR';

    /** Human-readable error message. */
    message: string;
  };
}

/**
 * Union type for all possible recipe generation responses:
 * either a success with recipes, or an error with details.
 */
export type RecipeGenerationResponse =
  | RecipeGenerationSuccessResponse
  | RecipeGenerationErrorResponse;
