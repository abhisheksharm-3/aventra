"use server";
import { Client, Account, Users } from "node-appwrite";
import { cookies } from "next/headers";

/**
 * Creates a client with user session
 * @returns Client with account methods
 * @throws {Error} If environment variables are missing or session is not found
 */
export async function createSessionClient() {
    try {
        // Validate environment variables
        const endpoint = process.env.APPWRITE_ENDPOINT;
        const projectId = process.env.APPWRITE_PROJECT_ID;
        
        if (!endpoint || !projectId) {
            throw new Error("Missing required environment variables");
        }
        
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId);

        // Get user session
        const userCookies = await cookies();
        const session = userCookies.get("user-session");
        
        if (!session?.value) {
            throw new Error("No valid session found");
        }

        client.setSession(session.value);

        return {
            get account() {
                return new Account(client);
            },
        };
    } catch (error) {
        console.error("Session client creation failed:", error);
        throw error instanceof Error ? error : new Error("Unknown error creating session client");
    }
}

/**
 * Creates an admin client with API key
 * @returns Client with admin privileges
 * @throws {Error} If environment variables are missing
 */
export async function createAdminClient() {
    try {
        // Validate environment variables
        const endpoint = process.env.APPWRITE_ENDPOINT;
        const projectId = process.env.APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_KEY;
        
        if (!endpoint || !projectId || !apiKey) {
            throw new Error("Missing required environment variables");
        }
        
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(apiKey);

        return {
            get account() {
                return new Account(client);
            },
        };
    } catch (error) {
        console.error("Admin client creation failed:", error);
        throw error instanceof Error ? error : new Error("Unknown error creating admin client");
    }
}

/**
 * Creates and returns a Users service with admin privileges
 * @returns Users service for administrative operations
 * @throws {Error} If environment variables are missing
 */
export async function createUsersAdmin() {
    try {
        // Validate environment variables
        const endpoint = process.env.APPWRITE_ENDPOINT;
        const projectId = process.env.APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_KEY;
        
        if (!endpoint || !projectId || !apiKey) {
            throw new Error("Missing required environment variables");
        }
        
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(apiKey);

        return new Users(client);
    } catch (error) {
        console.error("Users admin creation failed:", error);
        throw error instanceof Error ? error : new Error("Unknown error creating users admin");
    }
}

/**
 * Gets the currently logged in user
 * @returns User object or null if not logged in
 */
export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        console.error("Failed to get logged in user:", error);
        return null;
    }
}