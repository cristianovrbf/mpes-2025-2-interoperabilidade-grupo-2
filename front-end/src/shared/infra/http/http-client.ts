import axios, { type AxiosInstance, type RawAxiosRequestHeaders } from "axios";

export interface IHttpClient {
  get<T>(
    url: string,
    options?: {
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T>;
  post<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T>;
  patch<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T>;
  put<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T>;
  delete<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T>;
}

export class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;
  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({ baseURL: baseUrl });
  }
  async get<T>(
    url: string,
    options?: {
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }
  async post<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, options?.body, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }
  async patch<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, options?.body, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }
  async put<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, options?.body, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }

  async delete<T>(
    url: string,
    options?: {
      body?: unknown;
      params?: Record<string, unknown>;
      headers?: RawAxiosRequestHeaders;
    }
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, {
      params: options?.params,
      headers: options?.headers,
      data: options?.body,
    });
    return response.data;
  }
}
