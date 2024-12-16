import axiosInstance from './api-client';

class HttpService<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Create or POST
  create = async (entity: T) => {
    try {
      const response = await axiosInstance.post(this.endpoint, entity);
      return response.data;
    } catch (err) {
      console.error(`POST ${this.endpoint} failed:`, err);
      throw err;
    }
  };

  // Fetch or GET (with optional params)
  fetch = async (params?: Record<string, null>) => {
    try {
      const response = await axiosInstance.get(this.endpoint, { params });
      return response.data;
    } catch (err) {
      console.error(`GET ${this.endpoint} failed:`, err);
      throw err;
    }
  };

  // Update or PUT
  update = async (id: string | number, entity: T) => {
    try {
      const response = await axiosInstance.put(
        `${this.endpoint}/${id}`,
        entity
      );
      return response.data;
    } catch (err) {
      console.error(`PUT ${this.endpoint}/${id} failed:`, err);
      throw err;
    }
  };

  // Delete
  delete = async (id: string | number) => {
    try {
      const response = await axiosInstance.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (err) {
      console.error(`DELETE ${this.endpoint}/${id} failed:`, err);
      throw err;
    }
  };

  // POST with data (for non-CRUD actions like login)
  post = async (path: string, data: unknown) => {
    try {
      const response = await axiosInstance.post(
        `${this.endpoint}${path}`,
        data
      );
      return response.data;
    } catch (err) {
      console.error(`POST ${this.endpoint}${path} failed:`, err);
      throw err;
    }
  };

  //Get A single data
  get = async (path: string) => {
    try {
      const response = await axiosInstance.get(`${this.endpoint}${path}`);
      return response.data;
    } catch (err) {
      console.log(`Get Request Failed`);
      throw err;
    }
  };
}

export default HttpService;
