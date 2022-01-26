import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

createApp({
  data() {
    return {
      //api
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      //admin
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const url = `${this.apiUrl}/admin/signin`;
      axios.post(url, this.user).then((response) => {
        const { token, expired } = response.data;
        // 存cookie
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        // 跳轉頁面
        window.location = "edit-page.html";
      });
    },
    checkAdmin() {
      // 取得token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      // post 傳 headers
      axios.defaults.headers.common["Authorization"] = token;
      // 串api
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          window.location = "edit-page.html";
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
  mounted() {
    // 下次登入確認cookie
    this.checkAdmin();
  },
}).mount("#app");
