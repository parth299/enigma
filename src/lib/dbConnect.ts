import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

const dbConnect = async(): Promise<void> => {

    if(connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || '', {}) 
        //study these{} options from documentation

        connection.isConnected = db.connections[0].readyState
        console.log("Database connected successfully");
        console.log(db);
        console.log(db.connections);

    } catch (error) {

        console.log("Some error occured while connecting to database :: ", error);
        process.exit(1);

    }
}

export default dbConnect;