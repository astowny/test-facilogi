import axios, { AxiosInstance } from "axios";
import { useUserStore } from "@/store/user/userStore";
const baseURL = "https://qualif.prospeneo.io/";

const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
  });

  client.interceptors.request.use(
    (config) => {
      const userStore = useUserStore();
      const access_token = userStore.user?.token;

      if (access_token && config.url !== "/refresh-token") {
        const authorizationHeader = `${access_token}`;
        config.headers.set("Authorization", authorizationHeader);
      }
      if (config.method === "post" && !config.headers.has("Content-Type")) {
        config.headers.set("Content-Type", "multipart/form-data");
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        401 === error.response?.status &&
        !["/refresh-token", "/login-check", "/auth/temp-token"].includes(
          error.config.url || ""
        )
      ) {
        const userStore = useUserStore();
        await userStore.refreshToken();
        // redo the request
        return client.request(error.config);
      }
      return Promise.reject(error);
    }
  );
  return client;
};

export { createHttpClient };
