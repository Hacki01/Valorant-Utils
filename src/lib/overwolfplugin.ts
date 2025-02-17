export class OverwolfPlugin {
  _extraObjectName: any
  _addNameToObject: any
  _pluginInstance: any = null;
  constructor(extraObjectNameInManifest: any, addNameToObject: any) {
    this._extraObjectName = extraObjectNameInManifest;
    this._addNameToObject = addNameToObject;
  }

  // public

  initialized = () => {
    return this._pluginInstance != null;
  };

  get = () => {
    return this._pluginInstance;
  };

  // privates
  initialize = (callback: any) => {
    var proxy = null;
    try {
      proxy = overwolf.extensions.current.getExtraObject;
    } catch (e) {
      console.error(
        "overwolf.extensions.current.getExtraObject doesn't exist!"
      );
      return callback(false);
    }

    proxy(this._extraObjectName, (result: any) => {
      if (result.status !== 'success') {
        console.error(
          'failed to create ' + this._extraObjectName + ' object: ' + JSON.stringify(result)
        );
        return callback(false);
      }

      this._pluginInstance = result.object;

      if (this._addNameToObject) {
        this._pluginInstance._PluginName_ = this._extraObjectName;
      }

      return callback(true);
    });
  }

}