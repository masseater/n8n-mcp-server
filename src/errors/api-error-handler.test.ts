/**
 * API Error Handler Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  handleResponse,
  validateRequired,
  wrapAsync,
} from './api-error-handler.js';
import { ApiError, NotFoundError, ValidationError } from './custom-errors.js';

describe('api-error-handler', () => {
  describe('handleResponse', () => {
    it('should return data when response is successful', () => {
      const response = {
        data: { id: '123', name: 'Test' },
      };

      const result = handleResponse(response, {
        operation: 'test operation',
        resourceType: 'TestResource',
      });

      expect(result).toEqual({ id: '123', name: 'Test' });
    });

    it('should throw NotFoundError when data is undefined', () => {
      const response = {
        data: undefined,
      };

      expect(() => {
        handleResponse(response, {
          operation: 'get resource',
          resourceType: 'TestResource',
          resourceId: '123',
        });
      }).toThrow(NotFoundError);
    });

    it('should throw NotFoundError for 404 status', () => {
      const response = {
        error: { status: 404, message: 'Not found' },
      };

      expect(() => {
        handleResponse(response, {
          operation: 'get resource',
          resourceType: 'TestResource',
          resourceId: '123',
        });
      }).toThrow(NotFoundError);
    });

    it('should throw ApiError for 500 status', () => {
      const response = {
        error: { status: 500, message: 'Internal server error' },
      };

      expect(() => {
        handleResponse(response, {
          operation: 'get resource',
          resourceType: 'TestResource',
        });
      }).toThrow(ApiError);
    });

    it('should throw ApiError with status code', () => {
      const response = {
        error: { status: 403, message: 'Forbidden' },
      };

      try {
        handleResponse(response, {
          operation: 'get resource',
          resourceType: 'TestResource',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(403);
      }
    });

    it('should include context in NotFoundError', () => {
      const response = {
        data: undefined,
      };

      try {
        handleResponse(response, {
          operation: 'get workflow',
          resourceType: 'Workflow',
          resourceId: 'wf-123',
          additionalInfo: { userId: 'user-1' },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).context).toEqual({
          operation: 'get workflow',
          resourceType: 'Workflow',
          resourceId: 'wf-123',
          userId: 'user-1',
        });
      }
    });

    it('should handle error without status', () => {
      const response = {
        error: { message: 'Unknown error' },
      };

      expect(() => {
        handleResponse(response, {
          operation: 'test operation',
        });
      }).toThrow(ApiError);
    });

    it('should handle error without message', () => {
      const response = {
        error: { status: 400 },
      };

      expect(() => {
        handleResponse(response, {
          operation: 'test operation',
        });
      }).toThrow(ApiError);
    });

    it('should handle non-object error', () => {
      const response = {
        error: 'string error',
      };

      expect(() => {
        handleResponse(response, {
          operation: 'test operation',
        });
      }).toThrow(ApiError);
    });
  });

  describe('validateRequired', () => {
    it('should not throw when value is provided', () => {
      expect(() => {
        validateRequired('test', 'Test Field');
      }).not.toThrow();
    });

    it('should throw ValidationError when value is null', () => {
      expect(() => {
        validateRequired(null, 'Test Field');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError when value is undefined', () => {
      expect(() => {
        validateRequired(undefined, 'Test Field');
      }).toThrow(ValidationError);
    });

    it('should accept empty string as valid value', () => {
      expect(() => {
        validateRequired('', 'Test Field');
      }).not.toThrow();
    });

    it('should include field name in error message', () => {
      try {
        validateRequired(null, 'Workflow ID');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe('Workflow ID is required');
      }
    });

    it('should include context in error', () => {
      try {
        validateRequired(null, 'API Key', { userId: 'user-1' });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).context).toEqual({ userId: 'user-1' });
      }
    });

    it('should accept 0 as valid value', () => {
      expect(() => {
        validateRequired(0, 'Number Field');
      }).not.toThrow();
    });

    it('should accept false as valid value', () => {
      expect(() => {
        validateRequired(false, 'Boolean Field');
      }).not.toThrow();
    });
  });

  describe('wrapAsync', () => {
    it('should return result when operation succeeds', async () => {
      const operation = () => Promise.resolve({ id: '123', name: 'Test' });

      const result = await wrapAsync(operation, {
        operation: 'test operation',
      });

      expect(result).toEqual({ id: '123', name: 'Test' });
    });

    it('should re-throw ValidationError without wrapping', async () => {
      const operation = () => Promise.reject(new ValidationError('Invalid input'));

      await expect(
        wrapAsync(operation, { operation: 'test operation' })
      ).rejects.toThrow(ValidationError);
    });

    it('should re-throw NotFoundError without wrapping', async () => {
      const operation = () => Promise.reject(new NotFoundError('Resource not found'));

      await expect(
        wrapAsync(operation, { operation: 'test operation' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should re-throw ApiError without wrapping', async () => {
      const operation = () => Promise.reject(new ApiError('API failed', 500));

      await expect(
        wrapAsync(operation, { operation: 'test operation' })
      ).rejects.toThrow(ApiError);
    });

    it('should wrap generic Error as ApiError', async () => {
      const originalError = new Error('Generic error');
      const operation = () => Promise.reject(originalError);

      try {
        await wrapAsync(operation, {
          operation: 'get resource',
          resourceType: 'TestResource',
          resourceId: '123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Failed to get resource');
        expect((error as ApiError).context).toEqual({
          operation: 'get resource',
          resourceType: 'TestResource',
          resourceId: '123',
        });
        expect((error as Error).cause).toBe(originalError);
      }
    });

    it('should include additional info in wrapped error', async () => {
      const operation = () => Promise.reject(new Error('Generic error'));

      try {
        await wrapAsync(operation, {
          operation: 'create workflow',
          resourceType: 'Workflow',
          additionalInfo: { workflowName: 'Test Workflow' },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).context).toEqual({
          operation: 'create workflow',
          resourceType: 'Workflow',
          workflowName: 'Test Workflow',
        });
      }
    });

    it('should preserve error stack trace', async () => {
      const operation = () => Promise.reject(new Error('Test error'));

      try {
        await wrapAsync(operation, { operation: 'test' });
      } catch (error) {
        expect((error as Error).stack).toBeDefined();
        expect((error as Error).cause).toBeInstanceOf(Error);
      }
    });
  });
});
