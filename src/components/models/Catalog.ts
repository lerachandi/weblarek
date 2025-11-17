import { IProduct } from "../../types";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(productId: string): IProduct | null {
    return this.products.find(({ id }) => id === productId) ?? null;
  }

  selectProduct(item: IProduct | null): void {
    this.selectedProduct = item;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
