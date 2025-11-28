import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IHeaderViewData {
  count: number;
}

export class HeaderData extends Component<IHeaderViewData> {
  protected readonly events: IEvents;
  protected readonly cartButtonElement: HTMLButtonElement;
  protected readonly cartCounterElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.cartButtonElement = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.cartCounterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.cartButtonElement.addEventListener("click", () =>
      this.handleCartButtonClick()
    );
  }

  set count(value: number) {
    this.cartCounterElement.textContent = String(value);
  }

  protected handleCartButtonClick(): void {
    this.events.emit("basket:open");
  }
}
