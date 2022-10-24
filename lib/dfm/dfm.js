/**
* DFM - Diamond Facet Manager
*
* What NPM/package.json is to Node, DFM/diamond.json is to Solidity dev
*
* @author: proggR
* repo: https://github.com/proggR/dfm
*
*/

const relRoot = __dirname + '/../../'
const relFacets = relRoot+'diamond_facets/'

const diamond = require (relRoot+'diamond.json')
const request = require('request');
const fs = require('fs');
const path = require('path');
const { simpleGit } = require('simple-git');
const git = simpleGit();

const repos = Object.keys(diamond.dependencies);//['proggR/Greeter'];

/**
Required Facet package schema:

/contracts/ (will be copied to => /contracts/facets within project)
/contracts/storage/facets (copied to the same path within the project)
/contracts/storage/structs (copied to the same path within the project)
/test (copied to the same path within the project)
/tasks (copied to the same path within the project)
/lib (copied to the same path within the project)

(to be updated/extended with optional facet.json spec to embed configs)
*/

const namedConfig = {
  hardhat: {
    pathMappings: {
      'contracts':'contracts/facets/',
      'interfaces':'contracts/interfaces/',
      'storage/facets':'contracts/storage/facets/',
      'storage/structs':'contracts/storage/structs/',
      'test':'test/facets/',
      'tasks':'tasks/',
      'lib':'lib/',
    },
    pushLocal: true,
  }
}

const config = namedConfig.hardhat


// UTILITIES

const copyfiles = (paths,args,callback) => {
  const src = paths[0]
  const dst = paths[1]
  copyRecursiveSync(src,dst);
  callback(src);
}

const copyRecursiveSync = (src, dest) => {
  var thing = fs.existsSync(src);
  var stats = thing && fs.statSync(src);
  var isDirectory = thing && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, {recursive:true});
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else if(thing) {
    fs.copyFileSync(src, dest);
  }
};


const clone = async (repo) => {
  console.log("CLONING ", repo);
  // const relGit = './git/';
  const dest = relFacets+repo;
  fs.mkdirSync(dest, {recursive:true});
  await git.clone('https://github.com/'+repo,dest);
}

const copyToLocal = (repo) => {
  // replace = local path relative diamond_facets/<facet>
  // path = project directory from root to copy to
  for(const replace in config.pathMappings){
    const path = config.pathMappings[replace];
    const paths = [
      relFacets+repo+'/'+replace+'/',
      relRoot+path
    ];
    copyfiles(paths,{all:true}, (data)=> {
      console.log("COPIED ",data," TO PROJECT DIRECTORY")
    })
  }
}

const exists = (repo) => {
  console.log("EXISTANCE CHECK FOR ", repo);
  return fs.existsSync(relFacets+repo);
}

const install = async () => {
  console.log("ATTEMPTING INSTALL OF ",repos.length," FACETS");
  repos.forEach(async(repo) => {
    if(!exists(repo)){
      console.log("NEW FACET. CLONING");
      await clone(repo)
              .then(()=>{
                console.log("FINISHED CLONING ", repo);
                if(config.pushLocal){
                  console.log("PUSHING TO PROJECT DIRECTORY")
                  copyToLocal(repo)
                }
              });
    } else if(false && upgradeNeeded(repo)){
      //implement upgrades later
    } else {
      console.log(repo+" already up to date");
    }
  });
}

const upgradeNeeded = (repo) => {
  return false;
  const localVersion = getVersion(repo)
  let liveVersion = "0.0.0"
  request.get('http://github.com/'+repo+'/blob/main/VERSION', function (error, response, body) {
      if (!error && response.statusCode == 200) {
  	     liveVersion = body;
          // Continue with your processing here.
      }
  });
  return olderVersion(localVersion,liveVersion)
}

const olderVersion = (local,live) => {
  if(live != "0.0.0") return true

  return false
}

const getVersion = (repo) => {
  return "0.0.0"
}

const dfm = {
  install:install
}

exports.install = install
exports.config = config
exports.repos = repos

module.export = dfm
// console.log("INSTALLING")
install();
// console.log("I RAN")
