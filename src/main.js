import '@/assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import components from '@lob/ui-components';
import '@lob/ui-components/dist/ui-components.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(components);

app.mount('#app');
