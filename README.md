<p align="center">
  <a href="https://www.earnalliance.com?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://www.earnalliance.com/new/svgs/ea_logo.svg" alt="Earn Alliance" width="280">
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/@earnalliance/node.svg)](https://www.npmjs.com/package/@earnalliance/node)
![Test](https://github.com/earn-alliance/earnalliance-js/workflows/Tests/badge.svg)
[![Discord](https://img.shields.io/discord/926167446648397836)](http://discord.gg/2VqABVytBZ)

# Official Earn Alliance SDKs for JavaScript

This is the Earn Alliance JavaScript SDKs, comprised in the `@earnalliance/` namespace.

## Links

- [![Discord](https://img.shields.io/discord/926167446648397836)](http://discord.gg/2VqABVytBZ)
- [![Twitter Follow](https://img.shields.io/twitter/follow/earnalliance?label=Earn%20Alliance&style=social)](https://twitter.com/intent/follow?screen_name=earnalliance)

## Contents

- [Supported Platforms](#supported-platforms)
- [Installation and Usage](#installation-and-usage)

## Supported Platforms

We are currently supporting the NodeJS platform:

- [`@earnalliance/node`](https://github.com/earn-alliance/earnalliance-js/tree/master/packages/node): SDK for Node

## Installation and Usage

To install a SDK, simply add the package, for example:

```sh
npm install --save @earnalliance/node
yarn add @earnalliance/node
```

### Initialize

Setup client so it can start sending events!

```javascript
// CJS syntax
const Alliance = require('@earnalliance/node');
// ESM syntax
import * as Alliance from '@earnalliance/node';

const alliance = Alliance.init({
  clientId: '[client id]',
  clientSecret: '[client secret]',
  gameId: '[game id]',

  // Optional
  dsn: '...',
});
```

The client configuration can also be read from environment variables if not
provided as an option.

```javascript
// If the client id, secret, game id and dsn are not specific, the init
// function will by default look for the environment variables
// `ALLIANCE_CLIENT_ID`, `ALLIANCE_CLIENT_SECRET`, `ALLIANCE_GAME_ID` and
// `ALLIANCE_DSN`.
const alliance = Alliance.init();
```

### Set User Identifiers

Whenever a new user identifier is set, or a new user is registered, you can add or update the identifiers associated with the internal user id.

This is used to tell us the user has installed the app and enrich information when more game platform accounts or social accounts are added to help us map the user to the game events.

```javascript
// This shows all of our currently supported platforms, but you only need to
// provide the identifiers that are relevant for your game.
alliance.setUserIdentifiers('[internal user id]', {
  'appleId': '...'
  'discordId': '...',
  'email': 'hello@earnalliance.com',
  'epicGamesId': '...',
  'steamId': '...',
  'twitterId': '...',
  'walletAddress': '0x00.00',
});
```

Note that if you pass any falsey value identifier to `setUserIdentifiers`, it will be ignored.
This is the avoid unintentionally removing previously set identifiers. If you want
to remove previously set identifiers, use the `removeUserIdentifiers` function.

```javascript
alliance.removeUserIdentifiers('[internal user id]', ['steamId', 'appleId']);
```

### Track User Start Session

Sends standard TRACK event for launching a game. This let's us know that the user
has the game launched and is ready to start a challenge.

```javascript
alliance.startGame('[internal user id]');
```

### Track Events

Tracking events that happens in a game. Tracked events are batched together and sent after 30 seconds interval, or when a batch size of 100 events have 
accumulated, whichever comes first. Both the interval and the batch size are
configurable in the client options.

The name of the events can be almost anything, but we recommend sticking to
common terms as shown in the following examples.

```javascript
// An event without any specific value, commonly used for counting event
// instances, i.e. "Kill X Zombies".
alliance.track('[internal user id]', 'KILL_ZOMBIE');

// An event with an associated value, commonly used for accumulating or
// checking min / max values, i.e. "Score a total of X" or "Achieve a
// highscore of at least X".
alliance.track('[internal user id]', 'SCORE', 100);

// The client can track events for multiple users in parallel.
alliance.track('[internal user id]', 'DAMAGE_DONE', 500);
alliance.track('[another user id]', 'DAMAGE_TAKEN', 500);

// Additional traits can be added to the event, which can be used to
// create more detailed challenges, i.e. "Kill X monsters with a knife".
alliance.track('[internal user id]', 'KILL', { weapon: 'knife', mob: 'zombie' });
```

### Group Tracked Events

You can group events together, i.e. a game round or a match, whichever makes
sense for your game. This allows for natural challenge scopes like "Kill X players
in a match".

```javascript
// Generates unique group id which will be associated with all the events
const round = alliance.startRound();
round.track('[internal user id]', 'KILL_ZOMBIE');

// Additional traits can be set when starting the round, which will be added
// to all events that are tracked for the specific round.
const round = alliance.startRound({ map: 'nuclear_wasteland' });
round.track('[internal user id]', 'KILL_ZOMBIE');
```

### Flush event queue

For events that have higher priority (i.e. setUserIdentifiers), instead of
initiating a scheduled batch, they trigger the use of an event queue flush.
This means that as long as the client has not been flushed prior to the event,
the event will be sent to the api right away.

Once the queue has been has been flushed, the client enters a 10 second cooldown
period, during which any subsequent calls to flush, will wait for the cooldown
to finish, before it's triggered. Not that any normal procedures, like the queue
size reaches the batch limit, will still send the events to the api.

The `flush` function can also be called manually on the client instance, but
it is still restricted by the same cooldown mechanic.

```javascript
alliance.flush();
```
