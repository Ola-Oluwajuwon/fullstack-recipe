const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

interface MealSearchResponse {
  meals: Meal[] | null;
}

// Category interface for getCategories response
interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

interface CategoryResponse {
  categories: Category[];
}

// Transformed meal data interface
interface TransformedMeal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string[];
  originalData: Meal;
}

export const MealAPI = {
  // Search a meal by name
  searchMealsByName: async (query: string): Promise<Meal[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data: MealSearchResponse = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals:", error);
      return [];
    }
  },

  // Lookup full meal details by ID
  getMealById: async (id: string): Promise<Meal | null> => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data: MealSearchResponse = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching meal by ID:", error);
      return null;
    }
  },

  // Lookup a single random meal
  getRandomMeal: async (): Promise<Meal | null> => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data: MealSearchResponse = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching random meal:", error);
      return null;
    }
  },

  // Get multiple random meals
  getMultipleRandomMeals: async (count: number = 6): Promise<Meal[]> => {
    try {
      const promises: Promise<Meal | null>[] = Array(count)
        .fill(0)
        .map(() => MealAPI.getRandomMeal());
      const meals: (Meal | null)[] = await Promise.all(promises);
      return meals.filter((meal): meal is Meal => meal !== null);
    } catch (error) {
      console.error("Error fetching multiple random meals:", error);
      return [];
    }
  },

  // List all meal categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data: CategoryResponse = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error fetching meal categories:", error);
      return [];
    }
  },

  // Filter by main ingredient
  filterByIngredient: async (ingredient: string): Promise<Meal[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data: MealSearchResponse = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by ingredient:", error);
      return [];
    }
  },

  // Filter by category
  filterByCategory: async (category: string): Promise<Meal[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data: MealSearchResponse = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by category:", error);
      return [];
    }
  },

  // Transform TheMealDB meal data to our app format
  transformMealData: (meal: Meal): TransformedMeal | null => {
    if (!meal) return null;

    // Extract ingredients from the meal object
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal] as string;
      const measure = meal[`strMeasure${i}` as keyof Meal] as string;
      if (ingredient && ingredient.trim()) {
        const measureText: string =
          measure && measure.trim() ? `${measure.trim()} ` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    // Extract instructions
    const instructions: string[] = meal.strInstructions
      ? meal.strInstructions
          .split(/\r?\n/)
          .filter((step: string) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
