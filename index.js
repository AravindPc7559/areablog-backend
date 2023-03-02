const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server');
const AuthRoute = require('./Routes/AuthRoute')
const resolvers = require('./graphql/Resolver')
const typeDefs = require('./graphql/typeDefs')
const dotenv = require('dotenv');
dotenv.config();
const MongoDBConnection = require('./Connection/MongoDB');


const port = process.env.PORT || 4000;
const app = express();


MongoDBConnection()


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))
app.use(morgan('dev'));


app.use('/auth', AuthRoute);


app.get('/' ,(req,res) => {
    res.send("Backend is working");
})


const server = new ApolloServer({ typeDefs, resolvers });



// Error Handling..
app.use(function (req, res, next) {
    next(createError(404));
});
  
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

server.listen(port).then(({ url }) => {
    console.log(`��� Server ready at  ${url}`);
})