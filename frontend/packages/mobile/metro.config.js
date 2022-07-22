const path = require('path')
const { getDefaultConfig } = require('metro-config')

const extraNodeModules = {
  "@todo/client-core": path.resolve("../client-core/"),
  redux: path.resolve(__dirname + "/node_modules/redux"),
  "@reduxjs/toolkit": path.resolve(
    __dirname + "/node_modules/@reduxjs/toolkit"
  ),
  "@babel/runtime": path.resolve(__dirname + "/node_modules/@babel/runtime"),
  "redux-saga": path.resolve(__dirname + "/node_modules/redux-saga"),
  "typesafe-actions": path.resolve(
    __dirname + "/node_modules/typesafe-actions"
  ),
  axios: path.resolve(__dirname + "/node_modules/axios"),
  bcryptjs: path.resolve(__dirname + "/node_modules/bcryptjs"),
  react: path.resolve(__dirname + "/node_modules/react"),
  "react-dom": path.resolve(__dirname + "/node_modules/react-dom"),
  // 'redux-actions': path.resolve(__dirname + '/node_modules/redux-actions'),
  // jsonwebtoken: path.resolve(__dirname + '/node_modules/jsonwebtoken'),
};
const watchFolders = [path.resolve("../client-core/")];

module.exports = (async () =>  {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig()

  return {
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      extraNodeModules,
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders,
  }
})()
