export const apiUrl = "http://localhost:8000/api";

export const adminToken = () => {
  const data = JSON.parse(localStorage.getItem("adminInfo"));
  return data.token;
};

export const userToken = () => {
  const data = JSON.parse(localStorage.getItem("userInfo"));
  return data.token;
};

export const STRIPE_PUBLIC_KEY =
  "pk_test_51S22R7CXaf7naFey6hRMxeoM1XDb4uidqcfpt9Mj4OZa0eXpnrLHuatIVV8ifUZNKzVTx0MmHlQqcIv1LubdeTji00X0YdIiv1";
