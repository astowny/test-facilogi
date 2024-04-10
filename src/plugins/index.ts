/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import i18n from "@/plugins/i18n";
import pinia from "@/store";
import router from "@/router";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

// Types
import type { App } from "vue";

const vuetify = createVuetify();
export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(i18n);
}
