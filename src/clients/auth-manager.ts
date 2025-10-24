/**
 * Authentication manager for n8n API
 */

import type { AuthCredentials } from "../types/index.js";

/**
 * Authentication manager implementation
 */
export class AuthManager {
  private credentials: AuthCredentials | null = null;
  private isAuthValid: boolean = false;

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
