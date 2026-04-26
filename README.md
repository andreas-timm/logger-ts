# @andreas-timm/logger

Small Bun-first logging utilities built on top of `winston`.

## Features

- Create a configured `winston` logger with console output.
- Add a synchronous file transport by passing an output path.
- Truncate an output file on logger creation with `flag: "w"`.
- Prefix debug messages consistently while keeping the API small.

## Install

```sh
bun add @andreas-timm/logger
```

## Usage

```ts
import { getLogger } from "@andreas-timm/logger";

const logger = getLogger();

logger.info("Application started");
logger.error("File not found");
```

To write log lines to a file as well as the console:

```ts
import { getLogger } from "@andreas-timm/logger";

const logger = getLogger({
    flag: "w",
    output: "tmp/app.log",
});

logger.info("Written to console and file");
```

Pass `file: false` to keep the same options object shape while disabling file output.
