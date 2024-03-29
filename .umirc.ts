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
      name: 'Github Actions',
      path: '/github-actions',
      routes: [
        {
          name: 'Check flutter library add to new project',
          path: 'check-library-add-to-new-project',
          component:
            './github-actions/flutter/check-library-add-to-new-project',
        },
        {
          name: 'Build flutter example apk for github release',
          path: 'build-example-apk',
          component: './github-actions/flutter/build-example-apk',
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
          name: 'hash',
          path: 'hash',
          component: './common/hash',
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
        {
          name: 'file-size',
          path: 'file-size',
          component: './common/file-size',
        }
      ],
    },
    {
      name: 'network',
      path: '/network',
      routes: [
        {
          name: 'http',
          path: 'http',
          routes: [
            {
              name: 'url',
              path: 'url',
              component: './network/http/url',
            },
          ],
        },
      ],
    },
    {
      name: 'number',
      path: '/number',
      routes: [
        {
          name: 'uleb128',
          path: 'uleb128',
          component: './number/uleb128',
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
