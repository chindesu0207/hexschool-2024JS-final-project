const fakeData = [
  {
    name: "嚴瀾育",
    tel: "0987-301-715",
    email: "julie5900@gmail.com",
    address: "宜蘭縣冬山鄉九分路24號之19",
    payment: "ATM",
  },
  {
    name: "蘇偲靜",
    tel: "0923-592-924",
    email: "becca6367@icloud.com",
    address: "雲林縣北港鎮中庄90號",
    payment: "信用卡",
  },
  {
    name: "馮峯諄",
    tel: "0934-266-343",
    email: "campbell8763@gmail.com",
    address: "嘉義縣水上鄉檳榔樹角76號",
    payment: "ATM",
  },
  {
    name: "王培瑗",
    tel: "0989-581-798",
    email: "teller2469@yahoo.com",
    address: "嘉義縣梅山鄉大樹2號",
    payment: "超商付款",
  },
  {
    name: "劉晟楚",
    tel: "0913-904-356",
    email: "doohan8608@gmail.com",
    address: "苗栗縣頭屋鄉二湖97號11樓",
    payment: "ATM",
  },
  {
    name: "陳泓雲",
    tel: "0926-575-647",
    email: "anthony1238@gmail.com",
    address: "臺北市中正區廣州街20號",
    payment: "超商付款",
  },
  {
    name: "游彥顏",
    tel: "0972-192-454",
    email: "phillips972@gmail.com",
    address: "新竹縣竹北市港安街1段19號",
    payment: "信用卡",
  },
  {
    name: "袁辰雷",
    tel: "0968-510-053",
    email: "leonard4810@gmail.com",
    address: "南投縣草屯鎮太平路2段48號",
    payment: "ATM",
  },
  {
    name: "汪凝沐",
    tel: "0927-261-735",
    email: "mitchell3181@yahoo.com",
    address: "臺南市善化區環東路2段74號",
    payment: "信用卡",
  },
  {
    name: "林漢瓊",
    tel: "0928-477-206",
    email: "nguyen1525@outlook.com",
    address: "彰化縣社頭鄉員集路4段68號之5",
    payment: "超商付款",
  },
];

async function randomCartList(times) {
  for (let i = 0; i < times; i++) {
    await addCartItem(
      productData[Math.floor(Math.random() * 8)].id,
      Math.floor(Math.random() * 5) + 1
    );
  }
}

function fillOrderInfo() {
  randomOrderInfo();
  let input = orderInfoForm.querySelectorAll("input, select");
  input[0].value = orderInfo.name;
  input[1].value = orderInfo.tel;
  input[2].value = orderInfo.email;
  input[3].value = orderInfo.address;
  input[4].value = orderInfo.payment;
}

function randomOrderInfo() {
  let randomData = fakeData[Math.floor(Math.random() * 10)];
  orderInfo = { ...randomData };
}