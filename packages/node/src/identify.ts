import type { IdentifyingProperties, IIdentifier } from './types';
import { EnumIdentifierPropNames } from './types';

export function identify(userId: string, identifyingProperties: IdentifyingProperties): IIdentifier {
  const identifiers: IIdentifier = { userId };

  Object.values(EnumIdentifierPropNames).forEach(prop => {
    if (identifyingProperties[prop]) identifiers[prop] = identifyingProperties[prop];
  });

  return identifiers;
}

export function clearIdentifiers(userId: string, propertyNames: EnumIdentifierPropNames[]): IIdentifier {
  const identifier: IIdentifier = { userId };

  propertyNames.forEach(prop => (identifier[prop] = null));

  return identifier;
}
