# GeoLearn AI — Web-Based AI Math Differentiator

GeoLearn AI is a responsive geometry practice website for the topic **Area and Volume**. It adapts task complexity and guidance to three learner levels.

## Features
- Foundation, Standard, and Advanced levels
- Topic selection: Area, Volume, or Mixed Geometry
- AI-generated tasks, hints, worked solutions, and feedback
- Demo tasks appear if the AI service is not configured
- Responsive interface for desktop and mobile
- API key is read on the server, never embedded in browser JavaScript

## Requirements
- Node.js 18+
- An API key for the selected OpenAI model, with API access and billing configured

## Run locally
1. Download/clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and put your secret key in `OPENAI_API_KEY`.
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000

Do not commit `.env` or share your API key. If the key is missing, the app uses sample tasks and AI buttons fall back to sample guidance.

## Deploy
Deploy the Node app to a host that supports a Node.js server (for example, Render or Railway). Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the host's environment-variable settings. Use the deployed service URL as the live website link. GitHub Pages alone cannot run `server.js`, so it is not sufficient for this API-backed version.

## AI prompt design
The system prompt sets the tutor role, geometry scope, JSON response format, and requirement to verify arithmetic. A level-specific instruction adapts context, complexity, scaffolding, and explanation. Topic-specific instructions keep generated tasks within area, volume, or mixed geometry. Separate actions request a task, hint, solution, or feedback.

## Verification checklist
- Test every level and each topic.
- Check the generated answer against the worked solution before using a task in a graded setting.
- Test correct, incorrect, and empty answers.
- Confirm that `.env` is excluded from Git.
- Confirm that the deployed API URL works and the key is configured as a server-side environment variable.

## Academic integrity
Use this starter project as a scaffold. Review the code, test the mathematics, and personalize the interface and prompt design so the submitted work reflects your own understanding, as required by the assignment guidelines.
