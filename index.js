import express from "express";
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from "url";
import tv4 from "tv4";
import PatchUtilities from "./data/controllers/patch_utils.js";
import APIDefinitions from "./data/models/api_defs.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const utils = new PatchUtilities(__dirname); // Helper methods

app.get(`${APIDefinitions.endpoint}/:id?`, async (req, res) => {
  try{
    const {id} = req.params;
    const response = await fetch(`${APIDefinitions.webhook_url}/${id}`,{
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    }
    else{
      res.status(response.status).send('Could not get the data.');
    }
  //res.send('Server using ES6 syntax is live!')
  }
  catch(error){
    console.error('GET error:',error);
    res.status(500).send('Error 500 on GET');
  }
});

app.post(APIDefinitions.endpoint, async (req, res) => {
  try{
    let data = await utils.getdata();
    const response = await fetch(APIDefinitions.webhook_url,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    }
    else{
      res.status(response.status).send('Could not post the data.');
    }

    //res.send('This is the POST request')
  }
  catch(error){
    console.error('POST error:',error);
    res.status(500).send('Error 500 on POST');
  }
});

app.patch(`${APIDefinitions.endpoint}/:id?`, async(req,res) => {
  try{
      // Get the data from the file
    let data = await utils.getdata();
    const patchData = req.body;
    // If no id specified, use the one in the file
    // Depending on the project, this can be removed
    // Ideally, a criteria such as id would be a must
    const reqId = req.params.id ? req.params.id : data.id; 

    if(reqId !== data.id){
      return res.status(404).json({error: 'ID is not matching!'});
    }

    // Prepare the data
    // Convert the types of the values to requested types
    data = {...data, ...patchData};
    data.entries = data.entries.map(entry => {
      if (entry.type === "glide_date_time" || entry.type === "glide_date") {
          return { ...entry,
              previous: entry.previous ? utils.getIsoDate(entry.previous) : entry.previous,
              current: entry.current ? utils.getIsoDate(entry.current) : entry.current 
          };
      }
      else if(entry.type === "decimal" || entry.type === "integer"){
          return { ...entry, 
              previous: entry.previous ? utils.getNumber(entry.previous) : entry.previous,
              current: entry.current ? utils.getNumber(entry.current) : entry.current 
          };
      }
      else if(entry.type === "boolean"){
          return { ...entry, 
              previous: entry.previous !== null ? utils.getBool(entry.previous) : entry.previous,
              current: entry.current !== null ? utils.getBool(entry.current) : entry.current
          };
      }
      return entry;
    });

    // Fetch the response from webhook
    const response = await fetch(APIDefinitions.webhook_url,{
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    // Get the response status and add some information
    const msgSuccess = {
      response_code: response.status,
      message: 'Data received successfully',
      datetime: new Date().toISOString(),
      data_id: data.id
    };

    // Validate if the response conforms the schema
    let schema = utils.getSchema();
    const isvalid = tv4.validate(data,schema); // ajv can also be used here

    // If the schema is valid, end up with the code 200
    // and print the success message
    // Otherwise log the error
    if(isvalid){
      res.status(200).json(msgSuccess);
    }
    else{
      console.log('Validation failed. Please see:', validate.errors);
    }

    // Write the response in a file
    utils.getResponse(data);
  }
  catch(error){
    console.error('PATCH error:',error);
    res.status(500).send('Error 500 on PATCH');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
