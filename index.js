const express = require('express')
const app = express()
const port = process.env.PORT || 9001




app.get('/', (req,res) => {
    res.send('yo!')
})

app.listen(port, ()=> {
    console.log('Server running on http://localhost:'+port)
    console.log('Detected redis @ '+ (process.env.REDIS_URL || 'undefined') )
})