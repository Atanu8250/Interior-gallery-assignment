/**
 * Generic API response wrapper used across frontend services.
 * @template T payload shape in the `data` field
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};