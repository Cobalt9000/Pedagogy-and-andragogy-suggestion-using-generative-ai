import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Suggestion from '../models/suggestion.model.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const getPythonCommand = () => {
  return process.platform === 'win32' 
    ? ['python', 'py']
    : ['python3', 'python'];
};

const generateSuggestionFromPython = async (courseName) => {
  const pythonCommands = getPythonCommand();
  let lastError = '';

  for (const cmd of pythonCommands) {
    try {
      logger.info(`Executing Python with command: ${cmd}`);
      
      const result = await new Promise((resolve, reject) => {
        const ragScriptPath = path.join(__dirname, '..', 'rag_system.py');
        const pythonProcess = spawn(cmd, [ragScriptPath, courseName], {
          stdio: 'pipe',
          shell: process.platform === 'win32' // Only use shell on Windows
        });

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(error || `Process exited with code ${code}`));
          } else {
            resolve(result.trim());
          }
        });

        // Add error handler
        pythonProcess.on('error', (err) => {
          reject(new Error(`Failed to start process: ${err.message}`));
        });

        // Add timeout
        const timeout = setTimeout(() => {
          pythonProcess.kill();
          reject(new Error('Process timed out'));
        }, 30000);

        // Clear timeout on process end
        pythonProcess.on('close', () => clearTimeout(timeout));
      });

      if (!result) {
        throw new Error('No suggestions generated');
      }

      return result;

    } catch (error) {
      lastError = error.message;
      logger.warn(`Failed to execute with ${cmd}`, { error: error.message });
      continue;
    }
  }

  throw new Error(`Failed to execute Python script. Last error: ${lastError}`);
};

router.post('/get-suggestions', async (req, res) => {
  const { course_name } = req.body;
  
  if (!course_name?.trim()) {
    return res.status(400).json({ error: 'Course name is required' });
  }
  
  try {
    const suggestions = await generateSuggestionFromPython(course_name);
    
    const newSuggestion = new Suggestion({
      courseName: course_name,
      suggestions: suggestions
    });

    await newSuggestion.save();
    logger.info('Generated and saved suggestions', { course_name });
    
    return res.json({ suggestions });
  } catch (error) {
    logger.error('Error generating suggestions', { 
      course_name, 
      error: error.message 
    });
    return res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error.message 
    });
  }
});

router.get('/suggestions-history', async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
    return res.json(suggestions);
  } catch (error) {
    logger.error('Error fetching history', { error: error.message });
    return res.status(500).json({ error: 'Failed to fetch suggestions history' });
  }
});

export default router;