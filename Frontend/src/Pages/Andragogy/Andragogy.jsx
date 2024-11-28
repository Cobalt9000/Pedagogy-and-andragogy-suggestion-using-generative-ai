import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon } from "lucide-react";

const Andragogy = () => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        subject: "",
        learningStyle: "",
        strengths: "",
        weaknesses: "",
    });

    const [learningPlan, setLearningPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:4000/api/generate-learning-plan", formData);
            setLearningPlan(response.data.learningPlan);
        } catch (error) {
            setError("An error occurred while generating the learning plan.");
            console.error("Error generating learning plan:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderLearningPlan = () => {
        if (!learningPlan) return null;

        const planLines = learningPlan.split('\n').filter(line => line.trim() !== '');

        return (
            <div className="mt-8 bg-gray-950 border-l-4 border-cyan-600 rounded-xl p-8 shadow-2xl w-full">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-gray-800 pb-3">
                    Personalized Learning Plan
                </h2>
                <div className="space-y-4 w-full">
                    {planLines.map((line, index) => (
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
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 w-full">
            <div className="w-full p-4 md:p-8">
                <div className="bg-gray-950 shadow-2xl rounded-2xl p-4 md:p-8 border border-gray-800 w-full">
                <h1 className="text-4xl font-bold mb-8 text-center leading-relaxed py-2">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text inline-block">
                    AI-Powered Learning Plan Generator
                    </span>
                </h1>
                    
                    <p className="text-gray-400 text-center mb-8 text-lg">
                        Create a personalized learning strategy tailored to your needs.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {[
                                { name: "name", label: "Student Name", type: "text", placeholder: "Enter your name" },
                                { name: "age", label: "Age", type: "number", placeholder: "Enter your age" },
                                { name: "subject", label: "Subject", type: "text", placeholder: "Enter the subject" },
                                { 
                                    name: "learningStyle",
                                    label: "Learning Style",
                                    type: "select",
                                    options: ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"]
                                }
                            ].map((field) => (
                                <div key={field.name} className="space-y-2 w-full">
                                    <label className="block text-gray-400 text-sm font-medium">{field.label}</label>
                                    {field.type === "select" ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl
                                                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                                   text-gray-200 transition-all duration-300 shadow-inner"
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl
                                                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                                   text-gray-200 placeholder-gray-500 transition-all duration-300
                                                   shadow-inner"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2 w-full">
                                <label className="block text-gray-400 text-sm font-medium">Strengths</label>
                                <textarea
                                    name="strengths"
                                    value={formData.strengths}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                           text-gray-200 placeholder-gray-500 transition-all duration-300
                                           shadow-inner h-32 resize-none"
                                    placeholder="Your learning strengths"
                                />
                            </div>
                            <div className="space-y-2 w-full">
                                <label className="block text-gray-400 text-sm font-medium">Areas for Improvement</label>
                                <textarea
                                    name="weaknesses"
                                    value={formData.weaknesses}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                           text-gray-200 placeholder-gray-500 transition-all duration-300
                                           shadow-inner h-32 resize-none"
                                    placeholder="Areas you'd like to improve"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
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
                                "Generate Learning Plan"
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 bg-red-900/50 border-l-4 border-red-500 text-red-200 px-6 py-4 rounded-lg w-full">
                            {error}
                        </div>
                    )}

                    {renderLearningPlan()}
                </div>

                <footer className="text-center text-gray-600 mt-8 text-sm w-full">
                    Developed by Anirudh Hegde, E Harshith, Sk Sai Tarun, Suprith A.S
                </footer>
            </div>
        </div>
    );
};

export default Andragogy;