const express = require('express');
const mongoose = require('mongoose');
const ruleRoutes = require('./routes/ruleRoutes');
const bodyParser = require('body-parser');
const cors = require('cors'); 


const app = express();
const PORT = process.env.PORT || 3001;
app.use(bodyParser.json());
const uri = '<MONGODB_URI_HERE>'

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/rules', ruleRoutes);


// Connecting to mongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


