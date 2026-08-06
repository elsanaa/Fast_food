// App.tsx
import React from "react";
import List from "./assets/List"; // اگر مسیر لیست شما فرق دارد اصلاح کنید
import axios from "axios";

type Story = {
  title: string | null;
  url?: string | null;
  author?: string | null;
  objectID: string;
};

type StoriesState = {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const initialState: StoriesState = {
  data: [],
  isLoading: false,
  isError: false,
};

type Action =
  | { type: "STORIES_FETCH_INIT" }
  | { type: "STORIES_FETCH_SUCCESS"; payload: Story[] }
  | { type: "STORIES_FETCH_FAILURE" }
  | { type: "SET_STORIES"; payload: Story[] };

const storiesReducer = (state: StoriesState, action: Action): StoriesState => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "STORIES_FETCH_SUCCESS":
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "SET_STORIES":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

const useStorageState = (key: string, initial: string) => {
  const [value, setValue] = React.useState<string>(() => {
    const persisted = localStorage.getItem(key);
    return persisted ?? initial;
  });

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(storiesReducer, initialState);
  const { data: stories, isLoading, isError } = state;

  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "");
  const [url, setUrl] = React.useState(() => `${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    if (!url) return;
    dispatch({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);
      const hits: Story[] = result.data.hits ?? [];
      dispatch({ type: "STORIES_FETCH_SUCCESS", payload: hits });
    } catch (error) {
      dispatch({ type: "STORIES_FETCH_FAILURE" });
      console.error("fetch error:", error);
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    const newStories = stories.filter((story) => story.objectID !== item.objectID);
    dispatch({ type: "SET_STORIES", payload: newStories });
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const SearchForm: React.FC<{
    searchTerm: string;
    onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }> = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
    <div>
      <form onSubmit={onSearchSubmit}>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" autoFocus value={searchTerm} onChange={onSearchInput} />
        <button type="submit" disabled={!searchTerm}>
          submit
        </button>
      </form>
    </div>
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
      <hr />
      {isError && <p>Something went wrong...</p>}
      {isLoading ? <div>Loading...</div> : <List list={stories} onRemoveItem={handleRemoveStory} />}
    </div>
  );
};

export default App;
