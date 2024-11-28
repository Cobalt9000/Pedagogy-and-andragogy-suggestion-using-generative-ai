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
            <div className="mt-6 bg-blue-200 border-l-4 border-blue-500 rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">
                    Personalized Learning Plan
                </h2>
                <div className="space-y-3">
                    {planLines.map((line, index) => (
                        <div 
                            key={index} 
                            className="flex items-start text-gray-800 leading-relaxed bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-400 transition-all hover:shadow-md"
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
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            <div className="bg-black-800 shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-cyan-600 mb-6 text-center">
                    AI-Powered Learning Plan Generator
                </h1>
                <p className="text-gray-100 text-center mb-8">
                    Create a personalized learning strategy tailored to your needs.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-300 mb-2">Student Name</label>
                            <input 
                                id="name"
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-gray-300 mb-2">Age</label>
                            <input 
                                id="age"
                                type="number" 
                                name="age" 
                                value={formData.age} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Enter your age"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                            <input 
                                id="subject"
                                type="text" 
                                name="subject" 
                                value={formData.subject} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Enter the subject"
                            />
                        </div>

                        <div>
                            <label htmlFor="learningStyle" className="block text-gray-300 mb-2">Learning Style</label>
                            <select 
                                id="learningStyle"
                                name="learningStyle" 
                                value={formData.learningStyle} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            >
                                <option value="">Select Learning Style</option>
                                <option value="Visual">Visual</option>
                                <option value="Auditory">Auditory</option>
                                <option value="Kinesthetic">Kinesthetic</option>
                                <option value="Reading/Writing">Reading/Writing</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="strengths" className="block text-gray-300 mb-2">Strengths</label>
                            <input 
                                id="strengths"
                                type="text" 
                                name="strengths" 
                                value={formData.strengths} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Your learning strengths"
                            />
                        </div>

                        <div>
                            <label htmlFor="weaknesses" className="block text-gray-300 mb-2">Weaknesses</label>
                            <input 
                                id="weaknesses"
                                type="text" 
                                name="weaknesses" 
                                value={formData.weaknesses} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Areas for improvement"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-md text-white font-semibold transition-all duration-300 ${
                            loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                    >
                        {loading ? "Generating..." : "Generate Learning Plan"}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        {error}
                    </div>
                )}

                {renderLearningPlan()}
            </div>

            <footer className="text-center text-gray-500 mt-8 text-sm">
                Developed by Anirudh Hegde, E Harshith, Sk Sai Tarun, Suprith A.S
            </footer>
        </div>
    );
};

export default Andragogy;