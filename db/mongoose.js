import mongoose from 'mongoose';


const user = process.env.USER || "admin";
const password = process.env.PASS || "7CpGZ826n5qUXRtj";



export const conn = async (port) => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.u0wyvop.mongodb.net/ecommerce?retryWrites=true&w=majority`)
        .then(() => console.log(`db connected ${port}`))
        .catch((err) => { console.log(err) });
    
    
}

export default conn;