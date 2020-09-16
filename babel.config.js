const devPresets = ['@vue/babel-preset-app'];

const buildPresets = [
  [
    "@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }
  ],
  '@babel/preset-typescript'
];
module.exports = {
  presets: (process.env.NODE_ENV === 'development' ? devPresets : buildPresets),
};
