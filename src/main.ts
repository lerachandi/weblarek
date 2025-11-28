import "./scss/styles.scss";

// MODELS
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Customer } from "./components/models/Customer";

// API
import { ProductApi } from "./components/api/ProductApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// EVENTS
import { EventEmitter } from "./components/base/Events";

// VIEWS
import { HeaderData } from "./components/view/HeaderData";
import { ModalData } from "./components/view/ModalData";
import { GalleryData } from "./components/view/GalleryData";
import { BasketData } from "./components/view/BasketData";

import { CardCatalogData } from "./components/view/card/CardCatalogData";
import { CardPreviewData } from "./components/view/card/CardPreviewData";
import { CardBasketData } from "./components/view/card/CardBasketData";

import { OrderFormData } from "./components/view/form/OrderFormData";
import { ContactsFormData } from "./components/view/form/ContactsFormData";
import { OrderSuccessData } from "./components/view/OrderSuccessData";

import { TPayment } from "./types";

// UTILS
import { cloneTemplate, cloneFormTemplate } from "./utils/utils";

// INIT

const events = new EventEmitter();

const catalogModel = new Catalog();
const basketModel = new Basket(); 
const customerModel = new Customer();


const api = new ProductApi(new Api(API_URL));

// VIEWS
const header = new HeaderData(
  document.querySelector(".header") as HTMLElement,
  events
);

const modal = new ModalData(
  document.querySelector("#modal-container") as HTMLElement,
  events
);

const gallery = new GalleryData(
  document.querySelector(".gallery") as HTMLElement
);

// ---------- RENDER: BASKET ----------

function renderBasket() {
  const wrapper = cloneTemplate<HTMLElement>("#basket");
  const view = new BasketData(wrapper, events);

  const cards = basketModel.getProducts().map((product, index) => {
    const cardWrapper = cloneTemplate<HTMLElement>("#card-basket");
    const card = new CardBasketData(cardWrapper, events);

    card.title = product.title;
    card.price = product.price ? `${product.price} синапсов` : "—";
    card.index = index + 1;
    card.element.dataset.id = product.id;

    return card.render();
  });

  view.items = cards;
  view.total = basketModel.getTotalCost();
  view.canCheckout = cards.length > 0;

  modal.content = view.render();
}

// ---------- RENDER: ORDER FORM ----------

function renderOrderForm() {
  const formElement = cloneFormTemplate<HTMLFormElement>("#order");
  const form = new OrderFormData(formElement, events);

  const customer = customerModel.getCustomerData();
  form.payment = customer.payment;
  form.address = customer.address;

  modal.content = form.render();
}

// ---------- RENDER: CONTACTS FORM ----------

function renderContactsForm() {
  const formElement = cloneFormTemplate<HTMLFormElement>("#contacts");
  const form = new ContactsFormData(formElement, events);

  const customer = customerModel.getCustomerData();
  form.email = customer.email;
  form.phone = customer.phone;

  modal.content = form.render();
}

// ---------- RENDER: SUCCESS ----------

function renderSuccess(total: number) {
  const wrapper = cloneTemplate<HTMLElement>("#success");
  const success = new OrderSuccessData(wrapper, events);

  success.total = total;
  modal.content = success.render();
}

// ======================================================
//  PRESENTER (ВСЯ ЛОГИКА)
// ======================================================

// --- catalog loaded ---
events.on("catalog:changed", () => {
  const cards = catalogModel.getProducts().map((product) => {
    const wrapper = cloneTemplate<HTMLElement>("#card-catalog");
    const card = new CardCatalogData(wrapper, events);

    card.title = product.title;
    card.price = product.price ? `${product.price} синапсов` : "Недоступно";
    card.rawCategory = product.category;
    card.image = product.image;
    card.element.dataset.id = product.id;

    return card.render();
  });

  gallery.items = cards;
});

// --- select product ---
events.on<{ id: string }>("product:select", ({ id }) => {
  const product = catalogModel.getProductById(id);
  if (!product) return;

  const wrapper = cloneTemplate<HTMLElement>("#card-preview");
  const card = new CardPreviewData(wrapper, events);

  card.title = product.title;
  card.fullPrice = product.price;
  card.description = product.description;
  card.image = product.image;
  card.rawCategory = product.category;
  card.isInBasket = basketModel.containsProduct(id);
  card.element.dataset.id = id;

  modal.content = card.render();
  modal.open();
});

// --- add to basket ---
events.on<{ id: string }>("product:add", ({ id }) => {
  const product = catalogModel.getProductById(id);
  if (!product) return;

  basketModel.addProduct(product);

  events.emit("basket:changed");
});

// --- remove from basket ---
events.on<{ id: string }>("product:remove", ({ id }) => {
  const product = catalogModel.getProductById(id);
  if (!product) return;

  basketModel.removeProduct(product);

  events.emit("basket:changed");
});

// --- basket changed (update views) ---
events.on("basket:changed", () => {
  header.count = basketModel.getProductCount();

  const basketOpen = modal.contentElement.querySelector(".basket") !== null;
  if (basketOpen) {
    renderBasket();
  }

  const preview = modal.contentElement.querySelector<HTMLElement>(".card_full");
  if (preview) {
    const id = preview.dataset.id!;
    const product = catalogModel.getProductById(id);
    if (!product) return;

    const wrapper = cloneTemplate<HTMLElement>("#card-preview");
    const card = new CardPreviewData(wrapper, events);

    card.title = product.title;
    card.fullPrice = product.price;
    card.description = product.description;
    card.image = product.image;
    card.rawCategory = product.category;
    card.isInBasket = basketModel.containsProduct(id);
    card.element.dataset.id = id;

    modal.content = card.render();
  }
});

// --- open basket ---
events.on("basket:open", () => {
  renderBasket();
  modal.open();
});

// --- checkout -> order form ---
events.on("basket:checkout", () => {
  renderOrderForm();
  modal.open();
});

// --- order form changes ---
events.on<{ payment: TPayment }>("order:payment-change", ({ payment }) => {
  customerModel.setPaymentMethod(payment);
  events.emit("order:update");
});

events.on<{ address: string }>("order:address-change", ({ address }) => {
  customerModel.setDeliveryAddress(address);
});

// --- re-render order form ---
events.on("order:update", () => {
  renderOrderForm();
});

// --- submit order form -> contacts ---
events.on("order:submit", () => {
  renderContactsForm();
});

// --- contacts changes ---
events.on<{ email: string }>("contacts:email-change", ({ email }) => {
  customerModel.setEmailAddress(email);
});

events.on<{ phone: string }>("contacts:phone-change", ({ phone }) => {
  customerModel.setPhoneNumber(phone);
});

// --- contacts -> success ---
events.on("contacts:submit", () => {
  const order = {
    ...customerModel.getCustomerData(),
    items: basketModel.getProducts().map((p) => p.id),
    total: basketModel.getTotalCost(),
  };

  basketModel.clearBasket();
  customerModel.reset();

  renderSuccess(order.total);
  modal.open();
});

// --- success modal closed ---
events.on("order:complete", () => {
  modal.close();
});

// --- reset forms on modal close ---
events.on("modal:close", () => {
  customerModel.reset();
});

// ---------- LOAD CATALOG ----------
api
  .loadProducts()
  .then((response) => {
    catalogModel.setProducts(response.items);
    events.emit("catalog:changed");
  })
  .catch((err) => console.error("Load error:", err));
