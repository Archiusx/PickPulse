import client from './db';

export async function GET(request: Request) {
  try {
    await client.connect();
    const database = client.db('pickpulse');
    const collection = database.collection('inventory');
    
    const items = await collection.find({}).toArray();
    
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
