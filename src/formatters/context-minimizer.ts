/**
 * Context size minimizer
 */

/**
 * Context minimizer implementation
 */
export class ContextMinimizer {
  private maxSize: number;

  constructor(maxSize = 100000) {
    this.maxSize = maxSize;
  }

  /**
   * Minimize context size by removing unnecessary fields
   */
  minimizeContext<T>(data: T, maxSize?: number): T {
    const sizeLimit = maxSize ?? this.maxSize;
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= sizeLimit) {
      return data;
    }

    // If data is too large, try to reduce it
    // Pass jsonString to avoid re-serialization
    if (Array.isArray(data)) {
      return this.minimizeArray(data, sizeLimit, jsonString) as T;
    } else if (typeof data === "object" && data !== null) {
      return this.minimizeObject(data, sizeLimit, jsonString) as T;
    }

    return data;
  }

  /**
   * Minimize array data
   * @param jsonString Pre-serialized JSON string to avoid re-serialization
   */
  private minimizeArray<T>(data: T[], maxSize: number, jsonString: string): T[] {
    // Use pre-serialized string instead of re-serializing
    if (jsonString.length <= maxSize) {
      return data;
    }

    // Try to reduce array size by taking fewer items
    const targetSize = Math.floor(maxSize * 0.8); // Leave some buffer
    const itemSize = jsonString.length / data.length;
    const maxItems = Math.floor(targetSize / itemSize);

    return data.slice(0, Math.max(1, maxItems));
  }

  /**
   * Minimize object data
   * @param jsonString Pre-serialized JSON string to avoid re-serialization
   */
  private minimizeObject<T>(data: T, maxSize: number, jsonString: string): T {
    // Use pre-serialized string instead of re-serializing
    if (jsonString.length <= maxSize) {
      return data;
    }

    // Remove less important fields
    if (typeof data === "object" && data !== null) {
      const minimized = { ...data } as Record<string, unknown>;

      // Remove execution logs and verbose data
      delete minimized.executionLogs;
      delete minimized.executionData;
      delete minimized.verbose;

      // Check if still too large (only one additional serialization needed)
      const newJsonString = JSON.stringify(minimized);
      if (newJsonString.length <= maxSize) {
        return minimized as T;
      }
    }

    return data;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ContextMinimizer", () => {
    const minimizer = new ContextMinimizer(1000);

    describe("minimizeContext", () => {
      it("should return data as-is if within size limit", () => {
        const data = { small: "data" };
        const result = minimizer.minimizeContext(data);
        expect(result).toEqual(data);
      });

      it("should minimize array if too large", () => {
        const data = Array.from({ length: 100 }, (_, i) => ({
          id: i,
          largeField: "x".repeat(100),
        }));
        const result = minimizer.minimizeContext(data);
        expect(result.length).toBeLessThan(data.length);
      });

      it("should minimize object if too large", () => {
        const data = {
          id: "1",
          executionLogs: "x".repeat(10000),
          executionData: "y".repeat(10000),
        };
        const result = minimizer.minimizeContext(data);
        expect(result).not.toHaveProperty("executionLogs");
        expect(result).not.toHaveProperty("executionData");
      });
    });
  });
}
