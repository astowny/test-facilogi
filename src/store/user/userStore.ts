import { ref } from "vue";
import { defineStore } from "pinia";
import { User, UserJwtPayload } from "@/store/user/userStore.d";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { ApiResponse } from "@/api/api";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = useStorage("user", {} as User | undefined | null);
  const isLogged = ref(false);
  const router = useRouter();

  const updateUser = (userData: User) => {
    user.value = userData;
  };

  const init = () => {
    const token = user.value?.token;
    if (token) {
      const decoded = jwtDecode<UserJwtPayload>(token);
      const expirationDate = dayjs.unix(decoded.exp);
      if (dayjs().isBefore(expirationDate)) {
        isLogged.value = true;
      } else {
        refreshToken();
      }
    }
  };

  const refreshToken = async () => {
    const client = axios.create({
      baseURL: "https://qualif.prospeneo.io/",
      timeout: 10000,
    });
    const response = await client.post("/refresh-token", {
      refreshToken: user.value?.refresh_token,
    });
    handleLoginResponse({
      status: response.status,
      data: response.data,
    } as ApiResponse<any>);
  };

  const handleLoginResponse = (response: ApiResponse<any>) => {
    if (response.status === 200) {
      user.value!.token = response.data.token;
      isLogged.value = true;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
    isLogged.value = false;
    router.push({ name: "login" });
  };

  return {
    user,
    isLogged,
    init,
    refreshToken,
    handleLoginResponse,
    logout,
    updateUser,
  };
});
