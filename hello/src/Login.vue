<template>
  <div class="login-box">
    <form>
      <div class="user-box">
        <input
          type="text"
          name="username"
          required=""
          autofocus
          v-model="username"
        />
        <label>Username</label>
      </div>
      <div class="user-box">
        <input type="password" name="pass" required="" v-model="pass" />
        <label>Password</label>
      </div>
      <span @click="login">
        登录
        <span></span> </span
      >
      <span @click="back">
       返回
        <span></span> </span
      >
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const username = ref("");
    const pass = ref("");
    const login = () => {
      if (username.value == "a" && pass.value == "a") {
        // 如果验证通过，可以跳转到主页
        router.push({ name: "Home" });
      }
    };
    const back = () => {
      router.push({ name: "Guest" });
    };
    return {
      login,
      back,
      pass,
      username,
    };
  },
});
</script>

<style scoped>
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(24, 20, 20, 0.987);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #bdb8b8;
  font-size: 12px;
}

.login-box form span {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
  /* text-align:center */
}

.login-box span:hover {
  background: #03f40f;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03f40f, 0 0 25px #03f40f, 0 0 50px #03f40f,
    0 0 100px #03f40f;
}

.login-box span span {
  position: absolute;
  display: block;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.login-box span span:nth-child(1) {
  bottom: 2px;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03f40f);
  animation: btn-anim1 2s linear infinite;
}

</style>
