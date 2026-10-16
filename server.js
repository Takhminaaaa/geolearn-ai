import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const levelInstructions = {
  foundation: "Foundation: use simple familiar contexts, straightforward values, one main formula, direct hints, and a guided explanation with small steps.",
  standard: "Standard: use grade-level practice, require formula selection and two or more calculation steps when appropriate, with a concise hint.",
  advanced: "Advanced: use a multi-step extension, composite shapes, reverse problems, or a realistic application. The challenge should be harder but mathematically well-defined."
};
const topicInstructions = {
  area: "Focus on area of 2D shapes: rectangle, triangle, parallelogram, circle, or composite shapes.",
  volume: "Focus on volume of 3D solids: rectangular prism, cube, cylinder, or non-overlapping composite solids.",
  mixed: "Choose either area of a 2D shape or volume of a 3D solid, and state the units clearly."
};
const systemPrompt = `You are GeoLearn AI, a careful mathematics tutor specializing in area and volume. Respond only with valid JSON, no Markdown fences. Use correct formulas and verify the arithmetic before answering. Generate original, unambiguous tasks. Never change the chosen difficulty level. When a task asks for an exact expression involving pi, the answer should use a simple form like "25π"; provide a numeric approximation in the solution. JSON schema: {"title":"short title","problem":"complete task statement","answer":"canonical answer as string or number","accepted":["optional alternative answers"],"unit":"unit label","hint":"a helpful hint without giving away everything","solution":"step-by-step worked solution"}. Make sure answer and solution agree exactly. For advanced tasks, prefer one clear expected answer.`;
app.post("/api/tutor", async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the server." });
    const { action, level = "foundation", topic = "mixed", task, userAnswer = "" } = req.body || {};
    if (!["generate", "hint", "solution", "feedback"].includes(action)) return res.status(400).json({ error: "Unknown action." });
    const levelRule = levelInstructions[level] || levelInstructions.foundation;
    const topicRule = topicInstructions[topic] || topicInstructions.mixed;
    let prompt;
    if (action === "generate") {
      prompt = `Create one new task. ${levelRule} ${topicRule} Return the task object matching the schema.`;
    } else {
      if (!task || typeof task.problem !== "string") return res.status(400).json({ error: "A task is required for this action." });
      if (action === "hint") prompt = `Give one tailored hint for this task at the ${level} level. Do not reveal the final answer. Task: ${JSON.stringify(task)} Return JSON {"feedback":"..."}.`;
      if (action === "solution") prompt = `Explain the solution to this task step by step at the ${level} level. Verify arithmetic. Task: ${JSON.stringify(task)} Return JSON {"feedback":"..."}.`;
      if (action === "feedback") prompt = `The student answered "${String(userAnswer).slice(0,150)}". Give kind, specific feedback and one next step. Compare against the correct task answer; do not claim a wrong answer is correct. Task: ${JSON.stringify(task)} Return JSON {"feedback":"..."}.`;
    }
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: action === "generate" ? 0.7 : 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }]
    });
    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    if (action === "generate") {
      if (!parsed.problem || parsed.answer === undefined || !parsed.solution || !parsed.hint) {
        return res.status(502).json({ error: "The AI returned an incomplete task. Please try again." });
      }
      return res.json({ task: parsed });
    }
    return res.json({ feedback: parsed.feedback || "Review the measurements and formula, then try again." });
  } catch (error) {
    console.error("Tutor API error:", error.message);
    return res.status(500).json({ error: "The tutor could not complete the request. Check the server logs and API configuration." });
  }
});
app.get("/api/health", (_req, res) => res.json({ status: "ok", aiConfigured: Boolean(client) }));
app.listen(port, () => console.log(`GeoLearn AI running on http://localhost:${port}`));
