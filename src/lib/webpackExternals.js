  function libraryExternalsFactory() {
  
    return function libraryExternals(context, request, callback) {
  
      if (request.startsWith('goodcache')) {
        return callback(null, {
          root: "goodcache",
          commonjs: request,
          commonjs2: request,
          amd: request
        });
      }
  
      callback();
  
    };
  
  }
  module.exports = libraryExternalsFactory;