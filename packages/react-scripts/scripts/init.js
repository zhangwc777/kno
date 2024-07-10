const fs = require("fs-extra");
const chalk = require("chalk");
const spawn = require("cross-spawn");
const execSync = require("child_process").execSync;

// 是否在git 仓库
function isInMercurialRepository() {
  try {
    execSync("hg --cwd . root", { stdio: "ignore" });
    const output = execSync("pwd").toString();
    console.log(output);
    return true;
  } catch (e) {
    return false;
  }
}
// 是否在git 仓库

function isInGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

// 初始化git 仓库
function tryGitInit() {
  try {
    execSync("git --version", { stdio: "ignore" });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync("git init", { stdio: "ignore" });
    return true;
  } catch (e) {
    console.warn("Git repo not initialized", e);
    return false;
  }
}
// 初始化校验钩子
function tryHuskyInit() {
  try {
    execSync("npm run prepare ", { stdio: "ignore" });
    execSync(`npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`, {
      stdio: "ignore",
    });
    execSync(`npx husky add .husky/pre-commit "npx  lint-staged -v"`, { stdio: "ignore" });
    // git commit 时会报错暂时取消
    // execSync(`npx husky add .husky/pre-commit "npx pont-generate"`, { stdio: 'ignore' });
  } catch (e) {
    console.warn("husky 初始化失败", e);
    return false;
  }
}

module.exports = function (appPath, appName, verbose, originalDirectory, templateName) {
  const appPackage = require(path.join(appPath, "package.json")); //项目目录下的 package.json
  const usePnpm = fs.existsSync(path.join(appPath, "pnpm-lock.yaml")); //通过判断目录下是否有 yarn.lock 来判断是否使用 yarn

  if (!templateName) {
    // 判断是否有模板名称
    console.log("");
    console.error(
      `A template was not provided. This is likely because you're using an outdated version of ${chalk.cyan(
        "create-react-app",
      )}.`,
    );
    console.error(
      `Please note that global installs of ${chalk.cyan(
        "create-react-app",
      )} are no longer supported.`,
    );
    return;
  }

  const templatePath = path.dirname(
    //获取模板的路径
    require.resolve("@kno/cra-template/package.json", { paths: [appPath] }),
    "..",
  );
  let templateJsonPath;
  if (templateName) {
    //
    templateJsonPath = path.join(templatePath, "template.json");
  } else {
    // TODO: Remove support for this in v4.
    templateJsonPath = path.join(appPath, ".template.dependencies.json");
  }

  let templateJson = {};
  if (fs.existsSync(templateJsonPath)) {
    //判断路径是否正确
    templateJson = require(templateJsonPath);
  }

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Setup the script rules 定义scripts
  const templateScripts = templateJson.scripts || {};
  appPackage.scripts = Object.assign(
    {
      start: "npm run pont-generate && kno start",
      build: "kno build",
      prepare: "husky install",
      preinstall: "npx only-allow pnpm",
      "pont-generate": "pont",
    },
    templateScripts,
  );

  appPackage["lint-staged"] = {
    "*.{md,json}": ["prettier --write --no-error-on-unmatched-pattern"],
    "*.{css,less}": ["prettier --write"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{ts,tsx}": ["eslint --fix", "prettier --parser=typescript --write"],
  };
  appPackage.entries = {
    node: "16.20.2",
    pnpm: "8.7.4",
  };
  // Update scripts for Yarn users
  if (usePnpm) {
    // 判断是否使用yarn，如果是替换成npm
    appPackage.scripts = Object.entries(appPackage.scripts).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value.replace(/(npm run |npm )/, "pnpm "),
      }),
      {},
    );
  }

  fs.writeFileSync(
    //写入我们需要创建的目录下的 package.json 中
    path.join(appPath, "package.json"),
    JSON.stringify(appPackage, null, 2) + os.EOL,
  );

  // 判断项目目录是否有`README.md`，模板目录中已经定义了`README.md`防止冲突
  const readmeExists = fs.existsSync(path.join(appPath, "README.md"));
  if (readmeExists) {
    fs.renameSync(path.join(appPath, "README.md"), path.join(appPath, "README.old.md"));
  }

  // 复制模版
  const templateDir = path.join(templatePath, "template");
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  } else {
    console.error(`Could not locate supplied template: ${chalk.green(templateDir)}`);
    return;
  }

  // modifies README.md commands based on user used package manager.
  if (usePnpm) {
    // 判断是否使用yarn，如果是替换成你怕吗 npm 默认使用npm
    try {
      const readme = fs.readFileSync(path.join(appPath, "README.md"), "utf8");
      fs.writeFileSync(
        path.join(appPath, "README.md"),
        readme.replace(/(npm run |npm )/g, "yarn "),
        "utf8",
      );
    } catch (err) {
      // Silencing the error. As it fall backs to using default npm commands.
    }
  }

  // 问题：为什么模版文件中是gitignore而不是.gitignore，这样就可以直接复制？
  //      为什么直接是.gitignore，在生成的文件中没有.gitignore？
  //      为什么模版必须是gitignore，然后加上下面的命令。重命名为.gitignore？
  const gitignoreExists = fs.existsSync(path.join(appPath, ".gitignore"));
  if (gitignoreExists) {
    const data = fs.readFileSync(path.join(appPath, "gitignore"));
    fs.appendFileSync(path.join(appPath, ".gitignore"), data);
    fs.unlinkSync(path.join(appPath, "gitignore"));
  } else {
    fs.moveSync(path.join(appPath, "gitignore"), path.join(appPath, ".gitignore"), []);
  }
  // 问题如gitignoreExists
  const npmrcExists = fs.existsSync(path.join(appPath, ".npmrc"));
  if (npmrcExists) {
    const data = fs.readFileSync(path.join(appPath, "npmrc"));
    fs.appendFileSync(path.join(appPath, ".npmrc"), data);
    fs.unlinkSync(path.join(appPath, "npmrc"));
  } else {
    fs.moveSync(path.join(appPath, "npmrc"), path.join(appPath, ".npmrc"), []);
  }

  let command;
  let remove;
  let args;

  if (usePnpm) {
    command = "pnpm";
    remove = "remove";
    args = ["add"];
  } else {
    command = "npm";
    remove = "uninstall";
    args = ["install", "--save", verbose && "--verbose"].filter((e) => e);
  }

  // Install additional template dependencies, if present 安装其他模板依赖项如果有
  const templateDependencies = templateJson.dependencies;
  if (templateDependencies) {
    args = args.concat(
      Object.keys(templateDependencies).map((key) => {
        return `${key}@${templateDependencies[key]}`;
      }),
    );
  }

  const proc = spawn.sync(command, [remove, templateName], {
    stdio: "inherit",
  });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    return;
  }
  // 初始化git
  if (tryGitInit()) {
    console.log();
    console.log("Initialized a git repository.");
  }
  // 初始化 校验钩子
  tryHuskyInit();

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  // 显示最优雅的CD方式。
  // 这需要处理一个未定义的originalDirectory
  // 与旧的global-cli的向后兼容性。
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  // 将显示的命令更改为yarn而不是yarnpkg
  const displayedCommand = usePnpm ? "pnpm" : "npm";

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log("Inside that directory, you can run several commands:");
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log("    Starts the development server.");
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} ${usePnpm ? "" : "run "}build`));
  console.log("    Bundles the app into static files for production.");
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log("    Starts the test runner.");
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} ${usePnpm ? "" : "run "}eject`));
  console.log("    Removes this tool and copies build dependencies, configuration files");
  console.log("    and scripts into the app directory. If you do this, you canâ€™t go back!");
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(chalk.yellow("You had a `README.md` file, we renamed it to `README.old.md`"));
  }
  console.log();
  console.log("Happy hacking!");
};
