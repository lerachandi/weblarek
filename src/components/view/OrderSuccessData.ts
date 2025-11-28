import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IOrderSuccessProps {
  total: number;
}

export class OrderSuccessData<T> extends Component<IOrderSuccessProps & T> {
  protected readonly events: IEvents;
  protected readonly successMessageElement: HTMLParagraphElement;
  protected readonly closeSuccessButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.successMessageElement = ensureElement<HTMLParagraphElement>(
      ".order-success__description",
      this.container
    );

    this.closeSuccessButtonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeSuccessButtonElement.addEventListener("click", () =>
      this.handleCloseClick()
    );
  }

  set total(value: number) {
    this.successMessageElement.textContent = `Списано ${value} синапсов`;
  }

  protected handleCloseClick(): void {
    this.events.emit("order:complete");
  }
}
