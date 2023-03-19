import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Tools',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Home',
      path: '/home',
      component: './Home',
    },
    {
      name: 'C/C++',
      path: '/c',
      routes: [
        {
          name: 'autotools',
          path: 'autotools',
          component: './c/autotools',
        },
      ],
    },
    {
      name: 'common',
      path: '/common',
      routes: [
        {
          name: 'converter',
          path: 'converter',
          component: './common/converter',
        }
      ],
    }
  ],
  history: {
    type: 'hash',
  },
  npmClient: 'pnpm',
});
