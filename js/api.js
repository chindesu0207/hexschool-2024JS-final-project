const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
// 取得產品列表
async function getProductList() {
  try {
    let res = await axios.get(`${customerUrl}/products`);
    productData = res.data.products;
    renderProducts();
  } catch (error) {
    console.log(error.response.data);
  }
}

// 取得購物車列表
async function getCartList() {
  isLoading(true);
  try {
    let res = await axios.get(`${customerUrl}/carts`);
    cartData = res.data;
    renderCartList();
  } catch (error) {
    console.log(error.response.data);
  }
}

// 加入購物車
async function addCartItem(id, qty) {
  isLoading(true);
  //判斷商品是否已存在，若存在則加上原本已在購物車的數量
  if (Array.isArray(cartData?.carts) && cartData.carts.length > 0){
    let targetItem = cartData.carts.find((item) => item.product.id == id);
    qty = targetItem == undefined ? +qty : +qty + targetItem.quantity;
  }
  try {
    let res = await axios.post(`${customerUrl}/carts`, {
      data: {
        productId: id,
        quantity: +qty,
      },
    });
    cartData = res.data;
    renderCartList();
    Toast.fire({
      icon: "success",
      title: "商品已加入購物車",
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

// 編輯購物車品項數量
async function editCartItem(cartId, qty) {
  isLoading(true);
  try {
    let res = await axios.patch(`${customerUrl}/carts`, {
      data: {
        id: cartId,
        quantity: +qty,
      },
    });
    cartData = res.data;
    renderCartList();
  } catch (error) {
    console.log(error.response.data);
  }
}

// 清除購物車內全部產品
async function deleteAllCartList() {
  if (!Array.isArray(cartData?.carts) || cartData.carts.length == 0)
    return Swal.fire({
      icon: "error",
      title: "購物車內目前沒有商品!",
    });
  let result = await Swal.fire({
    title: "您確定要移除所有品項嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  });
  if (result.isConfirmed) {
    isLoading(true);
    try {
      let res = await axios.delete(`${customerUrl}/carts`);
      cartData = res.data;
      renderCartList();
      Swal.fire({
        title: "購物車產品已經全部清空!",
        icon: "success",
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }
}

// 刪除購物車內特定產品
async function deleteCartItem(cartId, title) {
  let result = await Swal.fire({
    title: `${title}`,
    text: "您確定要刪除這個商品嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  });
  if (result.isConfirmed) {
    isLoading(true);
    try {
      let res = await axios.delete(
        `${customerUrl}/carts/${cartId}`
      );
      cartData = res.data;
      renderCartList();
      Swal.fire({
        title: `${title}`,
        text: "已經被刪除!",
        icon: "success",
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }
}

// 送出購買訂單
async function createOrder() {
  if (!Array.isArray(cartData?.carts) || cartData.carts.length == 0)
    return Swal.fire({
      icon: "error",
      title: "購物車內目前沒有商品!",
    });
  checkOrderInfo();
  if (isPass) {
    isLoading(true);
    try {
      let res = await axios.post(`${customerUrl}/orders`, {
        data: {
          user: orderInfo,
        },
      });
      orderInfoForm.reset();
      isPass = false;
      cartData = {};
      category = "全部";
      productSelect.value = "全部";
      orderInfo = {
        name: "",
        tel: "",
        email: "",
        address: "",
        payment: "ATM",
      }
      renderProducts();
      renderCartList();
    } catch (error) {
      console.log(error.response.data);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "請填寫完整訂購資料!",
    });
  }
}

// 取得訂單
async function getOrderList() {
  isLoading(true);
  try {
    let res = await axios.get(`${adminUrl}/orders`, headers);
    orderData = res.data.orders;
    renderOrderList();
  } catch (error) {
    console.log(error.response.data);
  }
}

// 修改訂單狀態
async function editOrderList(orderId, paid) {
  isLoading(true);
  try {
    let res = await axios.put(
      `${adminUrl}/orders`,
      {
        data: {
          id: orderId,
          paid: !paid,
        },
      },
      headers
    );
    orderData = res.data.orders;
    renderOrderList();
    Toast.fire({
      icon: "success",
      title: `訂單狀態已修改為${!paid ? "已處理" : "未處理"}`,
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

// 刪除全部訂單
async function deleteAllOrder() {
  if (orderData.length == 0)
    return Swal.fire({
      icon: "error",
      title: "目前沒有訂單資料!",
    });
  let result = await Swal.fire({
    title: "是否要刪除全部訂單?",
    text: "一但刪除後，訂單資料將無法復原!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  });
  if (result.isConfirmed) {
    isLoading(true);
    try {
      let res = await axios.delete(
        `${adminUrl}/orders`,
        headers
      );
      Swal.fire({
        title: "刪除成功!",
        text: "已清除所有訂單資料",
        icon: "success",
        timer: 1500,
      });
      orderData = res.data.orders;
      countData = {};
      renderOrderList();
    } catch (error) {
      console.log(error.response.data);
    }
  }
}

// 刪除特定訂單
async function deleteOrderItem(orderId) {
  let result = await Swal.fire({
    title: `${orderId}`,
    text: "是否要刪除此訂單",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  });
  if (result.isConfirmed) {
    isLoading(true);
    try {
      let res = await axios.delete(
        `${adminUrl}/orders/${orderId}`,
        headers
      );
      orderData = res.data.orders;
      renderOrderList();
      Swal.fire({
        title: "訂單已刪除!",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }
}
