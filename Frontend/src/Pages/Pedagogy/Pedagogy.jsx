import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon } from "lucide-react";

const Pedagogy = () => {
  const [courseName, setCourseName] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSuggestions = async () => {
    if (!courseName) {
      alert("Please enter a course name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/generate-suggestion", {
        course_name: courseName,
      });
      setSuggestions(response.data.suggestions);
    } catch (err) {
      setError("An error occurred while fetching suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestions = () => {
    if (!suggestions) return null;

    // Split suggestions into individual lines
    const suggestionLines = suggestions.split('\n').filter(line => line.trim() !== '');

    return (
      <div className="mt-6 bg-blue-200 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">
          Pedagogical Recommendations
        </h2>
        <div className="space-y-3">
          {suggestionLines.map((line, index) => (
            <div 
              key={index} 
              className="flex items-start text-gray-800 leading-relaxed bg-blue-100 p-3 rounded-md shadow-sm border-l-4 border-blue-400 transition-all hover:shadow-md"
            >
              <CheckCircleIcon className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
              <p className="flex-grow">{line.trim()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-black-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-cyan-600 mb-4 text-center">
          Pedagogy Suggestion System
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Enter a course name to receive effective pedagogy suggestions.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>

        <button
          onClick={handleGenerateSuggestions}
          disabled={loading}
          className={`w-full py-3 rounded-md text-grey-200 font-semibold transition-all duration-300 ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "Generating..." : "Get Suggestions"}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}

        {renderSuggestions()}
      </div>

      <footer className="text-center text-gray-500 mt-6 text-sm">
        Developed by Anirudh Hegde, E Harshith, Sk Sai Tarun, Suprith A.S
      </footer>
    </div>
  );
};

export default Pedagogy;