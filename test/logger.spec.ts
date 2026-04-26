import { afterEach, describe, expect, it } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getLogger } from "../src/index.ts";

const tempDirs: string[] = [];

afterEach(() => {
    for (const directory of tempDirs.splice(0)) {
        rmSync(directory, { force: true, recursive: true });
    }
});

describe("getLogger", () => {
    it("writes log lines to the configured file transport", () => {
        const directory = mkdtempSync(join(tmpdir(), "logger-file-"));
        const output = join(directory, "events.log");
        tempDirs.push(directory);
        const logger = getLogger({ flag: "w", output });

        logger.info("hello file");

        expect(readFileSync(output, "utf8")).toContain("hello file");
    });

    it("skips the file transport when file is false", () => {
        const directory = mkdtempSync(join(tmpdir(), "logger-disabled-"));
        const output = join(directory, "events.log");
        tempDirs.push(directory);
        const logger = getLogger({ file: false, output });

        logger.info("ignored");

        expect(existsSync(output)).toBeFalse();
    });
});
