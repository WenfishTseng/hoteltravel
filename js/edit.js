import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";
// 分頁面
import pagination from "./pagination.js";
//dom
let productModal = "";
let delProductModal = "";
//變數
const site = "https://vue3-course-api.hexschool.io/v2";
const api_path = "yuritatest";

const appRoot = createApp({
  data() {
    return {
      //api
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yuritatest",
      coupons: [],
      products: [],
      tempProduct: { imageUrl: [] },
      isNew: false,
      // page
      pagination: {},
      // 尚未完成
      couponData: {
        title: "超級特惠價格",
        is_enabled: 1,
        percent: 80,
        due_date: 1555459200,
        code: "testCode",
      },
    };
  },
  components: { pagination },
  methods: {
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
          this.getCouponData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = "index.html";
        });
    },
    // 改成串接分頁API
    getData(page = 1) {
      // 預設第1頁
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
        .then((response) => {
          if (response.data.success) {
            this.products = response.data.products;
            this.pagination = response.data.pagination;
            console.log(response.data);
          }
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    openProductModal(openState, item) {
      switch (openState) {
        case "edit":
          productModal.show();
          this.tempProduct = JSON.parse(JSON.stringify(item));
          this.isNew = false;
          break;
        case "add":
          this.tempProduct = {};
          productModal.show();
          this.isNew = true;
          break;
        case "delete":
          this.tempProduct = JSON.parse(JSON.stringify(item));
          delProductModal.show();
          break;
      }
    },
    addCoupon() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/coupon`;
      const coupon = this.couponData;
      axios
        .post(url, { data: coupon })
        .then((response) => {
          this.getCouponData();
          this.couponData = {};
          alert(response.data.message);
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    // coupon
    getCouponData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/coupons`)
        .then((response) => {
          if (response.data.success) {
            this.coupons = response.data.coupons;
          }
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    closeProductModal() {
      productModal.hide();
      this.tempProduct = {};
    },
    closeDeleteModal() {
      delProductModal.hide();
      this.tempProduct = {};
    },
  },
  mounted() {
    // 抓token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // post headers 放 token
    axios.defaults.headers.common["Authorization"] = token;
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
    // 確認身分
    this.checkAdmin();
  },
});

appRoot.component("edit-modal", {
  props: ["tempProduct", "isNew"],
  template: "#edit-template",
  methods: {
    editProduct() {
      let url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      let method = "put";
      if (this.isNew) {
        url = `${site}/api/${api_path}/admin/product`;
        method = "post";
      }
      axios[method](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          this.$emit("get-data");
          productModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
          productModal.hide();
        });
    },
    closeProductModal() {
      productModal.hide();
    },
  },
});

appRoot.component("delete-modal", {
  template: "#delete-template",
  props: ["tempProduct"],
  methods: {
    deleteProduct() {
      const url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          this.$emit("get-data");
          delProductModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    closeDeleteModal() {
      delProductModal.hide();
    },
  },
});

appRoot.mount("#app");
