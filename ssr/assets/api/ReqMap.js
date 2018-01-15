import assert from './assert';

function cancelMulti(sources) {
  sources.forEach(source => source.cancel());
}

class ReqMap {
  constructor() {
    this.reqMap = {};
  }
  push(req, cancelSame = true) {
    assert(req, [{
      field: 'url',
      required: true,
      type: 'string'
    }, {
      field: 'source',
      required: true,
      children: [{
        field: 'id',
        required: true
      }]
    }]);
    
    const { url, source } = req;
    if (this.reqMap[url]) {
      if (cancelSame) {
        this.reqMap[url].forEach(source => source.cancel());
        this.reqMap[url] = [source];
      } else {
        this.reqMap[url].push(source);
      }
    } else {
      this.reqMap[url] = [source];
    }
  }
  remove(url, id) {
    if (this.reqMap[url]) {
      let idx = -1;
      this.reqMap[url].forEach((source, i) => {
        if (source.id === id) {
          source.cancel();
          idx = i;
          return true;
        }
      });
      this.reqMap[url].splice(idx, 1);
    }
    if (this.reqMap[url].length === 0) {
      delete this.reqMap[url];
    }
  }
  removeAll() {
    for (const key in this.reqMap) {
      if (this.reqMap.hasOwnProperty(key)) {
        const source = this.reqMap[key];
        source.forEach(source => source.cancel());
        delete this.reqMap[key];
      }
    }
  }
}

export default ReqMap;
