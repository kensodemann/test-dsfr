import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'test-dsfr',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      dir: 'components',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: 'global.css',
          dest: 'global.css'
        }
      ]
    },
  ],
  globalScript: 'src/global.ts',
};
