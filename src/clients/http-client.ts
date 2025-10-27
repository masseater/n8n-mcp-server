/**
 * HTTP client wrapper with error handling and retry logic
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

/**
 * HTTP client implementation with retry logic and error handling
 */
export class N8nHttpClient {
  private client: AxiosInstance;
  private retryAttempts: number;

  constructor(
    baseURL: string,
    timeout = 30000,
    retryAttempts = 3,
  ) {
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
        const method = config.method?.toUpperCase() ?? "UNKNOWN";
        const url = config.url ?? "UNKNOWN";
        console.debug(`Making ${method} request to ${url}`);
        return config;
      },
      (error: unknown) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      },
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => this.handleResponseError(error as AxiosError),
    );
  }

  /**
   * Handle response errors with retry logic
   */
  private async handleResponseError(error: AxiosError): Promise<never> {
    const config = error.config as (AxiosRequestConfig & {
      _retryCount?: number;
    }) | undefined;

    if (!config) {
      throw this.transformError(error);
    }

    config._retryCount = config._retryCount ?? 0;

    // Check if we should retry
    if (config._retryCount < this.retryAttempts && this.shouldRetry(error)) {
      config._retryCount++;

      // Calculate delay with exponential backoff
      const delay = Math.pow(2, config._retryCount) * 1000;

      console.warn(
        `Request failed, retrying in ${String(delay)}ms (attempt ${String(config._retryCount)}/${String(this.retryAttempts)})`,
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
      const data = error.response.data as { message?: string } | undefined;

      return new Error(
        `HTTP ${String(status)}: ${data?.message ?? error.message}`,
      );
    } else if (error.request) {
      // Network error
      return new Error(`Network error: ${error.message}`);
    } else if (error.message === "Network Error") {
      // Special case for mock adapter network error
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
    data?: unknown,
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
    data?: unknown,
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
    data?: unknown,
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

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi, afterEach } = import.meta.vitest;
  const MockAdapter = (await import("axios-mock-adapter")).default;
  type MockAdapterInstance = InstanceType<typeof MockAdapter>;

  describe("N8nHttpClient", () => {
    let client: N8nHttpClient;
    let mockAxios: MockAdapterInstance;
    const baseURL = "http://localhost:5678";

    beforeEach(() => {
      client = new N8nHttpClient(baseURL, 1000, 3);
      // @ts-expect-error - private member access for testing
      mockAxios = new MockAdapter(client.client);
      vi.spyOn(console, "debug").mockImplementation(() => undefined);
      vi.spyOn(console, "warn").mockImplementation(() => undefined);
      vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
      mockAxios.restore();
      vi.restoreAllMocks();
    });

    describe("constructor", () => {
      it("should create client with default timeout", () => {
        const defaultClient = new N8nHttpClient(baseURL);
        // @ts-expect-error - private member access
        expect(defaultClient.client.defaults.timeout).toBe(30000);
      });

      it("should create client with custom timeout and retry attempts", () => {
        const customClient = new N8nHttpClient(baseURL, 5000, 5);
        // @ts-expect-error - private member access
        expect(customClient.client.defaults.timeout).toBe(5000);
        // @ts-expect-error - private member access
        expect(customClient.retryAttempts).toBe(5);
      });

      it("should set correct default headers", () => {
        // @ts-expect-error - private member access
        expect(client.client.defaults.headers["Content-Type"]).toBe("application/json");
      });
    });

    describe("GET request", () => {
      it("should make successful GET request", async () => {
        const responseData = { id: 1, name: "test" };
        mockAxios.onGet("/api/test").reply(200, responseData);

        const result = await client.get("/api/test");
        expect(result).toEqual(responseData);
      });

      it("should handle GET request with config", async () => {
        const responseData = { items: [] };
        mockAxios.onGet("/api/test", { params: { page: 1 } }).reply(200, responseData);

        const result = await client.get("/api/test", { params: { page: 1 } });
        expect(result).toEqual(responseData);
      });
    });

    describe("POST request", () => {
      it("should make successful POST request", async () => {
        const requestData = { name: "test" };
        const responseData = { id: 1, ...requestData };
        mockAxios.onPost("/api/test", requestData).reply(201, responseData);

        const result = await client.post("/api/test", requestData);
        expect(result).toEqual(responseData);
      });

      it("should handle POST request without data", async () => {
        const responseData = { success: true };
        mockAxios.onPost("/api/test").reply(200, responseData);

        const result = await client.post("/api/test");
        expect(result).toEqual(responseData);
      });
    });

    describe("PUT request", () => {
      it("should make successful PUT request", async () => {
        const requestData = { name: "updated" };
        const responseData = { id: 1, ...requestData };
        mockAxios.onPut("/api/test/1", requestData).reply(200, responseData);

        const result = await client.put("/api/test/1", requestData);
        expect(result).toEqual(responseData);
      });
    });

    describe("DELETE request", () => {
      it("should make successful DELETE request", async () => {
        mockAxios.onDelete("/api/test/1").reply(204);

        const result = await client.delete("/api/test/1");
        expect(result).toBeUndefined();
      });

      it("should handle DELETE with response data", async () => {
        const responseData = { deleted: true };
        mockAxios.onDelete("/api/test/1").reply(200, responseData);

        const result = await client.delete("/api/test/1");
        expect(result).toEqual(responseData);
      });
    });

    describe("PATCH request", () => {
      it("should make successful PATCH request", async () => {
        const requestData = { status: "active" };
        const responseData = { id: 1, ...requestData };
        mockAxios.onPatch("/api/test/1", requestData).reply(200, responseData);

        const result = await client.patch("/api/test/1", requestData);
        expect(result).toEqual(responseData);
      });
    });

    describe("retry logic", () => {
      it("should retry on 5xx errors", async () => {
        let attempts = 0;
        mockAxios.onGet("/api/test").reply(() => {
          attempts++;
          if (attempts < 3) {
            return [500, { message: "Server error" }];
          }
          return [200, { success: true }];
        });

        // @ts-expect-error - private member access
        vi.spyOn(client, "sleep").mockImplementation(() => Promise.resolve());

        const result = await client.get("/api/test");
        expect(result).toEqual({ success: true });
        expect(attempts).toBe(3);
      });

      it("should retry on network errors", async () => {
        let attempts = 0;

        // First call fails with network error
        mockAxios.onGet("/api/test").networkErrorOnce();

        // Second call succeeds
        mockAxios.onGet("/api/test").replyOnce(() => {
          attempts++;
          return [200, { success: true }];
        });

        // @ts-expect-error - private member access
        vi.spyOn(client, "sleep").mockImplementation(() => Promise.resolve());

        const result = await client.get("/api/test");
        expect(result).toEqual({ success: true });
        expect(attempts).toBe(1);  // Only the successful attempt is counted
      });

      it("should not retry on 4xx errors", async () => {
        mockAxios.onGet("/api/test").reply(404, { message: "Not found" });

        await expect(client.get("/api/test")).rejects.toThrow("HTTP 404");
      });

      it("should fail after max retry attempts", async () => {
        mockAxios.onGet("/api/test").reply(500, { message: "Server error" });

        // @ts-expect-error - private member access
        vi.spyOn(client, "sleep").mockImplementation(() => Promise.resolve());

        await expect(client.get("/api/test")).rejects.toThrow("HTTP 500");
      });

      it("should use exponential backoff for retries", async () => {
        const sleepSpy = vi.fn().mockResolvedValue(undefined);
        // @ts-expect-error - private member access
        client.sleep = sleepSpy;

        mockAxios.onGet("/api/test").reply(500);

        try {
          await client.get("/api/test");
        } catch {
          // Expected to fail
        }

        // Check exponential backoff delays: 2^1 * 1000, 2^2 * 1000, 2^3 * 1000
        expect(sleepSpy).toHaveBeenCalledTimes(3);
        expect(sleepSpy).toHaveBeenNthCalledWith(1, 2000);
        expect(sleepSpy).toHaveBeenNthCalledWith(2, 4000);
        expect(sleepSpy).toHaveBeenNthCalledWith(3, 8000);
      });
    });

    describe("error handling", () => {
      it("should transform server error with custom message", async () => {
        mockAxios.onGet("/api/test").reply(400, { message: "Bad request" });

        await expect(client.get("/api/test")).rejects.toThrow("HTTP 400: Bad request");
      });

      it("should transform server error without message", async () => {
        mockAxios.onGet("/api/test").reply(401);

        await expect(client.get("/api/test")).rejects.toThrow("HTTP 401");
      });

      it("should handle network errors", async () => {
        mockAxios.onGet("/api/test").networkError();

        // @ts-expect-error - private member access
        vi.spyOn(client, "sleep").mockImplementation(() => Promise.resolve(undefined));

        await expect(client.get("/api/test")).rejects.toThrow("Network error");
      });

      it("should handle request setup errors", async () => {
        mockAxios.onGet("/api/test").reply(() => {
          throw new Error("Invalid config");
        });

        await expect(client.get("/api/test")).rejects.toThrow();
      });
    });

    describe("updateBaseURL", () => {
      it("should update base URL", () => {
        const newBaseURL = "http://localhost:8080";
        client.updateBaseURL(newBaseURL);

        // @ts-expect-error - private member access
        expect(client.client.defaults.baseURL).toBe(newBaseURL);
      });
    });

    describe("updateHeaders", () => {
      it("should update headers while preserving defaults", () => {
        const newHeaders = { "X-Custom-Header": "value" };
        client.updateHeaders(newHeaders);

        // @ts-expect-error - private member access
        const headers = client.client.defaults.headers;
        expect(headers["Content-Type"]).toBe("application/json");
        expect(headers["X-Custom-Header"]).toBe("value");
      });

      it("should override existing headers", () => {
        const headers1 = { "X-Header": "value1" };
        const headers2 = { "X-Header": "value2" };

        client.updateHeaders(headers1);
        client.updateHeaders(headers2);

        // @ts-expect-error - private member access
        expect(client.client.defaults.headers["X-Header"]).toBe("value2");
      });
    });

    describe("interceptors", () => {
      it("should log request details", async () => {
        const debugSpy = vi.spyOn(console, "debug");
        mockAxios.onGet("/api/test").reply(200, {});

        await client.get("/api/test");

        expect(debugSpy).toHaveBeenCalledWith(
          expect.stringContaining("Making GET request to /api/test")
        );
      });

      it("should log request interceptor errors", async () => {
        const errorSpy = vi.spyOn(console, "error");

        // Create a mock for axios.create to control the interceptor behavior
        const originalCreate = axios.create.bind(axios);
        type ErrorHandler = ((error: unknown) => unknown) | null;
        const mockInterceptors = {
          request: {
            use: vi.fn((_fulfilled, rejected) => {
              // Store the rejection handler
              mockInterceptors.request.errorHandler = rejected as ErrorHandler;
              return 0;
            }),
            errorHandler: null as ErrorHandler
          },
          response: {
            use: vi.fn()
          }
        };

        // Mock axios.create temporarily
        const axiosWithMock = axios as typeof axios & { create: ReturnType<typeof vi.fn> };
        axiosWithMock.create = vi.fn().mockReturnValue({
          ...originalCreate({
            baseURL,
            timeout: 1000
          }),
          interceptors: mockInterceptors
        });

        // Create client which will use our mocked interceptors
        new N8nHttpClient(baseURL, 1000, 3);  // Client is created just to trigger interceptor setup

        // Trigger the error handler with an error and await the rejected promise
        const testError = new Error("Interceptor error");
        if (mockInterceptors.request.errorHandler) {
          try {
            await mockInterceptors.request.errorHandler(testError);
          } catch {
            // Expected to throw
          }
        }

        expect(errorSpy).toHaveBeenCalledWith(
          "Request interceptor error:",
          testError
        );

        // Restore original axios.create
        Object.assign(axios, { create: originalCreate });
      });
    });
  });
}
