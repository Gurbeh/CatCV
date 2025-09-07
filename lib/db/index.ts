import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the postgres client
// For serverless environments, we want to limit connections
const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the drizzle database instance
export const db = drizzle(client, { schema });

// Export the client for direct access if needed
export { client };

// Export all schema types and tables for convenience
export * from './schema';

// Helper function to close the connection (useful for cleanup in serverless)
export const closeConnection = async () => {
  await client.end();
};