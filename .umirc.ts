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
          name: 'time',
          path: 'time',
          component: './common/time',
        },
        {
          name: 'decode/encode',
          path: 'converter',
          component: './common/converter',
        },
        {
          name: 'generator',
          path: 'generator',
          component: './common/generator',
        },
        {
          name: 'qrcode',
          path: 'qrcode',
          component: './common/qrcode',
        },
      ],
    },
    {
      name: 'about',
      path: '/about',
      component: './about',
    },
  ],
  history: {
    type: 'hash',
  },
  npmClient: 'pnpm',
});
