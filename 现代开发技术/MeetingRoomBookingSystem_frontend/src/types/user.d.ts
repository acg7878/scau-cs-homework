export interface User {
  username: string;
  email: string | null;
  createdAt: number;
  updatedAt: number
  status: string
}

export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

