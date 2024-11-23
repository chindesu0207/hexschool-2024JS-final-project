const orderList = document.querySelector(".orderList");
let paidToggle = document.querySelectorAll(".orderStatus a");
let deleteOrderBtn = document.querySelectorAll(".delSingleOrder-Btn");
const discardAllBtn = document.querySelector(".discardAllBtn");

let orderData = [];
let countData = {};
let othersCounts = 0;
let chartData = [];

discardAllBtn.addEventListener("click", () => deleteAllOrder());

function renderOrderList() {
  let list = ``;
  if (orderData.length != 0) {
    orderData.forEach((order) => {
      let productList = ``
      order.products.forEach(item=> productList+= `<p>${item.title} * ${item.quantity}</p>`)
      list += `<tr>
              <td>${order.id}</td>
              <td>
                <p>${order.user.name}</p>
                <p>${order.user.tel}</p>
              </td>
              <td>${order.user.address}</td>
              <td>${order.user.email}</td>
              <td>${productList}</td>
              <td>${dayjs(order.createdAt * 1000).format("YYYY/MM/DD")}</td>
              <td class="orderStatus">
                <a href="#">${order.paid ? "已處理" : "未處理"}</a>
              </td>
              <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除" />
              </td>
            </tr>`;
    });
  } else
    list = `<tr><td colspan="8" style="text-align:center">目前沒有訂單資料</td></tr>`;
  orderList.innerHTML = list;
  calculate();
  paidToggle = document.querySelectorAll(".orderStatus a");
  paidToggle.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      editOrderList(orderData[index].id, orderData[index].paid);
    });
  });
  deleteOrderBtn = document.querySelectorAll(".delSingleOrder-Btn");
  deleteOrderBtn.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      deleteOrderItem(orderData[index].id);
    });
  });
}

function generateChart(data) {
  if (chartData.length == 0) {
    document.querySelector("#chart").innerHTML =
      '<div class="noChartData">目前沒有訂單資料</div>';
  } else {
    let chart = c3.generate({
      bindto: "#chart",
      data: {
        type: "pie",
        columns: [...data],
      },
      color: { pattern: ["#5434A7", "#9D7FEA", "#DACBFF", "#301E5F"] },
    });
  }
  isLoading(false);
}

function calculate() {
  orderData.forEach((order) => {
    order.products.forEach((item) =>
      countData[item.title] == undefined
        ? (countData[item.title] = item.price * item.quantity)
        : (countData[item.title] += item.price * item.quantity)
    );
  });
  let sortData = Object.entries(countData).sort(
    ([, valueA], [, valueB]) => valueB - valueA
  );
  let others = sortData.splice(3);
  othersTotal = others.reduce((total, item) => total + item[1], 0);

  chartData = sortData;
  othersTotal > 0 ? chartData.push(["其他", othersTotal]) : "";

  generateChart(chartData);
}

getOrderList();
