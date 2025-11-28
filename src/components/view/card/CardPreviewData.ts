import { ensureElement } from "../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../utils/constants";
import { CardData } from "./CardData";
import { IEvents } from "../../base/Events";

export interface ICardPreviewProps {
  image: string;
  category: keyof typeof categoryMap;
  description: string;
  fullPrice: number | null;
  isInBasket: boolean;
}

export class CardPreviewData<T> extends CardData<ICardPreviewProps & T> {
  protected readonly events: IEvents;
  protected readonly productImageElement: HTMLImageElement;
  protected readonly productCategoryElement: HTMLElement;
  protected readonly productDescriptionElement: HTMLParagraphElement;
  protected readonly productActionButtonElement: HTMLButtonElement;

  public get element(): HTMLElement {
    return this.container;
  }

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.productImageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.productCategoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.productDescriptionElement = ensureElement<HTMLParagraphElement>(
      ".card__text",
      this.container
    );
    this.productActionButtonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.productActionButtonElement.addEventListener("click", () =>
      this.handleActionClick()
    );
  }

  set image(src: string) {
    this.productImageElement.src = CDN_URL + src;
    this.productImageElement.alt = src;
  }

  set category(categoryName: keyof typeof categoryMap) {
    const mod = categoryMap[categoryName];
    this.productCategoryElement.textContent = categoryName;
    this.productCategoryElement.className = `card__category ${mod}`;
  }

  set rawCategory(value: string) {
    if (value in categoryMap) {
      this.category = value as keyof typeof categoryMap;
    } else {
      this.category = "другое";
    }
  }

  set description(value: string) {
    this.productDescriptionElement.textContent = value;
  }

  set fullPrice(value: number | null) {
    if (value === null) {
      this.productPriceElement.textContent = "Недоступно";
      this.productActionButtonElement.disabled = true;
      this.productActionButtonElement.textContent = "Недоступно";
    } else {
      this.productPriceElement.textContent = `${value} синапсов`;
      this.productActionButtonElement.disabled = false;
    }
  }

  set isInBasket(inBasket: boolean) {
    this.productActionButtonElement.textContent = inBasket
      ? "Удалить из корзины"
      : "Купить";
  }

  protected handleActionClick(): void {
    const id = this.container.dataset.id;

    if (this.productActionButtonElement.textContent === "Купить") {
      this.events.emit("product:add", { id });
    } else {
      this.events.emit("product:remove", { id });
    }
  }
}
