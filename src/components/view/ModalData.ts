import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class ModalData extends Component<unknown> {
  protected readonly events: IEvents;
  protected readonly modalContainerElement: HTMLElement;
  protected readonly modalContentElement: HTMLElement;
  protected readonly modalCloseButtonElement: HTMLButtonElement;

  private closeHandler!: () => void;
  private backgroundHandler!: (event: MouseEvent) => void;
  private escHandler!: (event: KeyboardEvent) => void;

  public get element(): HTMLElement {
    return this.container;
  }

  public get contentElement(): HTMLElement {
    return this.modalContentElement;
  }

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.modalContainerElement = this.container;
    this.modalContentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.modalCloseButtonElement = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
  }

  set content(element: HTMLElement) {
    this.modalContentElement.innerHTML = "";
    this.modalContentElement.append(element);
  }

  // Открыть модалку
  open(): void {
    this.modalContainerElement.classList.add("modal_active");
    document.body.style.overflow = "hidden";

    this.closeHandler = () => this.close();
    this.backgroundHandler = (event: MouseEvent) =>
      this.handleBackgroundClick(event);
    this.escHandler = (event: KeyboardEvent) => this.handleEscKeydown(event);

    this.modalCloseButtonElement.addEventListener("click", this.closeHandler);
    this.modalContainerElement.addEventListener(
      "click",
      this.backgroundHandler
    );
    document.addEventListener("keydown", this.escHandler);
  }

  // Закрыть модалку
  close(): void {
    this.modalContainerElement.classList.remove("modal_active");
    document.body.style.overflow = "";

    this.modalCloseButtonElement.removeEventListener(
      "click",
      this.closeHandler
    );
    this.modalContainerElement.removeEventListener(
      "click",
      this.backgroundHandler
    );
    document.removeEventListener("keydown", this.escHandler);

    this.modalContentElement.innerHTML = "";

    this.events.emit("modal:close");
  }

  // Клик по фону
  protected handleBackgroundClick(event: MouseEvent): void {
    if (event.target === this.modalContainerElement) {
      this.close();
    }
  }

  // Esc
  protected handleEscKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.close();
    }
  }
}
