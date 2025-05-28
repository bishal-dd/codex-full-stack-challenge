import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { rimraf } from 'rimraf';
import { parseArgs } from 'util';

async function main() {
  await rimraf('dist');

  const { values } = parseArgs({
    options: {
      watch: {
        type: 'boolean',
        short: 'w',
      },
    },
  });

  /** @type {import('esbuild').BuildOptions} */
  const config = {
    outdir: 'dist',
    outbase: 'src', // ensures the path to handler is identical in dist
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
    packages: 'bundle',
    entryPoints: ['src/**/*.ts'],
    plugins: [nodeExternalsPlugin({ dependencies: false })],
  };

  if (values.watch) {
    /** @type {import('esbuild').Plugin} */
    let printPlugin = {
      name: 'print',
      setup({ onStart, onEnd }) {
        let started = Date.now();
        onStart(() => {
          started = Date.now();
          console.info('Building');
        });
        onEnd(b => {
          if (!b.errors.length) {
            console.info(`Finished building in ${Date.now() - started} milliseconds`);
          }
        });
      },
    };

    const ctx = await esbuild.context({ ...config, plugins: [printPlugin, ...config.plugins] });
    await ctx.watch();
  } else {
    await esbuild.build(config);
  }
}

await main();
