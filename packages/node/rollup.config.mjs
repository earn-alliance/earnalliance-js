import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [typescript(), autoExternal(), resolve(), commonjs(), terser()],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
    },
    plugins: [typescript(), autoExternal(), resolve(), terser()],
  },
];
