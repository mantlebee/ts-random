`ts-random`

# TypeScript Random

Utilities functions to generate or extract random data.

#### Examples

```ts
import {
  generateRandomBoolean,
  generateRandomNumber,
  generateRandomStringFromPattern,
} from "@mantlebee/ts-random";

// Random boolean
generateRandomBoolean(); // returns true or false

// Generates a random number between 0 and 10.
generateRandomNumber(10); // eg. 7
// Generates a random number between 1 and 10.
generateRandomNumber(10, 1); // eg. 5
// Generates a random number between 0 and 1.
generateRandomNumber(0, 1, 2); // eg. 0.24

// Generates a random telephone number.
generateRandomStringFromPattern("+000-00000"); // eg. +333-4118
// Generates a random credit card number.
generateRandomStringFromPattern("0000-0000-0000-0000"); // eg. 3244-6512-9983-2379
// Generates a random italian IBAN compliant string.
generateRandomStringFromPattern("(IT)00A0{22}"); // eg. IT60X0542811101000000123456
// Generates a random lowercase string with first letter uppercase and length variable between 8 and 12 chars.
generateRandomStringFromPattern("Aa{8,12}"); // eg. Rdnaetdaw

// etc.
// more helpers functions for date, strings, colors and to extract random values from arrays
```
