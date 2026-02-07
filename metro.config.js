// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);


const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Remove svg from assetExts
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    // Add svg to sourceExts
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);



// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);

// const config = {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     // Remove svg from assetExts
//     assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
//     // Add svg to sourceExts
//     sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
//   },
// };

// module.exports = mergeConfig(defaultConfig, config);
