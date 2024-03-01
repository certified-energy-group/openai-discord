import { ChatCompletion, ChatCompletionMessageParam, Image } from "openai/resources";

export interface AI {
  /**
   * Get the chat completion from the OpenAI API
   * @param chatHistory - Chat history to generate completion from
   */
  chatCompletion(chatHistory: ChatCompletionMessageParam[]): Promise<ChatCompletion.Choice>;
  /**
   * Generate a variable quantity of images from the OpenAI API using DALL-E
   * @param prompt - Prompt to generate images from (e.g. "A photo of a")
   * @param quantity - Quantity of images to generate (e.g. 5) (max 10)
   * @param size - Size of the image (e.g. "512x512") (max "1024x1024")
   */
  createImage(prompt: string, size: ImageSize): Promise<Array<Image>>;
}

export type ImageSize = "1024x1024" | "1792x1024" | "1024x1792" | null;
