import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import env from "rollup-plugin-env";

export default {
  input: 'src/index.js',
  plugins: [
    env({ NODE_ENV: "production" }),
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
        warnings: false,
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
    file: 'lib/index.js',
    format: 'cjs'
  },
  sourcemap: true
};
