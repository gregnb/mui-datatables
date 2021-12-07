const path = require('path');

// https://babeljs.io/docs/en/options#babelrcroots
module.exports = {
	babelrcRoots: ["./app/*"],
	plugins: ["inline-react-svg", "@babel/plugin-proposal-class-properties", "dynamic-import-node"],
	env: {
		test: {
			presets: [
				[
					// TODO: https://babeljs.io/blog/2019/03/19/7.4.0#migration-from-core-js-2
					"@babel/preset-env",
					{
						targets: {
							node: "current",
						},
						modules: "auto",
						debug: false,
					},
				],
				"@babel/preset-react",
			],
			plugins: [
				"@babel/plugin-proposal-object-rest-spread",
				"@babel/plugin-syntax-dynamic-import",
				"@babel/plugin-transform-regenerator",
				"@babel/plugin-transform-runtime",
				"@babel/plugin-transform-modules-umd",
				"dynamic-import-node",
			]
		},
		production: {
			presets: [
				// WebPack handles ES6 --> Target Syntax
				["@babel/preset-env", { modules: false }],
				"@babel/preset-react",
			],
			ignore: [
				"**/*.test.jsx",
				"**/*.test.js",
				"__snapshots__",
				"__tests__",
			],
		},
		development: {
			presets: [
				// WebPack handles ES6 --> Target Syntax
				["@babel/preset-env", { modules: false }],
				"@babel/preset-react",
				
			],
			plugins: [
				"react-hot-loader/babel",
				"@babel/plugin-transform-runtime",
				"dynamic-import-node"
			],
			ignore: [
				"**/*.test.jsx",
				"**/*.test.js",
				"__snapshots__",
				"__tests__",
			],
		},
	},
};