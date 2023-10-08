`ts-random`

# TypeScript Random

Utilities functions to generate random data or extract random data from lists.

Utilities about random data generation are spearated by return type:

- [Boolean](#boolean)
  - [`generateRandomBoolean`](#generaterandomboolean)
- [Color](#color)
  - [`generateRandomColor`](#generaterandomcolor)
- [Number](#number)
  - [`generateRandomNumber`](#generaterandomnumber)
- [String](#string)
  - [`generateRandomStringFromChars`](#generaterandomstringfromchars)
  - [`generateRandomStringFromPattern`](#generaterandomstringfrompattern)

There is also a section about random data exctraction from lists:

- [Array](#array)
  - [`extractRandomItem`](#extractrandomitem)
  - [`extractRandomItems`](#extractrandomitems)

## Why

The project borns to support another repository, [`@mantlebee/fake-data-only`](https://github.com/mantlebee/fake-data-only), which allows to generate tables of fake data, with specific columns type and restrictions and related data between tables. I decided to extract the random data generation in order to have a smaller and indipendent project.

## How To

Let' take a look at the utilities functions, separated by return type

### Array

Utilities about random data extraction from lists. Extracted data can be removed or not from the list.

#### `extractRandomItem`

Extracts a random item from an array. The extracted item can be removed or not from the array.

```ts
function extractRandomItem<TItem>(
  items: List<TItem>,
  extractPhysically = false
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

Extracts a sub-list of items from an array. The length of the sub-list is random. The extracted items can be removed or not from the array.

```ts
function extractRandomItems<TItem>(
  items: List<TItem>,
  extractPhysically = false
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
function generateRandomBoolean(): boolean;
```

Examples:

```ts
import { generateRandomBoolean } from "@mantlebee/ts-random";

generateRandomBoolean(); // true or false
```

### Color

Utilities about random color generation. Color utilities refer to the [`IColor`](https://github.com/mantlebee/ts-core/blob/main/src/colors/interfaces.ts) interface and the [`Color`](https://github.com/mantlebee/ts-core/blob/main/src/colors/models.ts) class from the [`@mantlebee/ts-core`](https://github.com/mantlebee/ts-core) repository.

#### `generateRandomColor`

Generates a random [`IColor`](https://github.com/mantlebee/ts-core/blob/main/src/colors/interfaces.ts) instance. Colors can be opaque or have a random level of transparency. It is possible to restrict the range of colors between to choose, like reds only.

```ts
function generateRandomColor(
  transparent = false,
  from: IColor = new Color(0, 0, 0),
  to: IColor = new Color(255, 255, 255)
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

### Number

Utilities about random integer and float number generation.

#### `generateRandomNumber`

Generates a random integer/float number between the given min and max values, both included. To return an integer leave `decimals` to 0. If `decimals` is greater than 0, the max value will be an integer anyway.

```ts
function generateRandomNumber(max: number, min = 0, decimals = 0): number;
```

Examples

```ts
import { generateRandomNumber } from "@mantlebee/ts-random";

// Generates a random number between 0 and 10.
generateRandomNumber(100);
// eg. 42

// Generates a random number between 1 and 10.
generateRandomNumber(10, 1);
// eg. 7

// Generates a random number between 0 and 1.
generateRandomNumber(0, 1, 2);
// eg. 0.42
```

### String

Utilities to generate random strings. It is possible to choose between a chars array or give a pattern.

#### `generateRandomStringFromChars`

Generates a random string from the given chars and of the given length.

```ts
function generateRandomStringFromChars(chars: string, length: number): string;
```

Examples:

```ts
// Generates a random string of 5 chars chosen between X and Y.
generateRandomStringFromChars("XY", 5);
// eg. XXYXY
```

#### `generateRandomStringFromPattern`

Generates a random string from the given pattern. The length of the string depends on pattern itself.

Patterns allow to generate strings like telephone numbers, credit card numbers, banking IBAN, ecc.

Patterns are defined by special chars, escape brackets and repeater brackets:

|Special Chars||
|-|-|
|**`A`**|random uppercase letter|
|**`a`**|random lowercase letter|
|**`0`**|random integer number|

|Escape brackets||
|-|-|
|**`(`** ... **`)`**|chars inside are not considered special chars|

|Repeater brackets||
|-|-|
|**`{`** n **`}`**|repeats previous special char n-1 times|
|**`{`** n **`,`** M **`}`**|repeats previous special char between n and M times minus one|

```ts
function generateRandomStringFromPattern(pattern: string): string
```

Examples:

```ts
import { generateRandomStringFromPattern } from "@mantlebee/ts-random";

// Generates a random telephone number.
generateRandomStringFromPattern("+000-00000") // or "+0{3}-0{5}"
// eg. +333-41187

// Generates a random credit card number.
generateRandomStringFromPattern("0000-0000-0000-0000") // or "0{4}-0{4}-0{4}-0{4}"
// eg. 3244-6512-9983-2379

// Generates a random italian IBAN compliant string.
generateRandomStringFromPattern("(IT)00A0{22}")
// eg. IT60X0542811101000000123456

// Generates a random lowercase string with first letter uppercase and length variable between 8 and 12 chars.
generateRandomStringFromPattern("Aa{8,12}")
// eg. Rdnaetdaw
```