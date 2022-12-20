import userRouter from './routers/userRouts.js';
import itemRouter from './routers/itemRouts.js';
import cartRouter from './routers/cartRouts.js';
import orderRouter from './routers/orderRouts.js';
import express  from 'express';
import conn from './db/mongoose.js';
import dotenv from 'dotenv';


dotenv.config();
const port = process.env.PORT 

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(itemRouter)
app.use(cartRouter)
app.use(orderRouter)


app.listen(port, conn(port))
