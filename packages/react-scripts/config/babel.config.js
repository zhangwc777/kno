// babel.config.js
const isDEV = process.env.NODE_ENV === "development"; // 是否是开发模式
module.exports = {
  sourceType: "unambiguous",
  // 执行顺序由右往左，所以先处理ts再处理jsx，最后再转换为低版本浏览器支持的语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本，这里可以不写，babel-loader会自动寻找配置好的.browserslistrc文件
        // "targets": {
        //   > 0.2% in CN
        //   last 10 versions
        // },
        useBuiltIns: "usage", // 根据配置的浏览器兼容，以及代码中使用到的api进行引入polyfill按需添加
        corejs: {
          version: 3,
          proposals: true,
        }, // 配置使用core-js使用的版本
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "./css-modules",
    "@babel/plugin-transform-runtime",
    isDEV && require.resolve("react-refresh/babel"), // 如果是开发模式，就启动react热更新插件
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ].filter(Boolean),
};
