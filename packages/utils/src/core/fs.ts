import fs from "fs";
import path from "path";
// 删除目录及其内容
export const deleteDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      fs.unlinkSync(curPath);
    });
    fs.rmdirSync(dirPath);
  }
};

// 创建目录
export const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
// 文件是否存在
export const hasFile = (filePath) => {
  // 但是有帖子再说，如果有权限问题可能判断有误
  return !!fs.existsSync(filePath);
};
// 创建文件并写入内容
export const createFileAndWrite = (filePath, content) => {
  fs.writeFileSync(filePath, content);
};
