export interface Category {
  id: number;
  label: string;
}

export interface Tag {
  id: number;
  label: string;
}

export interface RecipeAuthor {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Recipe {
  id: number;
  label: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  preparationTime: number | null;
  cookingTime: number | null;
  quantity: number | null;
  category: Category | null;
  tags: Tag[];
  author: RecipeAuthor | null;
  createdAt: string;
  updatedAt: string;
  photoUrl: string | null;
  ratingAverage: number | null;
  ratingCount: number;
  isFavorite: boolean;
  userRating?: number | null;
}

export interface RecipeListData {
  recipes: Recipe[];
  categories: Category[];
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchResult {
  id: number;
  label: string;
  description: string | null;
  category: string | null;
  author: string | null;
}
