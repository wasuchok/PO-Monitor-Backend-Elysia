export interface PaginationMeta {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  durationMs: number;
  data: T;
  pagination?: PaginationMeta;
}

interface ResponseOptions {
  message?: string;
  startTime?: number;
  pagination?: PaginationMeta;
}

export const buildResponse = <T>(
  data: T,
  { message = "success", startTime = Date.now(), pagination }: ResponseOptions = {}
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    durationMs: Date.now() - startTime,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
};

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
