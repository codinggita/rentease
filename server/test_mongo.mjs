import mongoose from 'mongoose';
import dns from 'node:dns';

// Force Google DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = 'mongodb+srv://ronitkumar:ronit%2378@cluster0.at6exlm.mongodb.net/rentease?appName=Cluster0';

console.log('Attempting to connect to MongoDB Atlas...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  });
  console.log('✅ MongoDB Connected:', conn.connection.host);
  console.log('Database:', conn.connection.name);
  
  // List existing collections
  const collections = await conn.connection.db.listCollections().toArray();
  console.log('Existing collections:', collections.map(c => c.name));
  
  // Create the 'password' collection if it doesn't exist
  const collectionNames = collections.map(c => c.name);
  if (!collectionNames.includes('password')) {
    await conn.connection.db.createCollection('password');
    console.log('✅ Created "password" collection');
  } else {
    console.log('✅ "password" collection already exists');
  }
  
  // Verify the collection
  const finalCollections = await conn.connection.db.listCollections().toArray();
  console.log('Final collections:', finalCollections.map(c => c.name));
  
  await mongoose.disconnect();
  console.log('✅ Disconnected successfully');
} catch (error) {
  console.error('❌ Connection Error:', error.message);
  if (error.message.includes('whitelist') || error.message.includes('connect')) {
    console.error('→ Your IP is not whitelisted in MongoDB Atlas.');
    console.error('→ Go to MongoDB Atlas > Network Access > Add IP Address > Allow from Anywhere');
  }
  process.exit(1);
}
