/**
 * Pagination handler
 */

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Pagination handler implementation
 */
export class PaginationHandler {
  private defaultPageSize: number;

  constructor(defaultPageSize = 50) {
    this.defaultPageSize = defaultPageSize;
  }

  /**
   * Apply pagination to large result sets
   */
  paginate<T>(
    data: T[],
    limit: number = this.defaultPageSize,
    offset = 0,
  ): PaginationResult<T> {
    const total = data.length;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedData = data.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return {
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("PaginationHandler", () => {
    const handler = new PaginationHandler();

    describe("paginate", () => {
      it("should paginate data correctly", () => {
        const data = Array.from({ length: 100 }, (_, i) => i);

        const result = handler.paginate(data, 10, 0);

        expect(result.data).toHaveLength(10);
        expect(result.data[0]).toBe(0);
        expect(result.data[9]).toBe(9);
        expect(result.pagination.total).toBe(100);
        expect(result.pagination.hasMore).toBe(true);
      });

      it("should handle last page", () => {
        const data = Array.from({ length: 25 }, (_, i) => i);

        const result = handler.paginate(data, 10, 20);

        expect(result.data).toHaveLength(5);
        expect(result.pagination.hasMore).toBe(false);
      });
    });
  });
}
