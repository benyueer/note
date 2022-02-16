define(['moduleA'], function (moduleA) {
  return {
    showModuleAName() {
      console.log(moduleA.getName())
    }
  }
})