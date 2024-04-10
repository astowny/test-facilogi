import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
// import { useUserStore } from "@/store/user/userStore";

window.addEventListener("unhandledrejection", (event) => {
  if (event.reason && event.reason.isAxiosError) {
    console.error("An error occurred");
  }
});

const createHttpClient = (baseURL?: string): AxiosInstance => {
  baseURL = baseURL
    ? "https://qualif.prospeneo.io/" + baseURL
    : "https://qualif.prospeneo.io/";

  const client: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
  });

  // client;
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // const userStore = useUserStore();
      const access_token = "q"; // userStore.user?.token;
      if (access_token && config.url !== "/refresh-token") {
        const authorizationHeader = `${access_token}`;
        config.headers.set("Authorization", authorizationHeader);
      }
      if (config.method === "post" && !config.headers.has("Content-Type")) {
        config.headers.set("Content-Type", "multipart/form-data");
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // client.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     const userStore = useUserStore();

  //     if (
  //       401 === error.response?.status &&
  //       !["/refresh-token", "/login-check"].includes(error.config.url || "")
  //     ) {
  //       await userStore.refreshToken();
  //       // redo the request
  //       return client.request(error.config);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  return client;
};

export default createHttpClient;
