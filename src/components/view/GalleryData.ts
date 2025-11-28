import { Component } from "../base/Component";

type TGalleryData = {
  items: HTMLElement[];
};

export class GalleryData extends Component<TGalleryData> {
  public get element(): HTMLElement {
    return this.container;
  }

  constructor(container: HTMLElement) {
    super(container);
  }

  set items(catalogItems: HTMLElement[]) {
    this.container.replaceChildren(...catalogItems);
  }
}
