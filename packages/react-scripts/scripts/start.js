process.env.NODE_ENV = "development";
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const chalk = require("chalk");
const portfinder = require("portfinder");

const config = require("../config/webpack.dev");
const compiler = createCompiler({
  config,
  webpack,
});
const HOST = process.env.HOST || "0.0.0.0";
function createCompiler({ config, webpack }) {
  let compiler = webpack(config);
  return compiler;
}
const main = async () => {
  const port = await portfinder.getPortPromise({ prot: 8000 });
  const devServer = new WebpackDevServer(compiler, {
    // 这里代码值得思考、什么时候生效。与webpack.dev的是否冲突
    // port: 8000, // 端口号
    // compress: false, // gzip压缩开发环境不开启，提升热更新速度
    // open: false, // 自动打开浏览器
    // 貌似不开启hot热更新也能热更新
    // hot: true, // 开启热更新
    // historyApiFallback: true, // 解决history路由404问题
    // static: {
    //   directory: resolveApp('public'), // 托管静态资源public文件夹
    // },
  });
  devServer.listen(port, HOST, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.cyan("Starting the development server...\n"));
  });
};
main();
