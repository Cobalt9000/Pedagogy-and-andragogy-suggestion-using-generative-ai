import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// API Route
app.post("/api/generate-learning-plan", async (req, res) => {
    const { name, age, subject, learningStyle, strengths, weaknesses } = req.body;

    const prompt = `
    Create a personalized learning plan for a student with the following details:
    Name: ${name}
    Age: ${age}
    Subject: ${subject}
    Learning Style: ${learningStyle}
    Strengths: ${strengths}
    Weaknesses: ${weaknesses}
    The learning plan should include:
    1. Recommended teaching methods
    2. Youtube Channels (around 3) that are popular for teaching this subject
    3. Suggested resources
    4. Personalized learning goals with a plan and roadmap in weeks
    5. Strategies to address weaknesses
    6. Ways to leverage strengths
    `;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                messages: [{ role: "user", content: prompt }],
                model: "mixtral-8x7b-32768",
                temperature: 0.7,
                max_tokens: 2000,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        

        res.json({ learningPlan: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating learning plan:", error.message);
        res.status(500).json({ error: "Failed to generate learning plan." });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
