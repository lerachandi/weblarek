import { IBuyer, TPayment, TBuyerValidityMessages } from "../../types";

export class Customer {
  protected paymentMethod: TPayment | null = null;
  protected deliveryAddress: string = "";
  protected phoneNumber: string = "";
  protected emailAddress: string = "";

  // Установка значений
  setPaymentMethod(method: TPayment): void {
    this.paymentMethod = method;
  }

  setDeliveryAddress(address: string): void {
    this.deliveryAddress = address;
  }

  setPhoneNumber(phone: string): void {
    this.phoneNumber = phone;
  }

  setEmailAddress(email: string): void {
    this.emailAddress = email;
  }

  // Получение данных
  getCustomerData(): IBuyer {
    return {
      payment: this.paymentMethod ?? "",
      address: this.deliveryAddress,
      phone: this.phoneNumber,
      email: this.emailAddress,
    };
  }

  // Очистка
  reset(): void {
    this.paymentMethod = null;
    this.deliveryAddress = "";
    this.phoneNumber = "";
    this.emailAddress = "";
  }

  // Валидация
  validate(): TBuyerValidityMessages {
    const errors: TBuyerValidityMessages = {};

    if (!this.paymentMethod) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }

    if (!this.deliveryAddress.trim()) {
      errors.address = "Необходимо указать адрес доставки";
    }

    if (!this.phoneNumber.trim()) {
      errors.phone = "Необходимо указать телефон";
    }

    if (!this.emailAddress.trim()) {
      errors.email = "Необходимо указать email";
    }

    return errors;
  }
}
