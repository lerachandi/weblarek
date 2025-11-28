import { ensureElement } from "../../../utils/utils";
import { CardData } from "./CardData";
import { IEvents } from "../../base/Events";

export interface ICardBasketProps {
  index: number;
}

export class CardBasketData<T> extends CardData<ICardBasketProps & T> {
  protected readonly productIndexElement: HTMLElement;
  protected readonly productRemoveButtonElement: HTMLButtonElement;
  protected readonly events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.productIndexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    this.productRemoveButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.productRemoveButtonElement.addEventListener("click", () =>
      this.handleRemoveButtonClick()
    );
  }

  set index(value: number) {
    this.productIndexElement.textContent = String(value);
  }

  protected handleRemoveButtonClick(): void {
    const id = this.element.dataset.id;
    if (!id) {
      return;
    }

    this.events.emit("product:remove", { id });
  }
}
