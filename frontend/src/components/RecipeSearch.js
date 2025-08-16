import React, { useState } from "react";

export default function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Mock data for now
    setResults([
      { title: "Vegan Pasta", category: "Vegan" },
      { title: "Keto Salad", category: "Keto" }
    ]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recipe Search</h2>
      <input
        type="text"
        placeholder="Search by title, ingredient, or category"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
        Search
      </button>

      <ul className="mt-4">
        {results.map((recipe, index) => (
          <li key={index} className="border-b py-2">
            {recipe.title} - <span className="text-gray-500">{recipe.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
