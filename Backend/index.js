const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const authRoutes = require("./routes/auth");
const requireAuth = require("./middlewares/requireAuth");
const route = require("./routes/route");

const app = express();


app.use(helmet());
app.use(cors({origin:true,credentials:true}))
app.use(express.json({limit:'10kb'}));
app.use(cors());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});



app.use('/api',apiLimiter);

app.get('/health',(req,res)=> res.status(200).json({status:'ok'}));

app.use('/api/auth',authRoutes);

app.use('/api/route',route);

app.get('/api/profile',requireAuth,(req,res)=>{
  res.json({message:"Protected profile data", user: req.user});
});

app.use(cors({
  origin: "http://localhost:3000",  // your frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


module.exports = app;