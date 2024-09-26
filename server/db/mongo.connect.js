import mongoose from 'mongoose'

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log('Database connected')
    } catch (error) {
        console.log('Error while connecting to Database', error.message)
    }
}

export default connectToMongoDB