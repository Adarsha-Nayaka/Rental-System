import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

interface Suggestion {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  price: number;
  securityDeposit: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length > 0) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/search?query=${query}`);
          const data = await response.json();
          setSuggestions(data.results || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
        setIsLoading(false);
      };

      // Debounce: Delay the fetch to prevent spamming requests
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]); // Clear suggestions if query is too short
    }
  }, [query]);

  const handleSearch = () => {
    onSearch(query);
    setIsExpanded(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsExpanded(false);
    setSuggestions([]);
  };

  const handleIconClick = () => {
    setIsExpanded(true);
  };

  return (
    <div className="relative">
      {!isExpanded ? (
        <button
          onClick={handleIconClick}
          className="flex items-center justify-center bg-[rgb(244_63_94_/var(--tw-bg-opacity))] text-white p-3 rounded-full hover:bg-rose-600 transition duration-300 ease-in-out"
        >
          <FiSearch size={20} />
        </button>
      ) : (
        <div className="flex flex-col w-[350px] border px-4 py-2 rounded shadow-md bg-white transition-all duration-1000 ease-in-out">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-grow outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[rgb(244_63_94_/var(--tw-bg-opacity))] text-white px-4 py-2 rounded hover:bg-rose-600 transition duration-300 ease-in-out"
            >
              Search
            </button>
          </div>
          {isLoading && <div className="text-gray-500 mt-2">Loading...</div>}
          {!isLoading && suggestions.length > 0 && (
            <ul className="mt-2 border-t pt-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id} // Use a unique key (suggestion.id)
                  onClick={() => handleSuggestionClick(suggestion.title)} // Pass suggestion title
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  <div>
                    <strong>{suggestion.title}</strong>
                    <p>{suggestion.description}</p>
                    <img
                      src={suggestion.imageSrc}
                      alt={suggestion.title}
                      className="w-12 h-12 object-cover"
                    />
                    <p>Price: ${suggestion.price}</p>
                    <p>Security Deposit: ${suggestion.securityDeposit}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
