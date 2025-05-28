import { createPinia } from 'pinia';
import { createApp } from 'vue';

import 'leaflet/dist/leaflet.css';
import 'vue-map-ui/dist/style.css';
import 'vue-map-ui/dist/theme-all.css';
import App from './App.vue';
import './assets/index.css';
import './assets/normalize.css';
import router from './router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(autoAnimatePlugin);
app.use(VueQueryPlugin, { queryClientConfig: { defaultOptions: { queries: { staleTime: Infinity } } } });

app.mount('#app');
