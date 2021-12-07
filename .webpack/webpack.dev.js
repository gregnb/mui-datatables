const path = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackCommon = require('./webpack.base');
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

module.exports = (env, argv) => {
const baseConfig = webpackCommon(env, argv, { SRC_DIR, DIST_DIR });

return merge(baseConfig, {
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: '../core/*',
					to: './../../../node_modules/@omega-ui/core',
				}
			],
		}),
	]
});
};
