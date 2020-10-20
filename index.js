import express from 'express'
import RedisGraph from 'redisgraph.js'
import redis from 'redis'

// import Redis from 'ioredis'
//const redis_client = new Redis(6379, process.env.REDIS_URL)

const client = redis.createClient( {port: 6379, host: process.env.REDIS_URL} );

var graph;
var counter = 0;


client.on("error", function(error) {
  console.error(error);
});

client.on("connect", function(msg) {
    console.error(msg || 'connected');
    graph = new RedisGraph.Graph("test_graph", "redis", "6379")
});

const port = process.env.PORT || 9001
const app = express()


async function demo() {
    
    await graph.query("CREATE (:person{name:'roi',age:32})");
    await graph.query("CREATE (:person{name:'amit',age:30})");
    await graph.query("MATCH (a:person), (b:person) WHERE (a.name = 'roi' AND b.name='amit') CREATE (a)-[:knows]->(b)");
    
    // Match query.
    let res = await graph.query("MATCH (a:person)-[:knows]->(:person) RETURN a.name");
    while (res.hasNext()) {
        let record = res.next();
        console.log(record.get("a.name"));
    }
    console.log(res.getStatistics().queryExecutionTime());

    // Match with parameters.
    let param = {'age': 30};
    res = await graph.query("MATCH (a {age: $age}) return a.name", param);
    while (res.hasNext()) {
        let record = res.next();
        console.log(record.get("a.name"));
    }

    // Named paths matching.
    res = await graph.query("MATCH p = (a:person)-[:knows]->(:person) RETURN p");
    while (res.hasNext()) {
        let record = res.next();
        // See path.js for more path API.
        console.log(record.get("p").nodeCount);
    }
    graph.deleteGraph();
    graph.close();

}

app.get('/', (req,res) => {
    res.status(200)
    res.send('Success ' + (++counter))
})

app.listen(port, ()=> {
    console.log('Server running on http://localhost:'+(process.env.DOCKER_PORT || port))
    console.log('Detected redis @ '+ (process.env.REDIS_URL || 'undefined') )
})