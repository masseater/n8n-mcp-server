/**
 * Custom Errors Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  ApiError,
  NotFoundError,
  AuthenticationError,
  FileError,
} from './custom-errors.js';

describe('custom-errors', () => {
  describe('ValidationError', () => {
    it('should create error with message', () => {
      const error = new ValidationError('Invalid input');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Invalid input');
    });

    it('should store context', () => {
      const context = { field: 'name', value: '' };
      const error = new ValidationError('Field is required', context);

      expect(error.context).toEqual(context);
    });

    it('should support error chaining', () => {
      const originalError = new Error('Original error');
      const error = new ValidationError('Validation failed', undefined, {
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });

    it('should have stack trace', () => {
      const error = new ValidationError('Test error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ValidationError');
    });
  });

  describe('ApiError', () => {
    it('should create error with status code', () => {
      const error = new ApiError('API request failed', 500);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('API request failed');
      expect(error.statusCode).toBe(500);
    });

    it('should work without status code', () => {
      const error = new ApiError('API request failed');

      expect(error.statusCode).toBeUndefined();
    });

    it('should store context', () => {
      const context = { endpoint: '/api/workflows', method: 'GET' };
      const error = new ApiError('Request failed', 404, context);

      expect(error.context).toEqual(context);
    });

    it('should support error chaining', () => {
      const originalError = new Error('Network error');
      const error = new ApiError('API failed', 500, undefined, {
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });

    it('should preserve all properties', () => {
      const context = { url: 'https://api.example.com' };
      const originalError = new Error('Timeout');
      const error = new ApiError('Request timeout', 408, context, {
        cause: originalError,
      });

      expect(error.message).toBe('Request timeout');
      expect(error.statusCode).toBe(408);
      expect(error.context).toEqual(context);
      expect(error.cause).toBe(originalError);
    });
  });

  describe('NotFoundError', () => {
    it('should create error with message', () => {
      const error = new NotFoundError('Resource not found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Resource not found');
    });

    it('should store context', () => {
      const context = { resourceType: 'Workflow', resourceId: 'wf-123' };
      const error = new NotFoundError('Workflow not found', context);

      expect(error.context).toEqual(context);
    });

    it('should support error chaining', () => {
      const originalError = new Error('Database error');
      const error = new NotFoundError('Not found', undefined, {
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });
  });

  describe('AuthenticationError', () => {
    it('should create error with message', () => {
      const error = new AuthenticationError('Invalid credentials');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Invalid credentials');
    });

    it('should store context', () => {
      const context = { username: 'user@example.com', attemptCount: 3 };
      const error = new AuthenticationError('Login failed', context);

      expect(error.context).toEqual(context);
    });

    it('should support error chaining', () => {
      const originalError = new Error('Token expired');
      const error = new AuthenticationError('Auth failed', undefined, {
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });
  });

  describe('FileError', () => {
    it('should create error with file path', () => {
      const filePath = '/path/to/file.json';
      const error = new FileError('File not found', filePath);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FileError);
      expect(error.name).toBe('FileError');
      expect(error.message).toBe('File not found');
      expect(error.filePath).toBe(filePath);
    });

    it('should work without file path', () => {
      const error = new FileError('File operation failed');

      expect(error.filePath).toBeUndefined();
    });

    it('should store context', () => {
      const context = { operation: 'read', encoding: 'utf-8' };
      const error = new FileError('Read failed', '/file.txt', context);

      expect(error.context).toEqual(context);
    });

    it('should support error chaining', () => {
      const originalError = new Error('ENOENT');
      const error = new FileError('File not found', '/missing.txt', undefined, {
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });

    it('should preserve all properties', () => {
      const filePath = '/data/workflow.json';
      const context = { size: 1024, mode: 'read' };
      const originalError = new Error('Permission denied');
      const error = new FileError('Cannot read file', filePath, context, {
        cause: originalError,
      });

      expect(error.message).toBe('Cannot read file');
      expect(error.filePath).toBe(filePath);
      expect(error.context).toEqual(context);
      expect(error.cause).toBe(originalError);
    });
  });

  describe('Error inheritance', () => {
    it('should be catchable as generic Error', () => {
      const errors = [
        new ValidationError('validation'),
        new ApiError('api', 500),
        new NotFoundError('not found'),
        new AuthenticationError('auth'),
        new FileError('file', '/path'),
      ];

      for (const error of errors) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should have correct instanceof checks', () => {
      const validationError = new ValidationError('test');
      const apiError = new ApiError('test', 500);

      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError).not.toBeInstanceOf(ApiError);
      expect(apiError).toBeInstanceOf(ApiError);
      expect(apiError).not.toBeInstanceOf(ValidationError);
    });
  });
});
