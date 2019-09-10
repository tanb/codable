// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-typescript'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
    ],
    karmaTypescriptConfig: {
      compilerOptions: {
        sourceMap: true,
      },
      tsconfig: "./tsconfig.json",
    },
    files: [ { pattern: 'src/**/*.ts' }, { pattern: 'test/**/*.spec.ts' } ],
    preprocessors: {
      'src/**/*.ts': [ 'karma-typescript' ],
      'test/**/*.spec.ts': [ 'karma-typescript' ]
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/codable'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
