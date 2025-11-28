https://github.com/lerachandi/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Данные товара IProduct

```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

- `id` - уникальный идентификатор (id) товара (например: "854cef69-976d-4c2a-a18c-2aa45046c390")
- `description` - описание товара (например: "Если планируете решать задачи в тренажёре, берите два")
- `image` - изображение товара (например: "/5_Dots.svg")
- `title` - заголовок товара (например: "+1 час в сутках")
- `category` - категория товара (например: "софт-скил")
- `price` - стоимость товара (если `null` - товар бесценный)

#### Данные покупателя IBuyer

```typescript
interface IBuyer {
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;
}
```

- `payment` - способ оплаты (`card | cash`)
- `email` - почта покупателя
- `phone` - телефон покупателя
- `address` - адрес доставки

### Модели данных

#### Каталог `Catalog`

Свойства:

- `products: IProduct[]` - массив товаров
- `selectedProduct: IProduct | null` - выделенный товар

Методы:

- `setProducts(products: IProduct[]): void` - сохранение товаров
- `getProducts(): IProduct[]` - возвращает все товары
- `getProductById(productId: string): IProduct | null` - находит товар `id`
- `selectProduct(product: IProduct | null): void` - устанавливает выбранный товар
- `getSelectedProduct(): IProduct | null` - получение товара для отображения

#### Корзина с товарами `Basket`

**Свойства**

- `products: IProduct[]` - массив товаров, добавленных в корзину

**Методы**:

- `getProducts(): IProduct[]` - возвращает товары из корзины
- `addProduct(product: IProduct): void` - добавление товара
- `removeProduct(product: IProduct): void` - удаление товара
- `clearBasket(): void` - очистка корзины
- `getTotalCost(): number` - возвращает общую стоимость товаров в корзине
- `getProductCount(): number` - возвращает общее количество товаров в корзине
- `containsProduct(productId: string): boolean` - проверка наличия товара в корзине по `id`

#### Покупатель `Customer`

**Свойства:**

- `paymentMethod: TPayment | null` - выбранный способ оплаты
- `deliveryAddress: string` - адрес доставки
- `phoneNumber: string` - номер телефона покупателя
- `emailAddress: string` - электронная почта покупателя

**Методы:**

- `setPaymentMethod(method: TPayment): void` - устанавливает способ оплаты
- `setDeliveryAddress(address: string): void` - устанавливает адрес доставки
- `setPhoneNumber(phone: string): void` - устанавливает телефон покупателя
- `setEmailAddress(email: string): void` - устанавливает почту покупателя
- `getCustomerData(): IBuyer` - возвращает данные покупателя
- `reset(): void` - очищает данные покупателя
- `validate(): TBuyerValidityMessages` - валидация данных покупателя

### Слой коммуникации `ProductApi`

**Конструктор:**

- `constructor(api: IApi)` - принимает экземпляр класса, реализующего интерфейс IApi

**Методы класса:**

- `loadProducts(): Promise<IGetProductsApiResponse>` - получает с сервера список товаров
- `createOrder(orderData: IOrderApiRequest): Promise<IOrderApiResponse>` - отправляет заказ на сервер

### Представление (View)

Компоненты представления отвечают за отображение данных и за генерацию событий, на которые реагирует презентер.  
Все компоненты наследуются от базового класса `Component<T>` и используют утилиту `ensureElement` для поиска DOM-элементов внутри своего контейнера.

Поиск элементов выполняется **только в контейнере компонента**, а не в документе.  
При любых действиях пользователя компонент вызывает `this.events.emit(...)`, передавая нужные данные презентеру.

---

## `HeaderData`

Компонент шапки сайта, отображающий кнопку корзины и количество товаров.

**Свойства**

- `events: IEvents` — объект событий
- `cartButtonElement: HTMLButtonElement` — кнопка открытия корзины
- `cartCounterElement: HTMLElement` — индикатор количества товаров

**Методы**

- `set count(value: number)` — обновляет отображаемое количество товаров
- `protected handleCartButtonClick(): void` - ообновляет отображаемое количество товаров

---

## `ModalData`

Модальное окно для отображение разного контента (форма, карточка и тд).

**Свойства**

- `events: IEvents` — объект событий
- `modalContainerElement: HTMLElement` — внешний контейнер модального окна
- `modalContentElement: HTMLElement` — область для контента
- `modalCloseButtonElement: HTMLButtonElement` — кнопка закрытия

**Методы**

- `set content(element: HTMLElement)` — заменяет содержимое модального окна
- `open()` — открывает модальное окно
- `close()` — закрывает модальное окно
- `protected handleBackgroundClick(event: MouseEvent): void` — закрытие при клике по фону
- `protected handleEscKeydown(event: KeyboardEvent): void` — обрабатывает нажатие клавиши `Esc`

---

## `GalleryData`

Список карточек каталога

**Свойства**

- `galleryContainerElement: HTMLElement` — контейнер каталога

**Методы**

- `set items(elements: HTMLElement[])` — рендер списка карточек товаров

---

## `CardData`

Базовая карточка товара. Содержит общие элементы — название и цена.  
Используется как родительский класс для остальных карточек.

**Свойства**

- `events: IEvents` — объект событий
- `productTitleElement: HTMLElement` — заголовок товара
- `productPriceElement: HTMLElement` — цена товара

**Методы**

- `set title(value: string)` — обновляет текст заголовка
- `set price(value: string)` — обновляет цену

---

## `CardBasketData`

Карточка товара, отображаемая внутри корзины.

**Свойства**

- `events: IEvents `— объект событий
- `productIndexElement: HTMLElement` - отображает порядковый номер товара
- `productRemoveButtonElement: HTMLButtonElement` - кнопка удаления товара

**Методы**

- `set index(value: number)` — устанавливает порядковый номер
- `protected handleRemoveButtonClick(): void` - обработчик клика по кнопке удаления, отправляет событие удаления товара

---

## `CardCatalogData`

Карточка товара, отображаемая в списке каталога.

**Свойства**

- `productCategoryElement: HTMLElement` — текст категории
- `productImageElement: HTMLImageElement` — изображение товара

**Методы**

- `set category(value: string)` — устанавливает категорию и её модификатор
- `set image(src: string)` — устанавливает изображение товара
- `protected handleCardClick(): void` - обработчик клика по карточке, генерирует событие product:select
- `set rawCategory(value: string)` — fallback-установка категории по данным API

---

## `CardPreviewData`

Карточка товара для просмотра в модальном окне: показывает изображение, категорию, описание и кнопку добавления/удаления товара из корзины.

**Свойства**

- `events: IEvents` — объект событий
- `productDescriptionElement: HTMLParagraphElement` — элемент с описанием товара
- `productActionButtonElement: HTMLButtonElement` — кнопка действия («Купить» / «Удалить из корзины» / «Недоступно»)
- `productImageElement: HTMLImageElement` — изображение товара
- `productCategoryElement: HTMLElement` — элемент с текстом категории и её визуальным модификатором

**Методы**

- `set description(value: string)` — обновляет текст описания
- `set fullPrice(value: number | null)` — отображает цену; если `value === null`, устанавливает текст кнопки `"Недоступно"` и блокирует её
- `set category(value: keyof typeof categoryMap)` — устанавливает текст категории и соответствующий класс-модификатор согласно `categoryMap`
- `set rawCategory(value: string)` — принимает «сырое» значение категории из API и пытается сопоставить его ключам `categoryMap`; при отсутствии совпадения подставляет дефолтную категорию
- `set isInBasket(value: boolean)` — меняет текст кнопки: `"Купить"`, если товар ещё не в корзине, или `"Удалить из корзины"`, если товар уже добавлен

- `protected handleActionClick(): void` — обработчик клика по кнопке действия.  
  В зависимости от текущего состояния карточки генерирует событие:
  - `product:add` — если товар нужно добавить в корзину;
  - `product:remove` — если товар нужно удалить из корзины.

---

## `BasketData`

Компонент корзины, в котором отображается список выбранных товаров и итоговая сумма.

**Свойства**

- `protected readonly events: IEvents` — объект для генерации событий.
- `protected readonly basketItemsContainerElement: HTMLElement` — контейнер для списка карточек товаров корзины.
- `protected readonly basketTotalPriceElement: HTMLElement` — элемент для отображения общей стоимости товаров в корзине.
- `protected readonly basketCheckoutButtonElement: HTMLButtonElement` — кнопка оформления заказа.

**Методы**

- `set items(elements: HTMLElement[]): void` — рендерит список карточек товаров корзины; при пустом массиве скрывает список и показывает сообщение о пустой корзине
- `set total(value: number): void` — устанавливает общую сумму заказа в `basketTotalPriceElement`.
- `set canCheckout(value: boolean): void` — включает или отключает кнопку оформления заказа в зависимости от наличия товаров

- `protected handleCheckoutButtonClick(): void` — обработчик клика по кнопке оформления заказа, генерирует событие `basket:checkout`

---

## `BaseForm`

Базовый класс форм. Содержит общую логику работы с кнопкой отправки и выводом ошибок.

**Свойства**

- `protected readonly events: IEvents` — объект для генерации событий
- `protected readonly formRootElement: HTMLFormElement` — корневой элемент формы
- `protected readonly formSubmitButtonElement: HTMLButtonElement` — кнопка отправки формы
- `protected readonly formErrorElement: HTMLElement` — элемент для отображения сообщения об ошибке

**Методы**

- `set error(value: string)` — показывает сообщение об ошибке
- `set valid(isValid: boolean)` — включает/выключает кнопку отправки формы
- `clearError()` — убирает текст ошибки

- `protected handleFormSubmit(event: SubmitEvent): void` - обработчик отправки формы - отправляет событие submit.

---

## `OrderFormData`

Первая форма оформления заказа: выбор способа оплаты и ввод адреса доставки.

**Свойства**

- `protected readonly paymentOptionButtons: HTMLButtonElement[]` — кнопки выбора оплаты (онлайн или при получении)
- `protected readonly addressInputElement: HTMLInputElement` — поле ввода адреса доставки

**Методы**

- `set payment(value: string)` — активирует выбранный способ оплаты, подсвечивая соответствующую кнопку
- `set address(value: string)` — устанавливает текст в поле адреса доставки
- `private updateValidity(): void` — проверяет, выбран ли способ оплаты и заполнен ли адрес; включает/выключает кнопку «Далее» и выводит сообщение об ошибке при некорректном заполнении

Обработчики событий:

- обработчики клика по `paymentOptionButtons` — генерируют событие `order:payment-change` с выбранным типом оплаты и вызывают `updateValidity()`
- обработчик события `input` на `addressInputElement` — генерирует событие `order:address-change` и вызывает `updateValidity()`
- `protected override handleFormSubmit(event: SubmitEvent): void` — предотвращает стандартную отправку формы и генерирует событие `order:submit`

---

## `ContactsFormData`

Описание  
Вторая форма оформления заказа: e-mail и телефон.

**Свойства**

- `emailInputElement: HTMLInputElement` — поле ввода e-mail
- `phoneInputElement: HTMLInputElement` — поле ввода телефона

**Методы**

- `set email(value: string)` — устанавливает e-mail
- `set phone(value: string)` — устанавливает телефон

- обработчики: ввод e-mail - contacts:email-change, ввод телефона - contacts:phone-change, отправка формы → contacts:submit

---

## `OrderSuccessData`

Компонент успешного оформления заказа: показывает итоговую сумму и кнопку закрытия.

**Свойства**

- `events: IEvents` — объект событий
- `successMessageElement: HTMLParagraphElement` — текст с итоговой суммой
- `closeSuccessButtonElement: HTMLButtonElement` — кнопка закрытия

**Методы**

- `set total(value: number)` — устанавливает сумму заказа
- `protected handleCloseClick(): void `- обработчик нажатия кнопки, отправляет событие завершения оформления (генерирует order:complete)

### Presenter

Презентер реализован в файле main.ts и является связующим звеном между Model и View.

#### Функции презентера:

- загрузка каталога с сервера
- создание моделей и компонентов
- подписка на события View
- обновление интерфейса при изменении данных
- управление переходами между экранами (каталог → карточка → корзина → формы → success)

#### Основные процессы

**Загрузка каталога**

- получает данные с сервера
- сохраняет их в модель Catalog
- генерирует catalog:changed → рендер каталога

**Выбор товара**

- по product:select создаёт и показывает CardPreviewData
- кнопка внутри карточки генерирует product:add / product:remove

**Корзина**

- product:add - добавляет товар
- product:remove - удаляет
- basket:changed - обновляет счётчик и UI
- basket:open - отображает корзину
- basket:checkout → открывает форму оплаты

**Оформление заказа**

- order:payment-change / order:address-change - сохраняет в модель Customer
- order:submit → открывает форму контактов
- contacts:email-change / contacts:phone-change → обновляет модель
- contacts:submit → создаёт заказ, очищает модели, показывает success

**Завершение**

- order:complete — закрывает модальное окно
- modal:close — очищает временные данные покупателя
