const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
    entry: "./src/index.js",
    mode: process.env.WEBPACK_SERVE ? "development" : "production",
    devServer: {
        port: 8080,
        publicPath: "/",
        inline: true,
        // hot: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Maze Framework",
            filename: "index.html",
            template: path.join(__dirname, "./index.html"),
        }),
        new HtmlWebpackPlugin({
            title: "Maze Framework - How to add your scripts",
            filename: "howto.html",
            template: path.join(__dirname, "./howto.html"),
        }),
        new LodashModuleReplacementPlugin(),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    devtool: "eval-source-map",
};

module.exports = config;
