import Ably from "ably/build/ably-webworker.min";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

export async function onRequestGet(context) {
  const { env } = context;

  const client = new Ably.Rest.Promise(env.ABLY_CLIENT_SIDE_API_KEY);

  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomName,
  });

  return new Response(JSON.stringify(tokenRequestData), {
    headers: { "Content-Type": "application/json" },
  });
}
