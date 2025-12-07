module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 其他插件...
      'react-native-reanimated/plugin', // <--- 这一行必须存在，且必须放在插件列表的【最后一位】
    ],
  };
};