// const express = require('express');
// const port = 3000;
// require('dotenv').config();

// const morgan = require('morgan');

// const v3 = require('node-hue-api');

// const app = express();

// app.use(morgan('combined'));

// app.get('/', (req, res) => {
//   console.log('hello');
// })

// app.get('/api/connect', (req, res, next) => {
//   async function getBridge() {
//     const result = await v3.discovery.nupnpSearch();
    
//     console.log(JSON.stringify(result));
//   }

//   getBridge();
//   next;
// });

//   app.get('/api/get-light/?id', (req, res) => {
//     api.lights.getLight(id)
//     .then(light => {
//       console.log(light.toStringDetail());
//     })
//   });

//   app.get('/api/set-light-state', (req, res, next) => {
//     const LightState = v3.lightStates.lightState;
//     const lightID = 1;

//     v3.discovery.nupnpSearch()
//     .then(searchResults => {
//       const host = searchResults[0].ipaddress;
//       return v3.api.createLocal(host).connect(process.env.USERNAME)
//     })
//     .then(api => {
//       const state = new LightState()
//         .on()
//       ;
//       console.log(state);
//       return api.lights.setLightState(lightID, state);
//     })
//     .then(result => {
//       console.log('Light state changed succesfully?'`$(result)`);
//     })
//     .catch((error) => {
//       console.log('error');
//     })
//   });


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// });

const v3 = require('node-hue-api').v3;

async function getBridge() {
  const results = await v3.discovery.nupnpSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();

