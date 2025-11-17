import { IProduct } from "../../types";

export class Basket {
  protected products: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  removeProduct(productToRemove: IProduct): void {
    this.products = this.products.filter(
      (product) => product.id !== productToRemove.id
    );
  }

  clearBasket(): void {
    this.products = [];
  }

  getTotalCost(): number {
    return this.products.reduce((sum, { price }) => {
      if (price) {
        sum += price;
      }

      return sum;
    }, 0);
  }

  getProductCount(): number {
    return this.products.length;
  }

  containsProduct(itemId: string): boolean {
    return this.products.some(({ id }) => id === itemId);
  }
}
