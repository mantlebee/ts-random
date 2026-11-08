# TypeScript Random

Utility functions to generate random data or extract random data from lists.

What changed in each version, and how to upgrade, is in the
[release notes](https://github.com/mantlebee/ts-random/tree/main/docs/release-notes)
([1.1.0](https://github.com/mantlebee/ts-random/blob/main/docs/release-notes/1.1.0.md),
[1.0.0](https://github.com/mantlebee/ts-random/blob/main/docs/release-notes/1.0.0.md)).

## Installation

`@mantlebee/ts-core` is a peer dependency: install it together with the package.

```sh
npm install @mantlebee/ts-random @mantlebee/ts-core
```

The package ships CommonJS and tree-shakable ES modules: bundlers keep only the
functions that are imported.

Each area also has its own entry point, which loads only that area and what it
uses: useful with CommonJS, which is not tree-shaken.

```ts
import { generateRandomPassword } from "@mantlebee/ts-random/passwords";
```

The areas are `arrays`, `booleans`, `colors`, `dates`, `numbers`, `passwords`,
`secure`, `seed` and `strings`.

Utilities about random data generation are separated by return type:

- [Boolean](#boolean)
  - [`generateRandomBoolean`](#generaterandomboolean)
- [Color](#color)
  - [`generateRandomColor`](#generaterandomcolor)
- [Date](#date)
  - [`generateRandomDate`](#generaterandomdate)
- [Number](#number)
  - [`generateRandomNumber`](#generaterandomnumber)
- [Password](#password)
  - [`generateRandomPassword`](#generaterandompassword)
- [Seed](#seed)
  - [`createSeededRandom`](#createseededrandom)
- [Secure](#secure)
  - [`generateSecureRandomInteger`](#generatesecurerandominteger)
  - [`extractSecureRandomItem`](#extractsecurerandomitem)
  - [`shuffleSecureRandomItems`](#shufflesecurerandomitems)
- [String](#string)
  - [`generateRandomStringFromChars`](#generaterandomstringfromchars)
  - [`generateRandomStringFromPattern`](#generaterandomstringfrompattern)

There is also a section about random data extraction from lists:

- [Array](#array)
  - [`extractRandomItem`](#extractrandomitem)
  - [`extractRandomItems`](#extractrandomitems)

Functions with `SecureRandom` in the name, and `generateRandomPassword`, use a
cryptographically secure random generator (Web Crypto, available in browsers and
in Node.js 19+). The others use `Math.random`, or the generator given in their
`random` option (see [Reproducible data](#reproducible-data)): don't use them
for passwords, tokens or other secrets.

## Reproducible data

The functions that use `Math.random` accept a `random` option, a generator
with the same contract as `Math.random`. With the one returned by
`createSeededRandom`, they generate the same values at every run, in Node.js
and in browsers: a failed test, a story or an E2E fixture can be reproduced
from its seed.

```ts
import {
  createSeededRandom,
  extractRandomItem,
  generateRandomBoolean,
  generateRandomDate,
  generateRandomNumber,
  generateRandomStringFromPattern,
} from "@mantlebee/ts-random";

const random = createSeededRandom(42);

// The same 5 rows at every run.
const users = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: extractRandomItem(["John", "Jane", "Josh", "Jasper"], false, {
    random,
  }),
  phone: generateRandomStringFromPattern("+39 0{3} 0{7}", { random }),
  age: generateRandomNumber(80, 18, 0, { random }),
  active: generateRandomBoolean({ random }),
  // A fixed `endDate`: its default, now, changes at every run.
  signedUpAt: generateRandomDate(new Date(2024, 11, 31), new Date(2024, 0, 1), {
    random,
  }),
}));
```

- The rule is the same for every function: the ones that have an `options`
  object accept `random` in it, such as `generateRandomDate`; the others accept
  a last, optional parameter `options?: { random?: RandomFn }`. Without it they
  use `Math.random`, as before.
- The generator has a state: the values depend on the seed **and** on the
  calls made before with it. Use a generator for each fixture, or a seed for
  each test, so adding a field or a row doesn't change the others.
- Seeded values are not affected by the time zone, except for
  `generateRandomDate`, which generates local dates.
- Seeded generators are predictable by design: never use them for secrets. The
  [secure](#secure) functions and `generateRandomPassword` don't accept a
  generator and always use Web Crypto.

## Errors

The functions throw only when an argument is not valid, or when the request
can't be satisfied:

- `RangeError` when a value is out of its range: an empty list, a `min` greater
  than its `max`, an invalid date, an option out of its bounds, …
- `SyntaxError` when a pattern of `generateRandomStringFromPattern` is malformed.
- A subclass of the `Exception` of `@mantlebee/ts-core` for the domain errors,
  which depend on what the arguments mean rather than on their form. Its
  `code` tells them apart, without checking the message. Today they are thrown
  by `generateRandomPassword` only: `NoAllowedCharsException` and
  `UnsatisfiableRequirementsException`, whose codes are in
  `GenerateRandomPasswordExceptionCodes`.

Messages start with the name of the function that found the error, e.g.
`generateRandomNumber: min 12 is greater than max 8`. It may be a function used
internally rather than the one called: `generateRandomStringFromPattern("a{12,8}")`
throws that same message, and `extractSecureRandomItem([])` one of
`generateSecureRandomInteger`. Messages are meant for developers: to handle an
error, check its class or its `code`, not its message.

## Why

The project was born to support another repository, [`@mantlebee/fake-data-only`](https://github.com/mantlebee/fake-data-only), which allows to generate tables of fake data, with specific columns type and restrictions and related data between tables. I decided to extract the random data generation in order to have a smaller and independent project.

## How To

Let's take a look at the utility functions, separated by return type.

### Array

Utilities about random data extraction from lists. Extracted data can be removed or not from the list.

#### `extractRandomItem`

Extracts a random item from an array. The extracted item can be removed or not from the array. Throws a `RangeError` if the array is empty.

```ts
function extractRandomItem<TItem>(
  items: List<TItem>,
  extractPhysically = false,
  options: { random?: RandomFn } = {},
): TItem;
```

Examples:

```ts
import { extractRandomItem } from "@mantlebee/ts-random";

const items: number[] = [1, 2, 3];

// Extracting a random number, without removing it from the array
extractRandomItem(items); // eg. 3
console.log(items); // [1,2,3]

// Extracting a random number, removing it from the array
extractRandomItem(items, true); // eg. 3
console.log(items); // [1,2]
```

#### `extractRandomItems`

Extracts a sub-list of items from an array. The length of the sub-list is random, from 0 to the length of the array, both included. The extracted items can be removed or not from the array.

```ts
function extractRandomItems<TItem>(
  items: List<TItem>,
  extractPhysically = false,
  options: { random?: RandomFn } = {},
): List<TItem>;
```

Examples:

```ts
import { extractRandomItems } from "@mantlebee/ts-random";

const items: number[] = [1, 2, 3];

// Extracting random items of random length, without removing them from the array
extractRandomItems(items); // eg. [1,3]
console.log(items); // [1,2,3]

// Extracting random items of random length, removing them from the array
extractRandomItems(items, true); // eg. [1,3]
console.log(items); // [2]
```

### Boolean

Utilities about random boolean generation.

#### `generateRandomBoolean`

Generates a random boolean value.

```ts
function generateRandomBoolean(options: { random?: RandomFn } = {}): boolean;
```

Examples:

```ts
import { generateRandomBoolean } from "@mantlebee/ts-random";

generateRandomBoolean(); // true or false
```

### Color

Utilities about random color generation. Color utilities refer to the [`IColor`](https://github.com/mantlebee/ts-core/blob/main/src/colors/interfaces.ts) interface and the [`Color`](https://github.com/mantlebee/ts-core/blob/main/src/colors/models.ts) class from the [`@mantlebee/ts-core`](https://github.com/mantlebee/ts-core) repository.

#### `generateRandomColor`

Generates a random [`IColor`](https://github.com/mantlebee/ts-core/blob/main/src/colors/interfaces.ts) instance. Colors can be opaque or have a random level of transparency. It is possible to restrict the range of colors to choose from, like reds only.

```ts
function generateRandomColor(
  transparent = false,
  from: IColor = new Color(0, 0, 0),
  to: IColor = new Color(255, 255, 255),
  options: { random?: RandomFn } = {},
): IColor;
```

Examples:

```ts
import { Color } from "@mantlebee/ts-core";
import { generateRandomColor } from "@mantlebee/ts-random";

// Generate a random and opaque color
generateRandomColor(); // eg. {alpha: 1, blue: 0, green: 136, red: 255}

// Generate a random color with random transparency
generateRandomColor(true); // eg. {alpha: 0.5, blue: 0, green: 136, red: 255}

// Generate a random opaque red color
const lightRed = new Color(255, 204, 204); // rgb
const darkRed = new Color(51, 0, 0); // rgb
generateRandomColor(false, lightRed, darkRed); // eg. {alpha: 1, blue: 0, green: 0, red: 153}
```

### Date

Utilities about random date generation.

#### `generateRandomDate`

Generates a random date between `startDate` and `endDate`, both included, whose time is within the given hours, minutes and seconds. Generated dates have no milliseconds, and each allowed second in the range has the same chance to be generated. The given dates are not modified.

```ts
type GenerateRandomDateOptions = {
  hoursFrom?: number; // 0-23, default 0
  hoursTo?: number; // 0-23, default 23
  minutesFrom?: number; // 0-59, default 0
  minutesTo?: number; // 0-59, default 59
  secondsFrom?: number; // 0-59, default 0
  secondsTo?: number; // 0-59, default 59
  random?: RandomFn; // default Math.random
};

function generateRandomDate(
  endDate: Date = new Date(),
  startDate: Date = new Date(1970, 0, 1),
  options: GenerateRandomDateOptions = {},
): Date;
```

- Each option range is an integer range with both ends included: e.g. `hoursFrom: 9, hoursTo: 17` allows the times from 09:00:00 to 17:59:59.
- Dates are in local time. Around a daylight saving time change, the local times that are skipped are never generated, and the ones that are repeated are generated at their first occurrence only.
- It throws a `RangeError` if a date is invalid, if `startDate` is after `endDate`, if an option is out of its range or its `from` is greater than its `to`, or if no date in the range has an allowed time.

Examples:

```ts
import { generateRandomDate } from "@mantlebee/ts-random";

// Generates a random date between 1970/01/01 and now.
generateRandomDate();

// Generates a random date of 2024, during the office hours.
generateRandomDate(new Date(2024, 11, 31, 23, 59, 59), new Date(2024, 0, 1), {
  hoursFrom: 9,
  hoursTo: 17,
}); // eg. 2024-05-14 10:27:41
```

### Number

Utilities about random integer and float number generation.

#### `generateRandomNumber`

Generates a random integer/float number between the given min and max values, both included. To return an integer leave `decimals` to 0. Every number with `decimals` digits after the decimal point, between min and max, has the same chance to be generated. It throws a `RangeError` if `min` is greater than `max`, if `decimals` is not a non-negative integer, or if no number with `decimals` digits is between min and max.

```ts
function generateRandomNumber(
  max: number,
  min = 0,
  decimals = 0,
  options: { random?: RandomFn } = {},
): number;
```

Examples:

```ts
import { generateRandomNumber } from "@mantlebee/ts-random";

// Generates a random number between 0 and 100.
generateRandomNumber(100);
// eg. 42

// Generates a random number between 1 and 10.
generateRandomNumber(10, 1);
// eg. 7

// Generates a random number between 0 and 1, with 2 decimals.
generateRandomNumber(1, 0, 2);
// eg. 0.42
```

### Password

Utilities about password generation. Passwords are generated from the password requirements of [`@mantlebee/ts-core`](https://github.com/mantlebee/ts-core) (`IPasswordRequirement`, `PasswordRequirementsDefault`, …).

#### `generateRandomPassword`

Generates a random password that satisfies the given requirements, using a cryptographically secure random generator only.

```ts
function generateRandomPassword(
  requirements: List<IPasswordRequirement> = PasswordRequirementsDefault(),
): string;
```

- The password contains one char for each requirement with `allowedChars`, then chars picked uniformly from all the allowed chars, until it is valid for `validatePassword`. The chars are shuffled at the end.
- The length is defined by the requirements only (e.g. `PasswordRequirementLength`): the password is as short as the requirements allow, and never more than 256 chars, to avoid infinite loops when there is no maximum length.
- It throws a `NoAllowedCharsException` when no requirement has `allowedChars` (`code` is `GenerateRandomPasswordExceptionCodes.NoAllowedChars`), or an `UnsatisfiableRequirementsException` when the requirements can't be satisfied, e.g. a `minLength` greater than a `maxLength` or a `PasswordRequirementMatchPassword` (`code` is `GenerateRandomPasswordExceptionCodes.UnsatisfiableRequirements`). Both extend the `Exception` of `@mantlebee/ts-core`.

Examples:

```ts
import {
  PasswordRequirementIncludesLowercaseLetter,
  PasswordRequirementIncludesSymbol,
  PasswordRequirementLength,
  PasswordRequirementsDefault,
} from "@mantlebee/ts-core";
import { generateRandomPassword } from "@mantlebee/ts-random";

// 8-30 chars, lowercase, uppercase, number, symbol, no whitespaces.
generateRandomPassword(); // 8 chars, eg. "q7}Rk;bN"

// 24 chars with the default categories.
generateRandomPassword([
  ...PasswordRequirementsDefault(),
  new PasswordRequirementLength(24),
]);

// Lowercase letters and the symbols - and _ only, 12 chars.
generateRandomPassword([
  new PasswordRequirementLength(12, 12),
  new PasswordRequirementIncludesLowercaseLetter(),
  new PasswordRequirementIncludesSymbol("-_"),
]); // 12 chars, eg. "kd-qe_wnz-ab"
```

### Seed

Utilities to generate reproducible data: see [Reproducible data](#reproducible-data).

#### `createSeededRandom`

Creates a random generator that returns the same sequence of numbers for the same seed, in Node.js and in browsers. Like `Math.random`, each call returns a number in [0, 1). It uses mulberry32, a small generator with a 32-bit state: good for test data, not for secrets. `seed` must be an integer, otherwise a `RangeError` is thrown; seeds that differ by a multiple of 2^32 generate the same sequence.

```ts
type RandomFn = () => number;

function createSeededRandom(seed: number): RandomFn;
```

Examples:

```ts
import { createSeededRandom, generateRandomNumber } from "@mantlebee/ts-random";

const random = createSeededRandom(42);
random(); // 0.6011037519201636, at every run

// The same number between 1 and 10 at every run.
generateRandomNumber(10, 1, 0, { random: createSeededRandom(42) });
```

### Secure

Utilities that use a cryptographically secure random generator: Web Crypto (`globalThis.crypto.getRandomValues`), available in browsers and in Node.js 19+. Use them, or `generateRandomPassword`, for passwords, tokens or other secrets.

They, and `generateRandomPassword`, don't accept a `random` option: a seeded or
custom generator would make the secrets predictable.

#### `generateSecureRandomInteger`

Generates a cryptographically secure random integer between 0 (included) and `maxExclusive` (excluded), without modulo bias. Unlike `generateRandomNumber`, the max value is **excluded**, so the result can be used directly as an index of a list of `maxExclusive` items. `maxExclusive` must be an integer between 1 and 2^32, otherwise a `RangeError` is thrown.

```ts
function generateSecureRandomInteger(maxExclusive: number): number;
```

Examples:

```ts
import { generateSecureRandomInteger } from "@mantlebee/ts-random";

// Rolls a dice.
generateSecureRandomInteger(6) + 1;
// eg. 4
```

#### `extractSecureRandomItem`

Extracts a random item from an array, using a cryptographically secure random generator. The array is not modified. Throws a `RangeError` if the array is empty.

```ts
function extractSecureRandomItem<TItem>(items: List<TItem>): TItem;
```

Examples:

```ts
import { extractSecureRandomItem } from "@mantlebee/ts-random";

extractSecureRandomItem(["rock", "paper", "scissors"]); // eg. "paper"
```

#### `shuffleSecureRandomItems`

Returns a shuffled copy of an array (Fisher-Yates), using a cryptographically secure random generator. The array is not modified.

```ts
function shuffleSecureRandomItems<TItem>(items: List<TItem>): List<TItem>;
```

Examples:

```ts
import { shuffleSecureRandomItems } from "@mantlebee/ts-random";

const items: number[] = [1, 2, 3, 4];
shuffleSecureRandomItems(items); // eg. [3, 1, 4, 2]
console.log(items); // [1,2,3,4]
```

### String

Utilities to generate random strings. It is possible to choose between a chars array or give a pattern.

#### `generateRandomStringFromChars`

Generates a random string from the given chars and of the given length.

```ts
function generateRandomStringFromChars(
  chars: string,
  length: number,
  options: { random?: RandomFn } = {},
): string;
```

Examples:

```ts
// Generates a random string of 5 chars chosen between X and Y.
generateRandomStringFromChars("XY", 5);
// eg. XXYXY
```

#### `generateRandomStringFromPattern`

Generates a random string from the given pattern. The length of the string depends on pattern itself.

Patterns allow to generate strings like telephone numbers, credit card numbers, banking IBAN, etc.

Patterns are defined by placeholders, escape brackets and repeater brackets. Any other char is copied as it is.

| Placeholders |                                                     |
| ------------ | --------------------------------------------------- |
| **`A`**      | random uppercase letter                             |
| **`a`**      | random lowercase letter                             |
| **`0`**      | random digit                                        |
| **`mm`**     | two-digit month, from 01 (January) to 12 (December) |

| Escape brackets     |                                                            |
| ------------------- | ---------------------------------------------------------- |
| **`(`** ... **`)`** | chars inside are copied as they are, placeholders included |

| Repeater brackets, after `A`, `a` or `0` |                                                                |
| ---------------------------------------- | -------------------------------------------------------------- |
| **`{`** n **`}`**                        | the placeholder generates n chars                              |
| **`{`** n **`,`** M **`}`**              | the placeholder generates between n and M chars, both included |

It throws a `SyntaxError` if an escape bracket is not closed, and a `RangeError` if the min of a repeater is greater than its max, e.g. `a{12,8}`.

```ts
function generateRandomStringFromPattern(
  pattern: string,
  options: { random?: RandomFn } = {},
): string;
```

Examples:

```ts
import { generateRandomStringFromPattern } from "@mantlebee/ts-random";

// Generates a random telephone number.
generateRandomStringFromPattern("+000-00000"); // or "+0{3}-0{5}"
// eg. +333-41187

// Generates a random card due-date.
generateRandomStringFromPattern("mm/00");
// eg. 05/24

// Generates a random credit card number.
generateRandomStringFromPattern("0000-0000-0000-0000"); // or "0{4}-0{4}-0{4}-0{4}"
// eg. 3244-6512-9983-2379

// Generates a random italian IBAN compliant string.
generateRandomStringFromPattern("(IT)00A0{22}");
// eg. IT60X0542811101000000123456

// Generates a string with first letter uppercase, followed by 8 to 12 lowercase letters (9 to 13 chars in total).
generateRandomStringFromPattern("Aa{8,12}");
// eg. Rdnaetdaw
```
