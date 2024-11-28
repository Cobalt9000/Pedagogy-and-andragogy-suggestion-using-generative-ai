require("dotenv").config();
const { PineconeClient } = require("@pinecone-database/pinecone");
const { pipeline } = require("@huggingface/transformers");
const axios = require("axios");


class RAGSystem {
  constructor() {
    this.pinecone = new PineconeClient(); // Instantiate the Pinecone client
  }

  async initializePinecone() {
    // Asynchronously initialize the Pinecone client
    await this.pinecone.init({
      apiKey: process.env.PINECONE_API_KEY, // Add your Pinecone API key here
      environment: process.env.PINECONE_ENVIRONMENT, // Add your Pinecone environment here
    });

    this.indexName = "pedagogy-suggestion"; // Replace with your actual index name
    this.index = this.pinecone.Index(this.indexName); // Access the index
  }

  async generateSuggestion(courseName) {
    // Embed the query text using Hugging Face Transformers.js
    const query = `${courseName} `;
    const embedder = pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");
    const queryEmbedding = await embedder(query).then((result) => result[0][0]); // Flatten the embeddings

    // Query Pinecone for matches
    const results = await this.index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    // Build context from results
    let context = "";
    results.matches.forEach((match) => {
      const metadata = match.metadata;
      context += `Course: ${metadata["Course Name"]}\n`;
      context += `Pedagogies: ${metadata["Pedagogies used"]}\n`;
      context += `Student Feedback: ${metadata["Student Feedback"]}\n`;
      context += `Marks: ${metadata["Average Student Marks"]}\n\n`;
    });

    const prompt = `Based on the following information about similar courses and topics:

${context}

Suggest effective top 3 pedagogies for teaching the course "${courseName}". 
Provide a detailed explanation of why these pedagogies would be effective.`;

    // Call the Groq API to get suggestions
    const response = await axios.post(
      "https://api.groq.com/v1/completions",
      {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  }
}

export default RAGSystem;
