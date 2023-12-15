/*
  By bien.nguyen@f5.com
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('log-timestamp');
var express = require('express');
var app = express();
var fs = require("fs");
const config = require('./config.json');
const instances = config.instances;
const keys = config.keys;
const axios = require('axios');

function auth(apikey, instance_name, pool_name) {
  var result = true;

  if (apikey == undefined) {
    console.log('no key provided');
    result = false;
  } else {
    const owner_key = apikey.split("-");
    const this_owner = owner_key[0];
    const this_keydata = owner_key[1];
    if (instance_name == undefined) {
      var listofkeys = keys.filter(x => x.owner == this_owner && x.keydata == this_keydata);
      if (listofkeys.length > 0) {
        result = true;
        console.log(this_owner + ' found with (' + listofkeys.length + ') valid keydata');
      } else {
        result = false;
        console.log(this_owner + ' not found, incorrect owner name or keydata or no permission on the instance');
      }
    } else if (pool_name == undefined) {
      var listofkeys = keys.filter(x => x.owner == this_owner && x.keydata == this_keydata && x.bigip == instance_name);
      if (listofkeys.length > 0) {
        result = true;
        console.log(this_owner + ' found with (' + listofkeys.length + ') valid keydata');
      } else {
        result = false;
        console.log(this_owner + ' not found, incorrect owner name or keydata');
      }
    } else {
      var listofkeys = keys.filter(x => x.owner == this_owner && x.keydata == this_keydata && x.bigip == instance_name && x.pool == pool_name);
      if (listofkeys.length > 0) {
        result = true;
        console.log(this_owner + ' found with (' + listofkeys.length + ') valid keydata');
      } else {
        result = false;
        console.log(this_owner + ' not found, incorrect owner name or keydata');
      }   
    }
  }
  return result;
}

//### get the list of bigip instances in the config.json file
app.get('/api/bigips', async (req, res) => {
  var returndata = [];

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey)) {
      for (let i = 0; i < instances.length; i++) {
        // xoa password ra khoi object
        delete instances[i].password;
        returndata.push(instances[i]);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(returndata));
    } else {
        res.status(401);
        res.end();
    }
  }
});

//### get the list of pools in a bigip instance
app.get('/api/:instance_name/pools', async (req, res) => {
  var instance_name = req.params.instance_name;
  var this_instance = instances.find(({ name }) => name === instance_name);
  var baseurl = 'https://' + this_instance.address + ':' + this_instance.port + '/mgmt/tm/ltm/pool';
  var basicAuth = 'Basic ' + btoa(this_instance.user + ':' + this_instance.password);

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey, this_instance.name)) {
      axios.get(baseurl, { headers: { 'Authorization': basicAuth }})
      .then(function (response) {
        // handle success
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.data.items)); 
      })
      .catch(function (error) {
        // handle error
        // tra lai cho client status code nhan duoc tu BIG-IP
        // 401 --> sai user/pass vao BIG-IP
        // 404 --> sai ten pool, member..
        res.status(error.response.status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(error));
      })
      .finally(function () {
        // always executed
      });
    } else {
      res.status(401);
      res.end();    
    }
  }
});

//### get the detail of a pool in a bigip instance
app.get('/api/:instance_name/:pool_name', async (req, res) => {
  var instance_name = req.params.instance_name;
  var pool_name = req.params.pool_name;
  var this_instance = instances.find(({ name }) => name === instance_name);
  var baseurl = 'https://' + this_instance.address + ':' + this_instance.port + '/mgmt/tm/ltm/pool/' + pool_name;
  var basicAuth = 'Basic ' + btoa(this_instance.user + ':' + this_instance.password);

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey, this_instance.name, pool_name)) {
      axios.get(baseurl, { headers: { 'Authorization': basicAuth }})
      .then(function (response) {
        // handle success
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.data)); 
      })
      .catch(function (error) {
        // handle error
        // tra lai cho client status code nhan duoc tu BIG-IP
        // 401 --> sai user/pass vao BIG-IP
        // 404 --> sai ten pool, member..
        res.status(error.response.status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(error));
      })
      .finally(function () {
        // always executed
      });
    } else {
      res.status(401);
      res.end(); 
    }
  }
});

//### get the list of members in a pool in a bigip instance
app.get('/api/:instance_name/:pool_name/members', async (req, res) => {
  var instance_name = req.params.instance_name;
  var pool_name = req.params.pool_name;
  var this_instance = instances.find(({ name }) => name === instance_name);
  var baseurl = 'https://' + this_instance.address + ':' + this_instance.port + '/mgmt/tm/ltm/pool/' + pool_name + '/members';
  var basicAuth = 'Basic ' + btoa(this_instance.user + ':' + this_instance.password);

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey, this_instance.name, pool_name)) {
      axios.get(baseurl, { headers: { 'Authorization': basicAuth }})
      .then(function (response) {
        // handle success
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.data.items)); 
      })
      .catch(function (error) {
        // handle error
        // tra lai cho client status code nhan duoc tu BIG-IP
        // 401 --> sai user/pass vao BIG-IP
        // 404 --> sai ten pool, member..
        res.status(error.response.status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(error));
      })
      .finally(function () {
        // always executed
      });
    } else {
      res.status(401);
      res.end(); 
    }
  }
});

// disable a member in a pool in a bigip instance
app.get('/api/:instance_name/:pool_name/:member_name/disabled', async (req, res) => {
  var instance_name = req.params.instance_name;
  var pool_name = req.params.pool_name;
  var member_name = req.params.member_name;
  var this_instance = instances.find(({ name }) => name === instance_name);
  var baseurl = 'https://' + this_instance.address + ':' + this_instance.port + '/mgmt/tm/ltm/pool/' + pool_name + '/members/' + member_name;
  var basicAuth = 'Basic ' + btoa(this_instance.user + ':' + this_instance.password);

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey, this_instance.name, pool_name)) {
      axios.patch(baseurl, { session: 'user-disabled' }, { headers: { 'Authorization': basicAuth }} )
      .then(function (response) {
        // handle success
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.data)); 
      })
      .catch(function (error) {
        // handle error
        // tra lai cho client status code nhan duoc tu BIG-IP
        // 401 --> sai user/pass vao BIG-IP
        // 404 --> sai ten pool, member..
        res.status(error.response.status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(error));
      })
      .finally(function () {
        // always executed
      });
    } else {
      res.status(401);
      res.end(); 
    }
  }
});

// enable a member in a pool in a bigip instance
app.get('/api/:instance_name/:pool_name/:member_name/enabled', async (req, res) => {
  var instance_name = req.params.instance_name;
  var pool_name = req.params.pool_name;
  var member_name = req.params.member_name;
  var this_instance = instances.find(({ name }) => name === instance_name);

  var baseurl = 'https://' + this_instance.address + ':' + this_instance.port + '/mgmt/tm/ltm/pool/' + pool_name + '/members/' + member_name;
  var basicAuth = 'Basic ' + btoa(this_instance.user + ':' + this_instance.password);

  if (req.headers.apikey == undefined) {
    res.status(401);
    res.end('apikey header was not found');
    console.log('apikey header was not found')
  } else {
    if (auth(req.headers.apikey, this_instance.name, pool_name)) {
      axios.patch(baseurl, { session: 'user-enabled' }, { headers: { 'Authorization': basicAuth }} )
      .then(function (response) {
        // handle success
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.data)); 
      })
      .catch(function (error) {
        // handle error
        // tra lai cho client status code nhan duoc tu BIG-IP
        // 401 --> sai user/pass vao BIG-IP
        // 404 --> sai ten pool, member..
        res.status(error.response.status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(error));
      })
      .finally(function () {
        // always executed
      });
    } else {
      res.status(401);
      res.end(); 
    }
  }
});

//### default 404
app.use((req, res, next) => { 
  res.status(404).send("{ \"message\": \"API endpoint not found\" }");
}) 

var server = app.listen(3300, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("listening at http://%s:%s", host, port)
})
