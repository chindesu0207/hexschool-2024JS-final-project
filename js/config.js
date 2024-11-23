const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1";
const apiPath = "tatsu";
const token = "qAqFAv6yjqW3YExAtDVDYByuzF33";

const customerUrl = baseUrl + "/customer/" + apiPath;
const adminUrl = baseUrl + "/admin/" + apiPath;

const headers = {
  headers: {
    Authorization: token,
  },
};