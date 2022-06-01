/* eslint-disable promise/always-return */
/* eslint-disable no-console */

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import esbuild from 'esbuild'

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    // format: 'esm',
    loader: {
      '.graphql': 'text',
      '.sql': 'text',
      '.ts': 'ts',
    },
    metafile: true,
    minify: true,
    outfile: 'out/index.cjs',
    platform: 'node',
    plugins: [pnpPlugin()],
    target: ['node18'],
  })
  .then((result) => {
    const outputs = result.metafile.outputs
    for (const output in outputs) {
      console.log(`  ${output}: ${(outputs[output].bytes / 1_000_000).toFixed(2)} MB`)
    }
  })
  .catch((error) => {
    throw new Error(error)
  })
