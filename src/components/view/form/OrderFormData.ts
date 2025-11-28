import { ensureElement } from "../../../utils/utils";
import { BaseForm } from "./BaseForm";
import { IEvents } from "../../base/Events";

export interface IOrderFormProps {
  payment: string;
  address: string;
}

export class OrderFormData<T> extends BaseForm<IOrderFormProps & T> {
  protected readonly paymentOptionButtons: HTMLButtonElement[];
  protected readonly addressInputElement: HTMLInputElement;

  // Флаги, что пользователь взаимодействовал с полями
  private paymentTouched = false;
  private addressTouched = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentOptionButtons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>(
        ".order__buttons .button"
      )
    );

    this.addressInputElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    // payment
    this.paymentOptionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.paymentTouched = true;

        this.events.emit("order:payment-change", { payment: button.name });
        this.updateValidity();
      });
    });

    // address
    this.addressInputElement.addEventListener("input", () => {
      this.addressTouched = true;

      this.events.emit("order:address-change", {
        address: this.addressInputElement.value,
      });
      this.updateValidity();
    });

    this.updateValidity();
  }

  set payment(value: string) {
    this.paymentOptionButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
    this.updateValidity();
  }

  set address(value: string) {
    this.addressInputElement.value = value;
    this.updateValidity();
  }

  private updateValidity() {
    const hasPayment = this.paymentOptionButtons.some((btn) =>
      btn.classList.contains("button_alt-active")
    );

    const hasAddress = this.addressInputElement.value.trim().length > 0;

    // Кнопка "Далее"
    this.valid = hasPayment && hasAddress;

    // Ошибка по адресу, если юзер редактировал поле
    if (this.addressTouched && !hasAddress) {
      this.error = "Необходимо указать адрес";
      return;
    }

    // Ошибка по оплате, если трогали оплату или адрес, но оплата не выбрана
    if ((this.paymentTouched || this.addressTouched) && !hasPayment) {
      this.error = "Необходимо выбрать способ оплаты";
      return;
    }

    this.clearError();
  }

  protected override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.events.emit("order:submit");
  }
}
