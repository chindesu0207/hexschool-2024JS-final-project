const products = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
let productCard = document.querySelectorAll(".productCard");
let quantity = document.querySelectorAll(".quantity");
let counterDown = document.querySelectorAll(".counterDown");
let addCartBtn = document.querySelectorAll(".addCartBtn");
let cartList = document.querySelector(".cartList");
let cartCard = document.querySelectorAll(".cartCard");
const discardAllBtn = document.querySelector(".discardAllBtn");
let discardBtn = document.querySelectorAll(".discardBtn");
const totalPrice = document.querySelector(".totalPrice");
const orderInfoForm = document.querySelector(".orderInfo-form");
const errorMsg = document.querySelectorAll(".orderInfo-message");
const createOrderBtn = document.querySelector(".orderInfo-btn");
const randomAdd = document.querySelector(".randomAdd");
const fillOrderInfoBtn = document.querySelector(".fillOrderInfo");

let category = "全部";
let productData = [];
let cartData = {};
let isPass = false;

let orderInfo = {
  name: "",
  tel: "",
  email: "",
  address: "",
  payment: "ATM",
};

let rule = {
  name: {
    presence: { allowEmpty: false, message: "^必填" },
  },
  tel: {
    presence: { allowEmpty: false, message: "^必填" },
    format: function (tel) {
      if (!tel) return null;
      return {
        pattern: /^(\d{2}-\d{4}-\d{4}|\d{2}-\d{3}-\d{4}|09\d{2}-\d{3}-\d{3})$/,
        message: "^請輸入正確的市話或手機號碼",
      };
    },
  },
  email: {
    presence: { allowEmpty: false, message: "^必填" },
    email: function (email) {
      if (!email) return null;
      return {
        email: true,
        message: "^請輸入正確的email格式",
      };
    },
  },
  address: {
    presence: { allowEmpty: false, message: "^必填" },
  },
};

orderInfoForm.addEventListener("change", (e) => {
  if (e.target.id == "customerName") orderInfo.name = e.target.value;
  if (e.target.id == "customerPhone") {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    if (value.length == 10 && value.startsWith("09"))
      orderInfo.tel = `${value.slice(0, 4)}-${value.slice(4, 7)}-${value.slice(
        7
      )}`;
    else if (value.length >= 8) {
      if (value.startsWith("02"))
        orderInfo.tel = `${value.slice(0, 2)}-${value.slice(
          2,
          6
        )}-${value.slice(6, 10)}`;
      else
        orderInfo.tel = `${value.slice(0, 2)}-${value.slice(
          2,
          5
        )}-${value.slice(5, 10)}`;
    } else orderInfo.tel = value;
  }
  if (e.target.id == "customerEmail") orderInfo.email = e.target.value;
  if (e.target.id == "customerAddress") orderInfo.address = e.target.value;
  if (e.target.id == "tradeWay") orderInfo.payment = e.target.value;
});

productSelect.addEventListener("change", (e) => {
  category = e.target.value;
  renderProducts();
});

discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteAllCartList();
});

createOrderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createOrder();
});

randomAdd.addEventListener("click", () =>
  randomCartList(Math.floor(Math.random() * 5) + 1)
);

fillOrderInfoBtn.addEventListener("click", () => fillOrderInfo());

function renderProducts() {
  let cards = ``;

  productData
    .filter((item) => (category == "全部" ? item : item.category == category))
    .forEach(
      (product) =>
        (cards += `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${product.images}"
            alt=""
          />
          <div class="counter">
            <button class="counterDown" disabled>-</button>
            <input type="text" class="quantity" value="1"/>
            <button class="counterUp">+</button>
          </div>
          <a href="#" class="addCartBtn">加入購物車</a>
          <h3>${product.title}</h3>
          <del class="originPrice">NT$${product.origin_price}</del>
          <p class="nowPrice">NT$${product.price}</p>
        </li>`)
    );
  products.innerHTML = cards;

  productCard = document.querySelectorAll(".productCard");
  quantity = document.querySelectorAll(".quantity");
  counterDown = document.querySelectorAll(".counterDown");

  productCard.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.matches(".counterDown")) updateQty(index, -1);
      if (e.target.matches(".counterUp")) updateQty(index, 1);
      if (e.target.matches(".addCartBtn")) {
        addCartItem(productData[index].id, quantity[index].value);
      }
    });
    item.addEventListener("change", (e) => {
      if (e.target.matches(".quantity")) updateQty(index, 0);
    });
  });
}

function renderCartList() {
  let list = ``;

  if (cartData.carts != undefined && cartData.carts.length > 0) {
    cartData.carts.forEach((item) => {
      list += `<tr class="cartCard">
              <td>
                <div class="cardItem-title">
                  <img
                    src="${item.product.images}"
                    alt=""
                  />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.price}</td>
              <td>
                <div class="counter">
                  <button class="counterDown">-</button>
                  <input type="text" class="quantity" value="${item.quantity}"/>
                  <button class="counterUp">+</button>
                </div>
              </td>
              <td>NT$${item.product.price * item.quantity}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons discardItem"> clear </a>
              </td>
            </tr>`;
    });
  } else {
    list = `<tr><td colspan="5" class="empty">目前購物車沒有商品</td></tr>`;
  }

  cartList.innerHTML = list;
  totalPrice.innerHTML = `NT$${cartData.finalTotal || 0}`;

  isLoading(false);

  cartCard = document.querySelectorAll(".cartCard");
  quantity = document.querySelectorAll(".quantity");
  counterDown = document.querySelectorAll(".counterDown");
  discardBtn = document.querySelectorAll(".discardBtn");

  cartCard.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.matches(".counterDown")) {
        updateQty(index + 8, -1);
        if (cartData.carts[index].quantity > 1) {
          editCartItem(
            cartData.carts[index].id,
            cartData.carts[index].quantity - 1
          );
        } else {
          deleteCartItem(
            cartData.carts[index].id,
            cartData.carts[index].product.title
          );
        }
      }
      if (e.target.matches(".counterUp"))
        editCartItem(
          cartData.carts[index].id,
          cartData.carts[index].quantity + 1
        );
      if (e.target.matches(".discardItem"))
        deleteCartItem(
          cartData.carts[index].id,
          cartData.carts[index].product.title
        );
    });
    item.addEventListener("change", (e) => {
      if (e.target.matches(".quantity")) updateQty(index + 8, 0);
    });
  });
}

function updateQty(index, change) {
  quantity[index].value = Math.max(1, +quantity[index].value + change);
  counterDown[index].disabled = quantity[index].value <= 1;
}

function checkOrderInfo() {
  errorMsg[0].textContent =
    validate({ name: orderInfo.name }, rule)?.name ?? "";
  errorMsg[1].textContent = validate({ tel: orderInfo.tel }, rule)?.tel ?? "";
  errorMsg[2].textContent =
    validate({ email: orderInfo.email }, rule)?.email ?? "";
  errorMsg[3].textContent =
    validate({ address: orderInfo.address }, rule)?.address ?? "";
  isPass = Array.from(errorMsg).every((item) => item.textContent == "");
}

function init() {
  getProductList();
  getCartList();
}

init();
