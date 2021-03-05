import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: 'src/Cache.ts',
        plugins: [
            typescript({tsconfig: "tsconfig.app.json"}),
            nodeResolve(),
            commonjs(),
            // terser(),
            babel({
                extensions: ['.js', '.ts'],
            }),
            uglify({mangle: true}),
        ],
        output: {
            file: 'dist/goodcache.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        },
        context: 'this',
    },
];