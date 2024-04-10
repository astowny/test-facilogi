<template>
  <form
    class="login__card rounded-lg m-auto shadow-2xl w-[32rem] h-[32rem] bg-white p-10 flex flex-col items-stretch justify-between"
    @submit.prevent="submit"
  >
    <h1 class="pb-6 text-2xl font-bold">Connectez-vous à votre compte</h1>

    <div class="text-left">
      <label for="email">Email</label>
      <input
        v-model="email"
        name="email"
        id="email"
        class="w-full border border-gray-300 rounded h-10"
        type="text"
      />
    </div>

    <div class="text-left">
      <div class="flex justify-between">
        <label for="password">Mot de passe</label>
        <span
          class="text-orange-600 text-sm cursor-pointer"
          @click="toggleShowPassword"
          >Afficher le mot de passe</span
        >
      </div>
      <input
        v-model="password"
        class="w-full border border-gray-300 rounded h-10"
        id="password"
        name="password"
        :type="showPassword ? 'text' : 'password'"
      />
    </div>

    <button
      class="login__btn w-full rounded py-2 h-12 text-white"
      :class="{ 'opacity-60': loginBtnDisabled }"
      @click="submit"
    >
      {{ submitLoading ? "Chargement " : "Se connecter" }}
    </button>
    <p class="text-left text-sm">Mot de passe oublié</p>

    <p class="">
      Vous n'avez pas de compte ?
      <button class="text-orange-600">Créer un comtpe</button>
    </p>
  </form>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { createHttpClient } from "@/api/httpClientAxios";
import { useUserStore } from "@/store/user/userStore";

const httpClient = createHttpClient();
const userStore = useUserStore();
const jwtToken = useStorage("jwtToken");
const jwtRefreshToken = useStorage("jwtRefreshToken");
const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const submitLoading = ref(false);
const errorMessage = ref("");
const isValidForm = computed(() => email.value && password.value);
const loginBtnDisabled = computed(
  () => !isValidForm.value || submitLoading.value
);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const submit = async () => {
  if (submitLoading.value) {
    return;
  }
  submitLoading.value = true;
  errorMessage.value = "";
  try {
    const form = new FormData();
    form.append("email", email.value);
    form.append("password", password.value);

    const response = await httpClient.post("/login-check", form);

    userStore.updateUser(response.data);

    // To set the tokens
    jwtToken.value = response.data.token;
    jwtRefreshToken.value = response.data.refreshToken;

    await router.push({ name: "contact-list" });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("error login invalid creds", error);
    } else {
      console.log("error login", error);
    }
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};
</script>
<style scoped>
.login__btn {
  background: linear-gradient(90deg, #ff8c00 0, #f55b23);
}
</style>
