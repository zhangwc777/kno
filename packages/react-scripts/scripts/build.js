process.env.NODE_ENV = "production";
const chalk = require("chalk");
const webpack = require("webpack");

const config = require("../config/webpack.prod.js");
build();
function build() {
  const compiler = webpack(config);
  compiler.run((err) => {
    console.log(err);
    console.log(chalk.green("Compiled successfully.\n"));
  });
}
