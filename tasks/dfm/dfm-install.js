const {install, config, repos}  = require('../../lib/dfm/dfm.js')

task("dfm-install", "Adds a facet to a diamond")
  .setAction((taskArgs) => {
    console.log("Installing Facets (BORKED/Diabled)")
    // install().then((data)=>{
    //   console.log("Facets Installed")
    // });
    console.log("\nDev Note: For now you'll need to manually link the assets imported in:")
    console.log("tasks/index.js")
    console.log("test/facets/index.js")
    console.log("\nTest objects in test/facets/index.js should be added to the array in enabledFacets() to auto build/test")
    console.log("Update leveraging diamond.json as I can get to it")
  }
)

module.exports = {}
