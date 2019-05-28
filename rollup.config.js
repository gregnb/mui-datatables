import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";

export default {
  input: 'src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    commonjs({
      include: [
        'node_modules/**'
      ]
    }),
    babel({
      "presets": [
        "react",
        ["env", {
          "targets": {
            "browsers": ["last 2 versions", "ie >= 10"]
          },
          "debug": false,
          "modules": false
        }]
      ],
      "plugins": [
        "external-helpers",
        "transform-object-rest-spread",
        "babel-plugin-transform-class-properties",
        "transform-react-remove-prop-types"
      ],
      babelrc: false
    }),
    uglify({
      compress: {
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      }
    })
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'named'
  },
  sourcemap: true
};
