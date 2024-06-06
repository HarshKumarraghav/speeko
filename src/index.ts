import os from "os";
import fs from "node:fs";
import OpenAI from "openai";
import path from "node:path";
import prompts from "prompts";
import { red, bgGreen } from "kolorist";

// Define the union type for voices
type Voice = "alloy" | "echo" | "fable" | "nova" | "shimmer" | "onyx";

async function init() {
  let OPEN_AI_KEY: string = "";
  let TEXT_FILE_PATH: string = "";
  let VOICE_CHOICE: Voice = "alloy"; // Set default value
  let MODEL_CHOICE: string = "";

  const response = await prompts([
    {
      type: "text",
      name: "apiKey",
      message: bgGreen("Enter your OpenAI API key"),
      validate: (value) => value ? true : red("Please enter a valid API key")
    },
    {
      type: "text",
      name: "textFilePath",
      message: bgGreen("Enter the path to the text file"),
      validate: (value) => fs.existsSync(value) ? true : red("Please enter a valid file path")
    },
    {
      type: "select",
      name: "voice",
      message: bgGreen("Select the voice you want to use"),
      choices: [
        { title: "Alloy", value: "alloy" },
        { title: "Echo", value: "echo" },
        { title: "Fable", value: "fable" },
        { title: "Nova", value: "nova" },
        { title: "Shimmer", value: "shimmer" },
        { title: "Onyx", value: "onyx" }
      ],
      initial: 0
    },
    {
      type: "select",
      name: "model",
      message: bgGreen("Select the model type"),
      choices: [
        { title: "TTS 1", value: "tts-1" },
        { title: "TTS 1 HD", value: "tts-1-hd" }
      ],
      initial: 0
    }
  ]);

  OPEN_AI_KEY = response.apiKey;
  TEXT_FILE_PATH = response.textFilePath;
  VOICE_CHOICE = response.voice as Voice;
  MODEL_CHOICE = response.model;

  const openai = new OpenAI({
    apiKey: OPEN_AI_KEY
  });

  let TEXT_INPUT: string = "";

  try {
    TEXT_INPUT = fs.readFileSync(TEXT_FILE_PATH, 'utf8');
    console.log("File content successfully read");
  } catch (error) {
    console.error("Error reading file:", error);
    return;
  }

  const downloadsDir = path.join(os.homedir(), 'Downloads', 'ai-audios');

  // Ensure the directory exists
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const speechFileName = `speech-${timestamp}.mp3`;
  const speechFilePath = path.join(downloadsDir, speechFileName);

  const chunkSize = 4096;
  const chunks: string[] = [];
  for (let i = 0; i < TEXT_INPUT.length; i += chunkSize) {
    chunks.push(TEXT_INPUT.substr(i, chunkSize));
  }

  const audioBuffers: Buffer[] = [];

  try {
    for (let i = 0; i < chunks.length; i++) {
      const audioResponse = await openai.audio.speech.create({
        model: MODEL_CHOICE,
        voice: VOICE_CHOICE,
        input: chunks[i],
      });

      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      audioBuffers.push(buffer);
    }

    const concatenatedBuffer = Buffer.concat(audioBuffers);
    await fs.promises.writeFile(speechFilePath, concatenatedBuffer);

    console.log("Audio file saved as", speechFilePath);

  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

init();
