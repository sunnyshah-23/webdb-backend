const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require('mongodb')

async function main() {
    const uri = 'mongodb+srv://sunny23:sunny@cluster0.nvgw8zp.mongodb.net/?retryWrites=true&w=majority'
    const client = new MongoClient(uri)
    try {
        await client.connect()
        await listDatabase(client)
        console.log("connected")
    }
    catch (e) {
        console.log(e)
    } finally {
        await client.close()
    }
}
main().catch(console.error)

async function listDatabase(client) {
    // const databaseList = await client.db().admin().listDatabases()
    // console.log(databaseList)
    const res = await client.db("dev").collection("profile").find({})
    let resArray = await res.toArray()
    console.log(resArray)
}
const server = http.createServer((req, res) => {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    };

    if (req.url === '/') {
        // read public.html file from public folder
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {

                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }

    else if (req.url === '/api') {
        fs.readFile(
            path.join(__dirname, 'public', 'project.json'), 'utf-8',
            (err, content) => {

                if (err) throw err;
                // Please note the content-type here is application/json
                res.writeHead(200, headers);
                res.end(content);
            }
        );

    }
    else {
        fs.readFile(path.join(__dirname, 'public', '404.html'),
            (err, content) => {

                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }

    /*

        But what if we have  1000 pages/urls ? do we need to write 1000 if-else statements?

    /*/
});

const PORT = process.env.PORT || 6959;

server.listen(PORT, () => console.log(`Great our server is running on port ${PORT} `));