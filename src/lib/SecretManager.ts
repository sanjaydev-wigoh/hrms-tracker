// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// const client = new SecretManagerServiceClient();
// let isInitialized = false;

// export async function loadClerkSecrets(): Promise<void> {
//     if (isInitialized) return;

//     const projectId = process.env.GOOGLE_CLOUD_PROJECT;
//     if (!projectId) throw new Error('GOOGLE_CLOUD_PROJECT env var not set');
//     const [version] = await client.accessSecretVersion({
//         name: `projects/${projectId}/secrets/wigoh-hrms/versions/latest`,
//     });
//     const secret = version.payload?.data?.toString()
//     if (!secret) throw new Error("Secret not accessible")
//     const secretJson = JSON.parse(secret)

//     Object.entries(secretJson).map((k) => {
//         process.env[ k[0]] = <string>k[1];
//     })
//     isInitialized = true;
// }
