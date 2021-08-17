const fs = require('fs');
 
const contentful = require("contentful");

const getContent= async()=>{
    try{
    const client = contentful.createClient({
        space: "",        
        accessToken: ""
    });
    const response = await client.getEntries({content_type:'response', 'fields.isStart':true, include:10})

    console.log(response.items)
    fs.writeFile('./public/data/content.json', JSON.stringify(response.items), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    }catch(e){
        console.log(e);
    }
}
getContent();