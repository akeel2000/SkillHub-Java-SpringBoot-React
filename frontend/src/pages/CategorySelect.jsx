import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoriesList = ["Art", "Music", "Coding", "Business", "Fitness", "Cooking"];

const CategorySelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleToggle = (category) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    const email = prompt("Enter your email to save categories"); // Or get from JWT
    try {
      const res = await fetch(`http://localhost:8080/api/auth/categories?email=${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      if (res.ok) navigate("/home");
      else alert("Error saving categories");
    } catch (err) {
      alert("Failed to save categories");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-indigo-600 mb-6">Choose Your Interests</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => handleToggle(cat)}
            className={`px-4 py-2 rounded-full border ${
              selected.includes(cat)
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Continue
      </button>
    </div>
  );
};

export default CategorySelect;