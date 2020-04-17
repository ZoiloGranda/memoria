const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080

app.use(express.static(__dirname+'/dist/memoria'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/memoria/index.html'));
});

app.listen(port, ()=>{
 console.log(`listening on ${port}`)
});