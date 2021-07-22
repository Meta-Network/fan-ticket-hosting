export class GeneralResponse<T = Record<string, any>> {
  code: number;
  data: T;
  message?: string;
}
