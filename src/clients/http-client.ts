/**
 * HTTP client wrapper with error handling and retry logic
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type { HttpClient } from "../interfaces/n8n-client.js";

/**
 * HTTP client implementation with retry logic and error handling
 */
export class N8nHttpClient implements HttpClient {
  private client: AxiosInstance;
  private retryAttempts: number;
  private timeout: number;

  constructor(
    baseURL: string,
    timeout: number = 30000,
    retryAttempts: number = 3,
  ) {
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.debug(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`,
        );
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error),
    );
  }

  /**
   * Handle response errors with retry logic
   */
  private async handleResponseError(error: AxiosError): Promise<never> {
    const config = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };

    if (!config) {
      throw error;
    }

    config._retryCount = config._retryCount || 0;

    // Check if we should retry
    if (config._retryCount < this.retryAttempts && this.shouldRetry(error)) {
      config._retryCount++;

      // Calculate delay with exponential backoff
      const delay = Math.pow(2, config._retryCount) * 1000;

      console.warn(
        `Request failed, retrying in ${delay}ms (attempt ${config._retryCount}/${this.retryAttempts})`,
      );

      await this.sleep(delay);
      return this.client.request(config);
    }

    // Transform error for consistent handling
    throw this.transformError(error);
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    if (!error.response) {
      return true; // Network error
    }

    const status = error.response.status;
    return status >= 500 && status < 600;
  }

  /**
   * Transform Axios error to standardized format
   */
  private transformError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      return new Error(
        `HTTP ${status}: ${(data as any)?.message || error.message}`,
      );
    } else if (error.request) {
      // Network error
      return new Error(`Network error: ${error.message}`);
    } else {
      // Request setup error
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Update base URL
   */
  updateBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  /**
   * Update default headers
   */
  updateHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    };
  }
}
