import React, { useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import axios from "axios";

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

    const suggestionLines = suggestions.split('\n').filter(line => line.trim() !== '');

    return (
      <div className="mt-8 bg-gray-950 border-l-4 border-cyan-600 rounded-xl p-8 shadow-2xl w-full">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-gray-800 pb-3">
          Pedagogical Recommendations
        </h2>
        <div className="space-y-4 w-full">
          {suggestionLines.map((line, index) => (
            <div 
              key={index} 
              className="flex items-start bg-gray-900 p-5 rounded-lg shadow-lg border-l-4 border-cyan-500 transition-all duration-300 hover:shadow-cyan-900/20 hover:bg-gray-800 group w-full"
            >
              <CheckCircleIcon 
                className="text-cyan-400 mr-4 mt-1 flex-shrink-0 group-hover:text-cyan-300" 
                size={24} 
              />
              <p className="flex-grow text-gray-300 group-hover:text-gray-200">{line.trim()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-12 w-full">
      <div className="px-4 lg:px-8 w-full">
        <div className="bg-gray-950 shadow-2xl rounded-2xl p-8 border border-gray-800 w-full">
          <div className="w-full">
          <h1 className="text-4xl font-bold mb-8 text-center leading-relaxed py-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text inline-block">
              Pedagogy Suggestion System
            </span>
          </h1>
            <p className="text-gray-400 text-center mb-8 text-lg">
              Enter a course name to receive effective pedagogy suggestions.
            </p>

            <div className="w-full space-y-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter Course Name"
                  className="w-full px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                           text-gray-200 placeholder-gray-500 transition-all duration-300
                           shadow-inner"
                />
              </div>

              <button
                onClick={handleGenerateSuggestions}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 
                         shadow-lg ${
                  loading 
                    ? "bg-gray-800 cursor-not-allowed text-gray-500" 
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-gray-900 hover:shadow-cyan-900/20"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Get Suggestions"
                )}
              </button>

              {error && (
                <div className="mt-6 bg-red-900/50 border-l-4 border-red-500 text-red-200 px-6 py-4 rounded-lg w-full">
                  {error}
                </div>
              )}

              {renderSuggestions()}
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-600 mt-8 text-sm w-full">
          Developed by Anirudh Hegde, E Harshith, Sk Sai Tarun, Suprith A.S
        </footer>
      </div>
    </div>
  );
};

export default Pedagogy;