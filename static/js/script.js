/**
 * Got this courtesy of SomeKittens on stack overflow.
 * Turns xhttp requesting into promise-based system
 * @param {object} opts an options object w/ method, url, headers, & params
 * @return {Promise} which will allow interaction with result of the request.
 */
function makeRequest (opts) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        xhr.setRequestHeader(key, opts.headers[key]);
      });
    }
    var params = opts.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }
    xhr.send(params);
  });
}



class ShelterAPI {
  constructor(baseURI = '') {
    if (baseURI.endsWith('/')) {
      throw new Error("baseURI should not end with /"
      + " (it is added automatically)");
    }
    this.baseURI = baseURI + "/";
    this.authToken = "";
  }
  /**
   * constructs a request for the API
   *
   */
  _constructRequest(method, subURI, headers, params) {
    if (method == undefined || subURI == undefined) {
      return Promise.reject({
        status: 400,
        statusText: "invalid request construction"
      });
    }
    return makeRequest({
      method: method,
      url: this._constructURI(subURI),
      headers: headers,
      params: params
    })
  }
  /**
   * takes in a sub uri and concatenates it to the baseURI for the api
   * @param {string} subURI the sub uri for the uri to get. should NOT begin with /
   */
  _constructURI(subURI) {
    if (subURI == undefined) throw Error("subURI must be defined");
    if (subURI[0] == '/') throw Error("subURI should not be preceded by /");
    return this.baseURI + subURI;
  }

  /**
   * Get all shelters from the API
   * @param {Object} opt options for how to filter shelters to get (no effect yet)
   * @return {Promise} containing result or error from the server
   * TODO add options to prefilter shelters being pulled from the server
   */
  getShelters(opt) {
    return this._constructRequest("GET", "shelters")
      .then(function(response) {
        response = JSON.parse(response);
        return response.shelters;
      });
  }
}
