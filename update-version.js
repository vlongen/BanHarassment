import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)

function updateVersion() {
  // 读取 package.json 文件(Read the package.json file)
  const packagePath = path.resolve(__dirnameNew, 'package.json');
  const fileContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(fileContent);

  // 解析并更新版本号(Parse and update the version number)
  const versionArray = packageJson.version.split('.');
  const patch = parseInt(versionArray[2], 10) + 1;

  if (patch >= 1000) {
    versionArray[2] = '0';
    const minor = parseInt(versionArray[1], 10) + 1;

    if (minor >= 100) {
      versionArray[1] = '0';
      versionArray[0] = (parseInt(versionArray[0], 10) + 1).toString();
    } else {
      versionArray[1] = minor.toString();
    }
  } else {
    versionArray[2] = patch.toString();
  }

  packageJson.version = versionArray.join('.');
  packageJson.buildTime = getDateTime();

  // 写回更新后的版本号到 package.json 文件
  // (Write the updated version number back to the package.json file)
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

  // 输出更新后的版本号(Log the updated version number)
  console.log(`Version 更新为: ${packageJson.version}`);
}

/**
 * 获取格式化时间
 * @returns {string}
 */
function getDateTime() {
  const date = new Date()
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

updateVersion();
