import express from 'express';
import supertest from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from "url";
import PatchUtilities from '../controllers/patch_utils.js'; // Adjust path and import style as needed

// Test the patch method here

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const utils = new PatchUtilities(__dirname);

const dummyData = 
  {
    "system": "ServiceNow",
    "entity": "cmdb_ci_computer",
    "type": "UPDATE",
    "id": "b4fd7c8437201000deeabfc8bcbe5dc1",
    "entries": [
      {
        "field": "sys_id",
        "type": "GUID",
        "previous": "b4fd7c8437201000deeabfc8bcbe5dc1",
        "current": "b4fd7c8437201000deeabfc8bcbe5dc1"
      },
      {
        "field": "os_address_width",
        "type": "integer",
        "previous": null,
        "current": null
      },
      {
        "field": "attested_date",
        "type": "glide_date_time",
        "previous": "",
        "current": ""
      },
      {
        "field": "operational_status",
        "type": "integer",
        "previous": "1",
        "current": "1"
      }
    ]
  }

app.use(express.json());
app.patch('/ServiceNow/:id?', async (req, res) => {
  const data = await utils.getdata();
  res.status(200).json({ message: 'Successfull', data });
});

describe('PATCH /ServiceNow/:id?', () => {
  let testUtils;
  beforeEach(() => {
    testUtils = utils;
    sinon.restore();
  });

  it('Returns 200 with or without id in the endpoint', async () => {
    sinon.stub(testUtils, 'getdata').resolves({ dummyData});
    const response = await supertest(app)
      .patch('/ServiceNow') // insert id to test '/ServiceNow/id'
      .send({ type: "UPDATE" });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Successfull');
  });
});