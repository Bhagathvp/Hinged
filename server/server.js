const express = require("express");
const app = express();
const cors = require('cors')
const nocache=require('nocache')
const connectDB =require("./Frameworks/database/database") ;
const io = require( './Sockets/Socket.js')


const mongoSanitize = require('express-mongo-sanitize');
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const vendorRoute = require('./routes/vendorRoute');
const servicesRoute = require("./routes/servicesRoute");
const photographerRoute = require("./routes/photographerRoute");
const chatRoute = require('./routes/chatRouter')

app.use(cors({
    origin: ["https://hinged.live", "http://localhost:3000", "https://hinged.vercel.app"]
}));

app.use(mongoSanitize());
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(nocache());

//for user routes
app.use("/users", userRoute);

//for vendor routes
app.use("/vendor",vendorRoute)

//for services routes
app.use("/services",servicesRoute)

//for photographer routes
app.use('/photographer',photographerRoute)

//for chat routes
app.use('/chat',chatRoute)

//for admin routes
app.use('/admin',adminRoute)


connectDB().then(() => {
let server = app.listen(4000, ()=>{
    console.log("server running @ 4000");
})
io.attach(server)
});
