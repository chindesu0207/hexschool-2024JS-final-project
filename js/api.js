const api_path = "tatsu";
const token = "qAqFAv6yjqW3YExAtDVDYByuzF33";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      renderProducts();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 取得購物車列表
function getCartList() {
  isLoading(true);
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      cartData = response.data;
      renderCartList();
    });
}

// 加入購物車
function addCartItem(id, qty) {
  isLoading(true);
  //判斷商品是否已存在，若存在則加上原本已在購物車的數量
  let index =
    cartData.carts == undefined
      ? -1
      : cartData.carts.findIndex((item) => item.product.id == id);
  if (index >= 0) qty = +qty + cartData.carts[index].quantity;
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: +qty,
        },
      }
    )
    .then(function (response) {
      cartData = response.data;
      renderCartList();
      Toast.fire({
        icon: "success",
        title: "商品已加入購物車"
      });
    });
}

// 編輯購物車品項數量
function editCartItem(cartId, qty) {
  isLoading(true);
  axios
    .patch(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          id: cartId,
          quantity: +qty,
        },
      }
    )
    .then(function (response) {
      cartData = response.data;
      renderCartList();
    });
}

// 清除購物車內全部產品
function deleteAllCartList() {
  if (cartData.carts.length == 0 || cartData.carts == undefined)
    return Swal.fire({
      icon: "error",
      title: "購物車內目前沒有商品!",
    });
  Swal.fire({
    title: "您確定要移除所有品項嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading(true);
      axios
        .delete(
          `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
        )
        .then(function (response) {
          if (response.data.status) {
            cartData = response.data;
            renderCartList();
            Swal.fire({
              title: "購物車產品已經全部清空!",
              icon: "success",
            });
          }
        });
    }
  });
}

// 刪除購物車內特定產品
function deleteCartItem(cartId, title) {
  Swal.fire({
    title: `${title}`,
    text: "您確定要刪除這個商品嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading(true);
      axios
        .delete(
          `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
        )
        .then(function (response) {
          cartData = response.data;
          renderCartList();
          Swal.fire({
            title: `${title}`,
            text: "已經被刪除!",
            icon: "success",
          });
        });
    }
  });
}

// 送出購買訂單
function createOrder() {
  if (cartData.carts.length == 0 || cartData.carts == undefined)
    return Swal.fire({
      icon: "error",
      title: "購物車內目前沒有商品!",
    });
  checkOrderInfo();
  if (isPass) {
    isLoading(true);
    axios
      .post(
        `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
        {
          data: {
            user: orderInfo,
          },
        }
      )
      .then(function (response) {
        if (response.data.status) {
          orderInfoForm.reset();
          isPass = false;
          cartData = [];
          renderCartList();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "請填寫完整訂購資料!",
    });
  }
}

// 取得訂單
function getOrderList() {
  isLoading(true)
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      orderData = response.data.orders;
      renderOrderList();
    });
}

// 修改訂單狀態
function editOrderList(orderId, paid) {
  isLoading(true);
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: orderId,
          paid: !paid,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      orderData = response.data.orders;
      renderOrderList();
      Toast.fire({
        icon: "success",
        title: `訂單狀態已修改為${!paid ? "已處理" : "未處理"}`
      });
    });
}

// 刪除全部訂單
function deleteAllOrder() {
  if (Object.keys(chartData).length == 0)
    return Swal.fire({
      icon: "error",
      title: "目前沒有訂單資料!",
    });
  Swal.fire({
    title: "是否要刪除全部訂單?",
    text: "一但刪除後，訂單資料將無法復原!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading(true)
      axios
        .delete(
          `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(function (response) {
          Swal.fire({
            title: "刪除成功!",
            text: "已清除所有訂單資料",
            icon: "success",
            timer: 1500,
          });
          orderData = response.data.orders;
          countData = {};
          renderOrderList();
        });
    }
  });
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  Swal.fire({
    title: `${orderId}`,
    text: "是否要刪除此訂單",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading(true);
      axios
        .delete(
          `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(function (response) {
          orderData = response.data.orders;
          renderOrderList();
        });
      Swal.fire({
        title: "訂單已刪除!",
        icon: "success",
        timer: 1500,
      });
    }
  });
}