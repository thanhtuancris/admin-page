const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});

//Models
const TruyenTranh = require('./Models/truyentranh');



app.get('/', (req, res) => {
    res.send("hello");
});