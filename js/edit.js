import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";
//dom
let productModal = "";
let delProductModal = "";

const app = {
  data() {
    return {
      //api
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yuritatest",
      coupons: [],
      products: [],
      tempProduct: {},
      isNew: false,
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
  methods: {
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = "index.html";
        });
    },
    getData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
        .then((response) => {
          if (response.data.success) {
            this.products = Object.values(response.data.products);
          }
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    editProduct() {
      this.tempProduct = JSON.parse(JSON.stringify(this.tempProduct));
      if (this.isNew) {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        axios
          .post(url, { data: this.tempProduct })
          .then((response) => {
            this.getData();
            this.closeProductModal();
            alert(response.data.message);
          })
          .catch((error) => {
            alert(error.data.message);
          });
      } else {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        axios
          .put(url, { data: this.tempProduct })
          .then((response) => {
            this.getData();
            this.closeProductModal();
            alert(response.data.message);
          })
          .catch((error) => {
            alert(error.data.message);
          });
      }
    },
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((response) => {
          this.getData();
          this.closeDeleteModal();
          alert(response.data.message);
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    openProductModal(openState, item) {
      switch (openState) {
        case "edit":
          productModal.show();
          this.tempProduct = item;
          this.isNew = false;
          break;
        case "add":
          productModal.show();
          this.isNew = true;
          break;
        case "delete":
          this.tempProduct = item;
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
    this.getCouponData();
  },
};

createApp(app).mount("#app");
