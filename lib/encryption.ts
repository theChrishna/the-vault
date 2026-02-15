import crypto from 'crypto';

/**
 * Encryption utility for securing time capsule data
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits (recommended for GCM)
const AUTH_TAG_LENGTH = 16; // 128 bits
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;

/**
 * Get the encryption secret from environment variables
 */
function getEncryptionSecret(): string {
    const secret = process.env.ENCRYPTION_SECRET;
    if (!secret) {
        throw new Error('ENCRYPTION_SECRET is not defined in environment variables');
    }
    return secret;
}

/**
 * Derive a unique encryption key for a specific user
 * Uses PBKDF2 with the user ID as salt for deterministic per-user keys
 */
export function deriveUserKey(userId: string): Buffer {
    const secret = getEncryptionSecret();

    // Create a deterministic salt from userId
    // This allows us to always derive the same key for the same user
    const salt = crypto.createHash('sha256').update(userId).digest();

    // Derive key using PBKDF2
    const key = crypto.pbkdf2Sync(
        secret,
        salt,
        PBKDF2_ITERATIONS,
        KEY_LENGTH,
        'sha256'
    );

    return key;
}

/**
 * Encrypt plaintext data for a specific user
 * Returns format: iv:authTag:encryptedData (all base64 encoded)
 */
export function encrypt(plaintext: string, userId: string): string {
    if (!plaintext) {
        return '';
    }

    try {
        const key = deriveUserKey(userId);
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const authTag = cipher.getAuthTag();

        // Combine IV, auth tag, and encrypted data
        const result = `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;

        return result;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt encrypted data for a specific user
 * Expects format: iv:authTag:encryptedData (all base64 encoded)
 */
export function decrypt(encrypted: string, userId: string): string {
    if (!encrypted) {
        return '';
    }

    try {
        const parts = encrypted.split(':');

        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }

        const [ivBase64, authTagBase64, encryptedData] = parts;

        const key = deriveUserKey(userId);
        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Check if a string appears to be encrypted (has the expected format)
 */
export function isEncrypted(data: string): boolean {
    if (!data) return false;
    const parts = data.split(':');
    return parts.length === 3;
}
