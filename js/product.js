import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

createApp({
  data() {
    return {
      text: "123 product",
      //api
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yuritatest",
      //產品
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    checkAdmin() {
      console.log("checkAdmin");
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          console.log("checkAdmin", error);
          window.location = "index.html";
        });
    },
    getData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
        .then((response) => {
          console.log("getData", response.data);
          if (response.data.success) this.products = response.data.products;
        })
        .catch((error) => {
          console.log("getData", error);
        });
    },
  },
  created() {
    // 抓token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // post headers 放 token
    axios.defaults.headers.common["Authorization"] = token;
    // 確認身分
    this.checkAdmin();
  },
}).mount("#app");
