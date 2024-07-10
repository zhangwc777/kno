# `@kno/react-scripts`

> TODO: description

## 生产依赖

1. 为什么要放到生产依赖？因为后期修改script就可以了。但是打包时怎么办？忽略scripts的包？

```
    "@commitlint/cli": "16.3.0",
    "@commitlint/config-conventional": "16.2.4",
    "@types/react": "18.2.47",
    "@types/react-dom": "18.2.18",
    "@typescript-eslint/eslint-plugin": "6.19.0",
    "@typescript-eslint/parser": "6.19.0",
    "eslint": "8.56.0",
    "eslint-config-prettier": "9.1.0",
    "eslint-plugin-prettier": "5.1.0",
    "eslint-plugin-react": "7.33.2",
    "husky": "8.0.3",
    "lint-staged": "14.0.1",
    "prettier": "3.1.1",
    "typescript": "5.3.3"
```

2. 目前的webpack依赖

```
    "@babel/core": "^7.22.17",
    "@babel/plugin-proposal-decorators": "^7.22.15",
    "@babel/plugin-syntax-dynamic-import": "^7.8.3",
    "@babel/plugin-transform-runtime": "^7.22.15",
    "@babel/polyfill": "^7.12.1",
    "@babel/preset-env": "^7.22.15",
    "@babel/preset-react": "^7.22.15",
    "@babel/preset-typescript": "^7.22.15",
    "@babel/runtime": "^7.22.15",
      "@pmmmwh/react-refresh-webpack-plugin": "^0.5.11",
         "babel-loader": "^9.1.3",
    "compression-webpack-plugin": "^10.0.0",
    "copy-webpack-plugin": "^11.0.0",
    "core-js": "^3.34.0",
    "cross-env": "^7.0.3",
    "css-loader": "^6.8.1",
    "css-minimizer-webpack-plugin": "^5.0.1",
     "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.5.3",
       "less": "^4.2.0",
    "less-loader": "^11.1.3",
      "mini-css-extract-plugin": "^2.7.6",
    "postcss": "^8.4.29",
    "postcss-less": "^6.0.0",
    "postcss-loader": "^7.3.3",
    "postcss-preset-env": "^9.1.3",
      "mini-css-extract-plugin": "^2.7.6",
    "postcss": "^8.4.29",
    "postcss-less": "^6.0.0",
    "postcss-loader": "^7.3.3",
    "postcss-preset-env": "^9.1.3",
        "terser-webpack-plugin": "^5.3.9",
          "webpack": "^5.88.2",
    "webpack-bundle-analyzer": "^4.9.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "webpack-merge": "^5.9.0",
    "react-refresh": "^0.14.0",
    "style-loader": "^3.3.4"

    ""
```
