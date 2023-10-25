import type { IdentifyingProperties, IIdentifier } from './types';

export function identify(userId: string, identifyingProperties: IdentifyingProperties): IIdentifier {
  const { appleId, discordId, email, epicGamesId, steamId, twitterId, walletAddress } = identifyingProperties;

  const identifiers: IIdentifier = { userId };

  if (appleId) identifiers.appleId = appleId;
  if (discordId) identifiers.discordId = discordId;
  if (email) identifiers.email = email;
  if (epicGamesId) identifiers.epicGamesId = epicGamesId;
  if (steamId) identifiers.steamId = steamId;
  if (twitterId) identifiers.twitterId = twitterId;
  if (walletAddress) identifiers.walletAddress = walletAddress;

  return identifiers;
}
