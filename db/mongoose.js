import mongoose  from 'mongoose';

const user = process.env.USER || "admin";
const password = process.env.PASS || "7CpGZ826n5qUXRtj";


mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.u0wyvop.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to MongoDB');
    })