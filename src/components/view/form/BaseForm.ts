import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IBaseFormProps {
  error?: string;
}

export class BaseForm<T> extends Component<IBaseFormProps & T> {
  protected readonly events: IEvents;
  protected readonly formRootElement: HTMLFormElement;
  protected readonly formSubmitButtonElement: HTMLButtonElement;
  protected readonly formErrorElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    if (container instanceof HTMLFormElement) {
      this.formRootElement = container;
    } else {
      this.formRootElement = ensureElement<HTMLFormElement>("form", container);
    }

    this.formSubmitButtonElement = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.formRootElement
    );

    this.formErrorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.formRootElement
    );

    this.formRootElement.addEventListener("submit", (event) =>
      this.handleFormSubmit(event)
    );
  }

  set error(message: string) {
    this.formErrorElement.textContent = message;
  }

  clearError(): void {
    this.formErrorElement.textContent = "";
  }

  set valid(isValid: boolean) {
    this.formSubmitButtonElement.disabled = !isValid;
  }

  protected handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.events.emit("form:submit");
  }
}
