import {
  // ChatCompletionRequestMessage,
  // ChatCompletionResponseMessage,
  // Configuration,
  // CreateImageRequestSizeEnum,
  // ImagesResponse,
  // OpenAIApi,
  ClientOptions,
  OpenAI,
} from "openai";
import process from "process";
import { AI, ImageSize } from "@/models/ai";
import { Runnable } from "@/models/runnable";
import { Logger } from "@/logger";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessage,
  Image,
  CompletionChoice,
  ChatCompletion,
} from "openai/resources";

export class Api implements AI, Runnable {
  /**
   * Logger instance
   * @private
   */
  private readonly _logger: Logger;

  /**
   * OpenAI API instance
   * @private
   */
  private _api!: OpenAI;

  /**
   * OpenAI API configuration
   * @private
   */
  private readonly _configuration: ClientOptions;

  /**
   * Create API instance
   */
  constructor() {
    this._logger = new Logger(Api.name);

    /**
     * Create OpenAI API configuration with API key
     */
    this._configuration = {
      apiKey: process.env.OPENAI_API_KEY,
    };
  }

  /**
   * Initialize OpenAI API service
   */
  run(): void {
    try {
      this._api = new OpenAI(this._configuration); // Create API instance
      this._logger.logService.info("OpenAI Service has been initialized successfully."); // Log service initialization
    } catch (error) {
      this._logger.logService.error(`Failed to start OpenAI Service: ${error}`); // Log service initialization error
      process.exit(1); // Exit process
    }
  }

  /**
   * Get the chat completion from the OpenAI API using GPT-3
   * @param chatHistory - Chat history to generate completion from
   * @returns {ChatCompletionResponseMessage} - Chat completion response object containing the completion
   */
  async chatCompletion(chatHistory: ChatCompletionMessageParam[]): Promise<ChatCompletion.Choice> {
    /**
     * Create chat completion request and return response or throw error
     */
    try {
      const { choices } = await this._api.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: chatHistory,
      });

      if (choices.length === 0) {
        throw new Error("No completion choice returned");
      }

      return choices[0];
    } catch (error) {
      this._logger.logService.error(`Failed to get chat completion: ${(<Error>error).message}`); // Request failed
      throw error;
    }
  }

  /**
   * Generate a variable quantity of images from the OpenAI API using DALL-E
   * @param prompt - Text to generate images from (e.g. "A cute dog")
   * @param quantity - Number of images to generate (e.g. 5) (max 10) (default 1)
   * @param size - Size of the image (e.g. "512x512") (max "1024x1024")
   * @returns {ImagesResponse} - Images response object containing the image URLs
   */
  async createImage(prompt: string, size: ImageSize = "1024x1024"): Promise<Array<Image>> {
    /**
     * Create image request and return response or throw error
     */
    try {
      const { data } = await this._api.images.generate({
        model: "dall-e-3",
        quality: "hd",
        prompt: prompt,
        size: size,
      });

      return data;
    } catch (error) {
      this._logger.logService.error(`Failed to get image ${(<Error>error).message}`); // Request failed
      throw error;
    }
  }
}
