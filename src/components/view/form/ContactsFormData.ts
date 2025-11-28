import { ensureElement } from "../../../utils/utils";
import { BaseForm } from "./BaseForm";
import { IEvents } from "../../base/Events";

export interface IContactsFormProps {
  email: string;
  phone: string;
}

export class ContactsFormData extends BaseForm<IContactsFormProps> {
  protected readonly emailInputElement: HTMLInputElement;
  protected readonly phoneInputElement: HTMLInputElement;

  // Флаги взаимодействия
  private wasEmailTouched = false;
  private wasPhoneTouched = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );

    this.phoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    // email
    this.emailInputElement.addEventListener("input", () => {
      this.wasEmailTouched = true;

      this.events.emit("contacts:email-change", {
        email: this.emailInputElement.value,
      });

      this.updateValidity();
    });

    // phone number
    this.phoneInputElement.addEventListener("input", () => {
      this.wasPhoneTouched = true;

      this.events.emit("contacts:phone-change", {
        phone: this.phoneInputElement.value,
      });

      this.updateValidity();
    });

    this.updateValidity();
  }

  set email(value: string) {
    this.emailInputElement.value = value;
    this.updateValidity();
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
    this.updateValidity();
  }

  private updateValidity() {
    const hasEmail = this.emailInputElement.value.trim().length > 0;
    const hasPhone = this.phoneInputElement.value.trim().length > 0;

    // кнопка "Оплатить"
    this.valid = hasEmail && hasPhone;

    if (!hasEmail && this.wasEmailTouched) {
      this.error = "Необходимо указать email";
    } else if (!hasPhone && this.wasPhoneTouched) {
      this.error = "Необходимо указать телефон";
    } else {
      this.clearError();
    }
  }

  protected override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.events.emit("contacts:submit");
  }
}
