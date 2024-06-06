# Speeko Text-to-Speech (TTS) Converter

This Node.js application converts text from a file into speech using the OpenAI API's Text-to-Speech (TTS) functionality. It allows you to specify the voice and model type for the generated speech.

## Prerequisites
- Node.js installed on your system.
- An OpenAI API key. You can obtain one from the [OpenAI website](https://openai.com).

## Installation
1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running:



## Usage
1. Run the application by executing:

2. Follow the prompts:
- Enter your OpenAI API key.
- Provide the path to the text file you want to convert.
- Select the voice you want to use.
- Choose the model type.
3. After providing the necessary inputs, the application will generate speech from the text file and save it as an audio file in the `Downloads/ai-audios` directory.

## Configuration
- You can change the default directory for saving audio files by modifying the `downloadsDir` variable in the `init()` function of `index.ts`.
- Adjustments to the maximum character limit for each chunk of text can be made by changing the `chunkSize` variable in the `init()` function of `index.ts`.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- This application uses the OpenAI API for text-to-speech conversion. Visit the [OpenAI website](https://openai.com) for more information on their services.
