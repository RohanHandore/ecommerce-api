import express, { json } from 'express';
// import { join } from 'path';
import userRouter from './routers/user.js';
import itemRouter from './routers/item.js';
import cartRouter from './routers/cart.js';
import orderRouter from './routers/order.js';
import './db/mongoose.js';

const port = process.env.PORT | 80

const app = express()

app.use(json())
app.use(userRouter)
app.use(itemRouter)
app.use(cartRouter)
app.use(orderRouter)

// const publicDirectory = join(__dirname, '../public')
// app.use(static(publicDirectory))



app.listen(port, () => {
    console.log('server listening on port ' + port)
})