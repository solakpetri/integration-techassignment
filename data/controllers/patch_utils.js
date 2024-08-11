import path from 'path';
import fs from 'fs/promises';

export class PatchUtilities{
    constructor(dirname){
        this.dirname = dirname;
    }
    #docPayload = 'documents/payload.json';
    #docRespSchema = 'documents/response-schema.json';
    #docResponse = 'documents/response.json';

    async getdata(){
        const dataPath = path.join(this.dirname,this.#docPayload);
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    };
        
    async getSchema() {
        const dataPath = path.join(this.dirname,this.#docRespSchema);
        const schemaData = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(schemaData);
    };
    
    async getResponse(responseData) {
        const responseFilePath = path.join(this.dirname, this.#docResponse);
        await fs.writeFile(responseFilePath, JSON.stringify(responseData, null, 2), 'utf8');
    };
    
    getIsoDate(glideDateStr){
        return new Date(glideDateStr).toISOString();
    };
    
    getNumber(numberStr){
        return Number(numberStr);
    };
    
    getBool(boolStr){
        return boolStr === "1" ? true : boolStr === "0" ? false : boolStr;
    };
}

export default PatchUtilities;

