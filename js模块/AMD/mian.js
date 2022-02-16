require.config({
  paths: {
    "moduleA": './moduleA',
    'moduleB': './moduleB'
  }
})

require(['moduleB'], function(moduleB) {
  moduleB.showModuleAName()
})