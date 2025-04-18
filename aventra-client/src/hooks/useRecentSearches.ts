import { useSearchStore } from '@/stores/searchStore';

export const useRecentSearches = () => {
  const { 
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
  } = useSearchStore();

  // Add a search query to recent searches and optionally submit the form
  const saveSearch = (query: string) => {
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  return {
    recentSearches,
    saveSearch,
    removeSearch: removeRecentSearch,
    clearSearches: clearRecentSearches
  };
};