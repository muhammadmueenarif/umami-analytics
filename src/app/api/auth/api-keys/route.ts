import { json, unauthorized } from '@/lib/response';
import { parseRequest } from '@/lib/request';
import { getUser, updateUser } from '@/queries';
import { hash, getRandomChars } from '@/lib/crypto';
import prisma from '@/lib/prisma';

// Generate API key with prefix
function generateApiKey(): string {
  const randomPart = getRandomChars(32);
  return `hf_${randomPart}`;
}

// GET - Get current API key (masked)
export async function GET(request: Request) {
  const { auth, error } = await parseRequest(request);

  if (error || !auth?.user) {
    return unauthorized();
  }

  const user = await getUser(auth.user.id);

  if (!user) {
    return unauthorized();
  }

  // Return masked API key if exists
  const hasApiKey = !!user.apiKeyHash;
  const maskedKey = hasApiKey ? `hf_${'*'.repeat(32)}` : null;

  return json({
    hasApiKey,
    maskedKey,
  });
}

// POST - Generate new API key
export async function POST(request: Request) {
  const { auth, error } = await parseRequest(request);

  if (error || !auth?.user) {
    return unauthorized();
  }

  const user = await getUser(auth.user.id);

  if (!user) {
    return unauthorized();
  }

  // Generate new API key
  const apiKey = generateApiKey();
  const apiKeyHash = hash(apiKey, process.env.APP_SECRET || process.env.DATABASE_URL);

  // Update user with hashed API key
  await updateUser(user.id, {
    apiKeyHash,
  });

  // Return the plain API key (only shown once)
  return json({
    apiKey,
    message: 'API key generated successfully. Please save it securely.',
  });
}

// DELETE - Revoke API key
export async function DELETE(request: Request) {
  const { auth, error } = await parseRequest(request);

  if (error || !auth?.user) {
    return unauthorized();
  }

  const user = await getUser(auth.user.id);

  if (!user) {
    return unauthorized();
  }

  // Remove API key
  await updateUser(user.id, {
    apiKeyHash: null,
  });

  return json({
    message: 'API key revoked successfully',
  });
}

