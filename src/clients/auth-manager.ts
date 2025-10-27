/**
 * Authentication manager for n8n API
 */

import type { AuthCredentials } from "../types/index.js";

/**
 * Authentication manager implementation
 */
export class AuthManager {
  private credentials: AuthCredentials | null = null;
  private isAuthValid = false;

  /**
   * Validate authentication credentials
   */
  validateCredentials(credentials: AuthCredentials): boolean {
    if (!credentials.baseUrl) {
      return false;
    }

    // Must have API key
    return Boolean(credentials.apiKey);
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders(credentials: AuthCredentials): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (credentials.apiKey) {
      headers["X-N8N-API-KEY"] = credentials.apiKey;
    }

    return headers;
  }

  /**
   * Check if currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthValid && this.credentials !== null;
  }

  /**
   * Set credentials and validate
   */
  setCredentials(credentials: AuthCredentials): boolean {
    if (!this.validateCredentials(credentials)) {
      return false;
    }

    this.credentials = credentials;
    this.isAuthValid = true;
    return true;
  }

  /**
   * Get current credentials
   */
  getCredentials(): AuthCredentials | null {
    return this.credentials;
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.credentials = null;
    this.isAuthValid = false;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest;

  describe("AuthManager", () => {
    let authManager: AuthManager;

    beforeEach(() => {
      authManager = new AuthManager();
    });

    describe("validateCredentials", () => {
      it("should validate credentials with baseUrl and apiKey", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        expect(authManager.validateCredentials(credentials)).toBe(true);
      });

      it("should reject credentials without baseUrl", () => {
        const credentials = {
          baseUrl: "",
          apiKey: "test-api-key",
        };

        expect(authManager.validateCredentials(credentials)).toBe(false);
      });

      it("should reject credentials without apiKey", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "",
        };

        expect(authManager.validateCredentials(credentials)).toBe(false);
      });

      it("should reject credentials with undefined apiKey", () => {
        const credentials: AuthCredentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "",
        };

        expect(authManager.validateCredentials(credentials)).toBe(false);
      });
    });

    describe("getAuthHeaders", () => {
      it("should return headers with API key", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        const headers = authManager.getAuthHeaders(credentials);

        expect(headers).toEqual({
          "Content-Type": "application/json",
          "X-N8N-API-KEY": "test-api-key",
        });
      });

      it("should return only Content-Type header when apiKey is missing", () => {
        const credentials: AuthCredentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "",
        };

        const headers = authManager.getAuthHeaders(credentials);

        expect(headers).toEqual({
          "Content-Type": "application/json",
        });
      });
    });

    describe("isAuthenticated", () => {
      it("should return false initially", () => {
        expect(authManager.isAuthenticated()).toBe(false);
      });

      it("should return true after setting valid credentials", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);

        expect(authManager.isAuthenticated()).toBe(true);
      });

      it("should return false after setting invalid credentials", () => {
        const credentials = {
          baseUrl: "",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);

        expect(authManager.isAuthenticated()).toBe(false);
      });

      it("should return false after clearing auth", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);
        expect(authManager.isAuthenticated()).toBe(true);

        authManager.clearAuth();
        expect(authManager.isAuthenticated()).toBe(false);
      });
    });

    describe("setCredentials", () => {
      it("should set valid credentials successfully", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        const result = authManager.setCredentials(credentials);

        expect(result).toBe(true);
        // @ts-expect-error - private member access for testing
        expect(authManager.credentials).toEqual(credentials);
        // @ts-expect-error - private member access for testing
        expect(authManager.isAuthValid).toBe(true);
      });

      it("should reject invalid credentials", () => {
        const credentials = {
          baseUrl: "",
          apiKey: "test-api-key",
        };

        const result = authManager.setCredentials(credentials);

        expect(result).toBe(false);
        // @ts-expect-error - private member access for testing
        expect(authManager.credentials).toBeNull();
        // @ts-expect-error - private member access for testing
        expect(authManager.isAuthValid).toBe(false);
      });

      it("should overwrite previous credentials", () => {
        const credentials1 = {
          baseUrl: "http://localhost:5678",
          apiKey: "api-key-1",
        };

        const credentials2 = {
          baseUrl: "http://localhost:8080",
          apiKey: "api-key-2",
        };

        authManager.setCredentials(credentials1);
        authManager.setCredentials(credentials2);

        // @ts-expect-error - private member access for testing
        expect(authManager.credentials).toEqual(credentials2);
      });
    });

    describe("getCredentials", () => {
      it("should return null initially", () => {
        expect(authManager.getCredentials()).toBeNull();
      });

      it("should return credentials after setting them", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);

        expect(authManager.getCredentials()).toEqual(credentials);
      });

      it("should return null after clearing auth", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);
        authManager.clearAuth();

        expect(authManager.getCredentials()).toBeNull();
      });
    });

    describe("clearAuth", () => {
      it("should clear all authentication state", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        authManager.setCredentials(credentials);

        // Verify credentials are set
        expect(authManager.isAuthenticated()).toBe(true);
        expect(authManager.getCredentials()).not.toBeNull();

        // Clear auth
        authManager.clearAuth();

        // Verify everything is cleared
        expect(authManager.isAuthenticated()).toBe(false);
        expect(authManager.getCredentials()).toBeNull();
        // @ts-expect-error - private member access for testing
        expect(authManager.credentials).toBeNull();
        // @ts-expect-error - private member access for testing
        expect(authManager.isAuthValid).toBe(false);
      });

      it("should be idempotent", () => {
        // Clear multiple times should not cause issues
        authManager.clearAuth();
        authManager.clearAuth();

        expect(authManager.isAuthenticated()).toBe(false);
        expect(authManager.getCredentials()).toBeNull();
      });
    });

    describe("integration scenarios", () => {
      it("should handle full authentication flow", () => {
        const credentials = {
          baseUrl: "http://localhost:5678",
          apiKey: "test-api-key",
        };

        // Initial state
        expect(authManager.isAuthenticated()).toBe(false);

        // Validate credentials
        expect(authManager.validateCredentials(credentials)).toBe(true);

        // Set credentials
        expect(authManager.setCredentials(credentials)).toBe(true);

        // Check authenticated
        expect(authManager.isAuthenticated()).toBe(true);

        // Get headers
        const headers = authManager.getAuthHeaders(credentials);
        expect(headers["X-N8N-API-KEY"]).toBe("test-api-key");

        // Clear auth
        authManager.clearAuth();
        expect(authManager.isAuthenticated()).toBe(false);
      });

      it("should handle failed authentication flow", () => {
        const invalidCredentials = {
          baseUrl: "",
          apiKey: "test-api-key",
        };

        // Validate should fail
        expect(authManager.validateCredentials(invalidCredentials)).toBe(false);

        // Set credentials should fail
        expect(authManager.setCredentials(invalidCredentials)).toBe(false);

        // Should not be authenticated
        expect(authManager.isAuthenticated()).toBe(false);
        expect(authManager.getCredentials()).toBeNull();
      });
    });
  });
}
