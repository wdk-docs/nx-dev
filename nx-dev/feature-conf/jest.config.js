module.exports = {
  displayName: 'nx-dev-feature-conf',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/nx-dev/feature-conf',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
};
