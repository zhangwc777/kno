const chalk = require("chalk");
const { Command } = require("commander");
const path = require("path");
const fse = require("fs-extra");
const spawn = require("cross-spawn");

const packageJson = require("../package.json");

const init = async () => {
  let appName;
  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((projectName) => {
      appName = projectName;
    })
    .parse(process.argv);
  await createApp(appName);
};

const createApp = async (appName) => {
  const root = path.resolve(appName);
  fse.ensureDirSync(appName);
  console.log(`Creating a new React app in ${chalk.green(root)}.`);
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  };
  fse.writeFileSync(path.join(root, "package.json"), JSON.stringify(packageJson, null, 2));
  const originalDirectory = process.cwd();
  process.chdir(root);
  console.log("originalDirectory: ", originalDirectory);
  console.log("root: ", root);
  await run(root, appName, originalDirectory);
};

const run = async (root, appName, originalDirectory) => {
  const templateName = "@kno/cra-template";
  const scriptName = "@kno/react-scripts";
  // const uiName = '@kno/beacon'
  // const t_uiName="@kno/ui"
  const ahooksName = "ahooks";
  const iconName = "@ant-design/icons";

  const allDependencies = [
    "react",
    "react-dom",
    "react-router-dom",
    "lodash",
    scriptName,
    templateName,
    ahooksName,
    iconName,
  ];
  console.log(
    `Installing ${chalk.cyan("react")}, ${chalk.cyan(
      "react-dom",
    )}, and ${chalk.cyan(scriptName)}${` with ${chalk.cyan(templateName)}`}...`,
  );
  await install(root, allDependencies);

  const data = [root, appName, true, originalDirectory, templateName];
  const source = `
  var init = require('@kno/react-scripts/scripts/init.js');
  init.apply(null, JSON.parse(process.argv[1]));
  `;
  // const source = `
  // var init = require('/Users/zhangwc/Documents/工作/rwx/create-webpack-app/packages/react-scripts/scripts/init.js');
  // init.apply(null, JSON.parse(process.argv[1]));
  // `
  await executeNodeScript(
    {
      cwd: process.cwd(),
    },
    data,
    source,
  );
  console.log("Done.");
  process.exit(0);
};

const install = async (root, allDependencies, isDev) => {
  const arg = isDev ? "-D" : "";
  return new Promise((resolve) => {
    const command = "pnpm";
    let args = [
      "add",
      ...allDependencies,
      "--shamefully-hoist", //顶层下载依赖
      "--no-strict-peer-dependencies", //安装依赖时不严格检查对等依赖
      arg,
    ];
    args = args.filter(Boolean);
    const env = Object.create(process.env);
    const child = spawn(command, args, {
      stdio: "inherit",
      env,
    });

    child.on("close", resolve);
  });
};

const executeNodeScript = async ({ cwd }, data, source) => {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["-e", source, "--", JSON.stringify(data)], {
      cwd,
      stdio: "inherit",
    });
    child.on("close", resolve);
  });
};

module.exports = {
  init,
};
