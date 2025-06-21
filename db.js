import { MongoClient } from "mongodb";
import assert from 'assert'
import dotenv from 'dotenv';
dotenv.config();
// Replace the following with your Atlas connection string                                                                                                                                        
const uri = process.env.MONGO_URI;
// Connect to your Atlas cluster
const client = new MongoClient(uri);





// Conexión reutilizable
let db;

export async function connect() {
  try {
    await client.connect();
    db = client.db("auth_db");
    console.log("✅ MongoDB Atlas conectado");
    return db;
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    throw err;
  }
}

export function getDb() {
  if (!db) throw new Error("Primero llama a connect()");
  return db;
}

// Para cerrar la conexión manualmente (opcional)
export async function close() {
  await client.close();
}


// export async function run() {
//     try {
//         await client.connect();
//         console.log("Successfully connected to Atlas");

//     } catch (err) {
//         console.log(err.stack);
//     }
//     finally {
//         await client.close();
//     }
// }

//  export async function run() {
//     try {
//         // Connect to the Atlas cluster
//          await client.connect();
//          // Get the database and collection on which to run the operation
//          const db = client.db("auth_db")
//          const col = db.collection("users");

//          // Create new documents                                                                                                                                         
//          const peopleDocuments = [
//            {
//             "fullName": "Willian",
//             "email": "magictv843@gmail.com",
//             "password": "123456wt",
//             "cedula": "11111111112"
//            },
//            {
//             "fullName": "Faribel Manito Lindo",
//             "email": "wmeteliengmail.com",
//             "password": "123456wt",
//             "cedula": "11111111115"
//            }
        
//          ]
//          // Insert the documents into the specified collection        
//          const p = await col.insertMany(peopleDocuments);

//          console.log(p)
//         } catch (err) {
//          console.log(err.stack);
//      }
//      finally {
//         await client.close();
//     }

//   }
// run().catch(console.dir);