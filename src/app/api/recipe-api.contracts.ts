// recipe-api.contracts.ts
import { Ingredient } from '../pages/generate-recipe/ingredients-state.service';
import {
  TimeCategory,
  Cuisine,
  Diet,
} from '../pages/preferences/preferences-state.service';

export interface RecipeGenerationRequest {
  ingredients: Ingredient[];
  preferences: {
    portions: number;
    cookingHelpers: number; 
    timeCategory: TimeCategory;
    cuisine: Cuisine;
    diet: Diet;
  };
  clientMeta?: {
    appVersion?: string;
    locale?: string;
  };
}

export interface QuotaInfo {
  limitPerIp: number;
  remainingForIpToday: number;
  limitGlobal: number;
  remainingGlobalToday: number;
}

export interface GeneratedIngredient {
  name: string;
  quantity: number;
  unit: string;
  isFromUser: boolean;
  isOptional?: boolean;
}

export interface RecipeNutrition {
  energyKcalPerPortion: number;
  proteinGramsPerPortion: number;
  fatGramsPerPortion: number;
  carbsGramsPerPortion: number;
}

export interface GeneratedStep {
  order: number;
  text: string;
  durationMinutes?: number;
  parallelGroup?: string;
  assignedToHelper?: number; 
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  description?: string;
  totalMinutes: number;
  cuisine: Cuisine;
  diet: Diet;
  ingredients: GeneratedIngredient[];
  steps: GeneratedStep[];
  nutrition?: RecipeNutrition;
}

export interface RecipeGenerationSuccessResponse {
  success: true;
  quota: QuotaInfo;
  recipes: GeneratedRecipe[]; 
}

export interface RecipeGenerationErrorResponse {
  success: false;
  quota: QuotaInfo;
  error: {
    code: 'QUOTA_EXCEEDED_IP' | 'QUOTA_EXCEEDED_GLOBAL' | 'UNKNOWN_ERROR';
    message: string;
  };
}

export type RecipeGenerationResponse =
  | RecipeGenerationSuccessResponse
  | RecipeGenerationErrorResponse;
