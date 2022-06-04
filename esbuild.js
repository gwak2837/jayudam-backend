/* eslint-disable promise/always-return */
/* eslint-disable no-console */

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import esbuild from 'esbuild'

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    loader: {
      '.graphql': 'text',
      '.sql': 'text',
      '.ts': 'ts',
    },
    metafile: true,
    minify: process.env.NODE_ENV === 'production',
    outfile: 'out/index.cjs',
    platform: 'node',
    plugins: [pnpPlugin()],
    target: ['node18'],
    treeShaking: true,
    watch: process.env.NODE_ENV === 'development' && {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error)
        } else {
          showOutfilesSize(result)
        }
      },
    },
  })
  .then((result) => showOutfilesSize(result))
  .catch((error) => {
    throw new Error(error)
  })

function showOutfilesSize(result) {
  const outputs = result.metafile.outputs
  for (const output in outputs) {
    console.log(`${output}: ${(outputs[output].bytes / 1_000_000).toFixed(2)} MB`)
  }
}
