

use programmatic nodemon
nodemon watches src changes
  - ./src/electron uses exec electronBuild.  at end of build, kill ElectronApp and then execute ElectronApp
  - ./src/react uses exec reactBuild. at end of build, kill ElectronApp and then execute ElectronApp

use exec electronBuild 
  upon completion