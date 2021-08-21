const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const HtmlPlugin = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html'
})
var config = {
    entry: ['./src/index.js',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
],
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: './',
        filename: 'main.js'
    },
    mode: 'development',
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // jsx/js文件的正则
                exclude: /node_modules/, // 排除 node_modules 文件夹
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": ["@babel/react", "@babel/env",],
                        comments: false,
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'antd-icon-loader',
                        options: {
           
                          //relative path to your css path
                          path: '../../_bc/electerm-resource/res/fonts',
           
                          //version, will add to icon source url to help clear cache
                          version: 'v0.12.0'
                        }
                      },
                    'style-loader', 
                    'css-loader'
                ],
            },
            {
                test: /\.ttf|woff|woff2|eot|svg|png|jpg|gif$/,
                use: 'url-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'file-loader',
                options: {
                  esModule: false
                }
              }
        ],
    },
    devServer: {
        publicPath: "/",
        contentBase: "./dist", // 服务启动在哪一个文件夹下
        open: true, // 启动服务时，自动打开浏览器
        port: 8080, // 端口号
        // proxy 跨域时模拟接口代理
        hot: true, // devServer开启Hot Module Replacement的功能
        hotOnly: true
    },
    plugins: [
        HtmlPlugin,
    ]
}

module.exports = config