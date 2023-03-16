
const express = require('express');
const cors = require('cors');

// const session = require('express-session');


const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser');


const userRoute = require('./routes/users');
const fileRoute = require('./routes/file')
const graphRoute = require('./routes/graph')
const projectRoute = require('./routes/project')

// const store = new session.MemoryStore();

const app = express();
const PORT = 3001;


// Middelwares
// app.use(session({
// 	key : "userId",
// 	secret: "abcd",
// 	resave: false,
// 	saveUninitialized: false,
// 	cookie:{
// 		expires: 60*60 //1hours after cookie expires
// 	},
// }));

app.use(cors({
	origin:["http://localhost:5173"],
	// origin:["data-pfcx5b1yn-pix-ez.vercel.app"],
	methods:["GET", "POST", "DELETE"],
	credentials: true,
}))
app.use(cookieparser());
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use((req, res, next)=>{
// 	// console.log(store);
// 	// console.log('${req.method} - ${req.url}');
// 	next();
// })

//Routes
app.use('/users', userRoute);
app.use('/file',fileRoute)
app.use('/graph',graphRoute)
app.use('/project', projectRoute)


app.get('/', (req, res)=>{
	res.status(200);
	res.send("Welcome to root URL of Server");
});

app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running, and App is listening on port "+ PORT+"😊👌 ")
	else
		console.log("Error occurred, server can't start", error);
	}
);
