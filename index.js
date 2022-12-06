const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require('mongodb')

const uri =
    "mongodb+srv://sunny23:sunny@cluster0.nvgw8zp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log(" connection done")


    } catch (e) {
        console.error(e);
    }
}

connectDB();

const server = http.createServer(async (req, res) => {

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

    //fetch MongoDB data and send the response
    else if (req.url === '/api') {

        const data = client.db("dev").collection("profile").find({});
        const results = await data.toArray();

        const profile = (JSON.stringify(results));
        res.writeHead(200, headers);
        res.end(profile);

    }
    //show 404 page for any other url
    else {
        fs.readFile(path.join(__dirname, 'public', '404.html'),
            (err, content) => {

                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Great our server is running on port ${PORT} `));