//include any desired facets here
//@TODO: integrate with diamond.json to not do this...
// var greeter = require('./Greeter.ts')
// var erc20 = require('./DiamondERC20.ts')

// This is used to test the facets
const enabledFacets = () => {
  // return [greeter,erc20]
  return [] // CURRENT WORKING LIST
}

// This is used to deploy the facets
const names = () => {
  var facets = enabledFacets();
  return facets.map((row)=>{return row.name});
}

let availableFacets = {
  facetNames:names,
  enabledFacets:enabledFacets
}

exports.facets = availableFacets
