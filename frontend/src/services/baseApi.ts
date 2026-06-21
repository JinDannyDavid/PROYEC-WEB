// src/services/baseApi.ts
import { api } from './api';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ExtractDataFn<T> = (response: { data: T[] | PaginatedResponse<T> }) => T[];

export const defaultExtractData: ExtractDataFn<any> = (response) => {
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in data) return data.results;
  return [];
};

export interface BaseApiOptions<T> {
  endpoint: string;
  extractData?: ExtractDataFn<T>;
}

export class BaseApiService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  protected endpoint: string;
  protected extractData: ExtractDataFn<T>;

  constructor(options: BaseApiOptions<T>) {
    this.endpoint = options.endpoint;
    this.extractData = options.extractData || defaultExtractData;
  }

  protected getUrl(id?: number | string, action?: string): string {
    let url = this.endpoint;
    if (id) url += `${id}/`;
    if (action) url += `${action}/`;
    return url;
  }

  async getAll(params?: Record<string, string>): Promise<T[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await api.get(`${this.endpoint}${query}`);
    return this.extractData(response);
  }

  async getById(id: number | string): Promise<T> {
    const response = await api.get(this.getUrl(id));
    return response.data;
  }

  async create(data: CreateDto): Promise<T> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  async update(id: number | string, data: UpdateDto): Promise<T> {
    const response = await api.patch(this.getUrl(id), data);
    return response.data;
  }

  async delete(id: number | string): Promise<void> {
    await api.delete(this.getUrl(id));
  }

  async customAction(id: number | string, action: string, data?: unknown, method: 'post' | 'patch' = 'post'): Promise<T> {
    const response = await api[method](this.getUrl(id, action), data);
    return response.data;
  }
}

export function createApiService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  endpoint: string,
  extractData?: ExtractDataFn<T>
): BaseApiService<T, CreateDto, UpdateDto> {
  return new BaseApiService({ endpoint, extractData });
}