import { ensureElement } from "../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../utils/constants";
import { CardData } from "./CardData";
import { IEvents } from "../../base/Events";

export interface ICardCatalogProps {
  image: string;
  category: keyof typeof categoryMap;
}

export class CardCatalogData<T> extends CardData<ICardCatalogProps & T> {
  protected readonly events: IEvents;
  protected readonly productCategoryElement: HTMLElement;
  protected readonly productImageElement: HTMLImageElement;

  public get element(): HTMLElement {
    return this.container;
  }

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.productCategoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );

    this.productImageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.container.addEventListener("click", () => this.handleCardClick());
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

  set image(src: string) {
    this.productImageElement.src = CDN_URL + src;
    this.productImageElement.alt = src;
  }

  protected handleCardClick(): void {
    const id = this.container.dataset.id;
    this.events.emit("product:select", { id });
  }
}
