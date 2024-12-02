'use client';

import { useState } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import ListingCard from '@/app/components/listings/ListingCard';
import { SafeListing } from "@/app/types";

interface SearchWrapperProps {
  currentUser?: any;
}

const SearchWrapper: React.FC<SearchWrapperProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [filteredListings, setFilteredListings] = useState<SafeListing[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredListings([]); // Reset results if the query is empty
      return;
    }

    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();

    setFilteredListings(data.results);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar currentUser={currentUser} onSearch={handleSearch} />

      {/* Spacer for Navbar and Categories */}
      <div className="h-[200px]"></div> {/* Adjusted height to prevent overlap */}

      {/* Conditionally Render Search Results */}
      {searchQuery && filteredListings.length > 0 && (
        <div className="container mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      )}

      {/* Show a message if search query exists but no results */}
      {searchQuery && filteredListings.length === 0 && (
        <div className="p-4 text-center text-neutral-500">
          No listings found for your search.
        </div>
      )}
    </div>
  );
};

export default SearchWrapper;
