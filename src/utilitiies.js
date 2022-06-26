export const fetchJson = (url, data, method) => {
    var data_obj = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (method !== "GET") {
        data_obj.method = method
        data_obj.body = JSON.stringify(data)
    }
    return fetch(url, data_obj).then( res => {
      //console.log(res);
      return res.json();
    } )
  }