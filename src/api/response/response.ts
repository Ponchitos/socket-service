export interface ISuccessResponse<T> {
  statusCode: string;
  data: T;
}

export interface IFailResponse {
  statusCode: number;
  error: Error;
}
