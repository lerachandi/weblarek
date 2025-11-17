import "./scss/styles.scss";

import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Customer } from "./components/models/Customer";

import { apiProducts } from "./utils/data";
import { ProductApi } from "./components/api/ProductApi";
import { Api } from "./components/base/Api";

import { API_URL } from "./utils/constants";

// Создание моделей

const catalogModel = new Catalog();
const basketModel = new Basket();
const customerModel = new Customer();
const productApi = new ProductApi(new Api(API_URL));

// Тест: Catalog

console.group("Тест модели Catalog");

catalogModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога:", catalogModel.getProducts());

const productId = apiProducts.items[1].id;

catalogModel.selectProduct(catalogModel.getProductById(productId));
console.log("Товар по id:", catalogModel.getProductById(productId));
console.log("Текущий товар:", catalogModel.getSelectedProduct());

console.groupEnd();

// Тест: Basket

console.group("Тест модели Basket");

console.log("Добавление товаров");
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

console.log("Товары в корзине:", basketModel.getProducts());
console.log("Общая стоимость:", basketModel.getTotalCost());
console.log("Количество товаров:", basketModel.getProductCount());

console.log(
  "Проверка наличия товара (есть):",
  basketModel.containsProduct(apiProducts.items[1].id)
);
console.log(
  "Проверка наличия товара (нет):",
  basketModel.containsProduct(apiProducts.items[2].id)
);

console.log("Добавление ещё одного товара");
basketModel.addProduct(apiProducts.items[2]);

console.log("Удаление первого товара");
basketModel.removeProduct(apiProducts.items[0]);
console.log("Товары после удаления:", basketModel.getProducts());

console.log("Очистка корзины");
basketModel.clearBasket();
console.log("Состояние корзины после очистки:", basketModel.getProducts());

console.groupEnd();

// Тест: Customer

console.group("Тест модели Customer");

customerModel.setPaymentMethod("cash");
customerModel.setDeliveryAddress("100100, Москва, Тверская, 4");
customerModel.setEmailAddress("test@te&st");
customerModel.setPhoneNumber("+7(888)9991122");

console.log("Данные покупателя:", customerModel.getCustomerData());

customerModel.reset();
console.log("После очистки:", customerModel.getCustomerData());

console.log("Валидация:", customerModel.validate());

console.groupEnd();

// Запрос к серверу за массивом товаров в каталоге

console.group("Загрузка товаров с сервера");

const products = await productApi.loadProducts();

catalogModel.setProducts(products.items);
console.log("Товары, сохранённые в каталоге:", catalogModel.getProducts());

console.groupEnd();
