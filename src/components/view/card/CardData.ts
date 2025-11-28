import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardDataProps {
  title: string;
  price: string;
}

export class CardData<T> extends Component<ICardDataProps & T> {
  protected readonly productTitleElement: HTMLElement;
  protected readonly productPriceElement: HTMLElement;

  public get element(): HTMLElement {
    return this.container;
  }

  constructor(protected readonly container: HTMLElement) {
    super(container);

    this.productTitleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.productPriceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
  }

  set title(value: string) {
    this.productTitleElement.textContent = value;
  }

  set price(value: string) {
    this.productPriceElement.textContent = value;
  }
}
