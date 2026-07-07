---
name: andreas-timm-logger
description: Use when adding or reviewing logging in TypeScript or Bun projects with @andreas-timm/logger, including getLogger setup, console and file output, log levels, debug messages, and logging errors or warnings with Winston's native second argument.
---

# @andreas-timm/logger

Use this skill when writing code or examples that use `@andreas-timm/logger`.

## Core Usage

Import `getLogger` from the package and create one logger near the entry point or module boundary that owns logging.

```ts
import { getLogger } from "@andreas-timm/logger";

const logger = getLogger();

logger.info("Application started");
```

Use the exported `Logger` type when passing a logger through your own APIs.

```ts
import { getLogger, type Logger } from "@andreas-timm/logger";

function run(logger: Logger) {
    logger.info("Running job");
}

run(getLogger());
```

## File Output

Pass `output` to write log lines to both the console and a synchronous file transport. Add `flag: "w"` when the log file should be truncated when the logger is created.

```ts
import { getLogger } from "@andreas-timm/logger";

const logger = getLogger({
    flag: "w",
    output: "tmp/app.log",
});

logger.info("Written to console and file");
```

Pass `file: false` when code should keep the same options shape but disable file output.

```ts
const logger = getLogger({
    file: false,
    output: "tmp/app.log",
});
```

Pass `level` when the caller needs a Winston log level such as `"debug"` or `"info"`. Debug messages are prefixed by the package formatter.

```ts
const logger = getLogger({ level: "debug" });

logger.debug("Parsed configuration");
```

## Error and Warning Logging

For errors and warnings with an attached cause, use Winston's native `(message, meta)` method shape: put operation context in the first argument and pass the `Error` object as the second argument.

```ts
try {
    await loadConfig();
} catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));

    logger.error("Failed to load configuration", cause);
}
```

Prefer these patterns:

```ts
logger.error("Failed to process invoice", error);
logger.warn("Could not read optional cache; continuing without it", error);
```

Avoid these patterns:

```ts
logger.error(error);
logger.error(error.message);
logger.error(`Failed to process invoice: ${error.stack}`);
logger.error("Failed to process invoice", { error });
logger.warn("Could not read optional cache; continuing without it", { error });
```

When `error` is `unknown`, normalize it to an `Error` first so the second argument still receives an error object.
