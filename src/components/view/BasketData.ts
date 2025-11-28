import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IBasketDataProps {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
}

export class BasketData<T> extends Component<IBasketDataProps & T> {
  protected readonly events: IEvents;
  protected readonly basketItemsContainerElement: HTMLElement;
  protected readonly basketTotalPriceElement: HTMLElement;
  protected readonly basketCheckoutButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.basketItemsContainerElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );

    this.basketTotalPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );

    this.basketCheckoutButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.basketCheckoutButtonElement.addEventListener("click", () =>
      this.handleCheckoutClick()
    );
  }

  set items(elements: HTMLElement[]) {
    this.basketItemsContainerElement.replaceChildren(...elements);
  }

  set total(value: number) {
    this.basketTotalPriceElement.textContent = `${value} синапсов`;
  }

  set canCheckout(value: boolean) {
    this.basketCheckoutButtonElement.disabled = !value;
  }

  protected handleCheckoutClick(): void {
    this.events.emit("basket:checkout");
  }
}
