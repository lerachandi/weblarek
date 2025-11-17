import {
  IApi,
  IGetProductsApiResponse,
  IOrderApiRequest,
  IOrderApiResponse,
} from "../../types";

export class ProductApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  loadProducts(): Promise<IGetProductsApiResponse> {
    return this.api.get<IGetProductsApiResponse>("/product");
  }

  createOrder(orderData: IOrderApiRequest): Promise<IOrderApiResponse> {
    return this.api.post<IOrderApiResponse>("/order", orderData);
  }
}
