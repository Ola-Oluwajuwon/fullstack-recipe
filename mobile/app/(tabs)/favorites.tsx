import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

interface FavoriteRecipe {
  id: string;
  recipeId: string;
  title: string;
  image: string;
  description?: string;
  cookTime?: string;
  servings?: number;
}

const FavoritesRecipeScreen = (): React.JSX.Element => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadFavorites = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch favorites: ${response.status} ${response.statusText}`
          );
        }

        const favorites = await response.json();

        // Handle different response formats from backend
        let favoritesArray = favorites;

        // If the response is wrapped in an object (e.g., { favorites: [...] })
        if (
          favorites &&
          typeof favorites === "object" &&
          !Array.isArray(favorites)
        ) {
          // Check common property names
          if (Array.isArray(favorites.favorites)) {
            favoritesArray = favorites.favorites;
          } else if (Array.isArray(favorites.data)) {
            favoritesArray = favorites.data;
          } else if (Array.isArray(favorites.results)) {
            favoritesArray = favorites.results;
          } else {
            favoritesArray = [];
          }
        }

        // Ensure we have an array
        if (!Array.isArray(favoritesArray)) {
          favoritesArray = [];
        }

        // transform the data to match the RecipeCard component's expected format
        const transformedFavorites: FavoriteRecipe[] = favoritesArray.map(
          (favorite: any) => ({
            ...favorite,
            id: favorite.recipeId,
          })
        );

        setFavoriteRecipes(transformedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        Alert.alert(
          "Error",
          `Failed to load favorites: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const handleSignOut = (): void => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default FavoritesRecipeScreen;
