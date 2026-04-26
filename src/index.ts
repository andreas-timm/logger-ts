/**
 * Usage:
 *
 * const logger = getLogger();
 * logger.error(`File not found at ${filePath}.`, new Error("FileMissing"));
 * logger.info("Info");
 *
 * Output to file:
 * const logger = getLogger({ file: true, output: 'tmp/parse.log' });
 */
import { appendFileSync, writeFileSync } from "node:fs";
import winston from "winston";
import TransportStream from "winston-transport";

class SynchronousFileTransport extends TransportStream {
    #output: string;

    constructor(options: { output: string; level?: string; flag?: string }) {
        super({ level: options.level });
        this.#output = options.output;

        if (options.flag === "w") {
            writeFileSync(options.output, "", { flag: "w" });
        }
    }

    override log(
        info: winston.Logform.TransformableInfo,
        callback: () => void,
    ) {
        setImmediate(() => this.emit("logged", info));

        const formatted = info[Symbol.for("message")] ?? info.message ?? "";
        appendFileSync(this.#output, `${formatted}\n`);

        callback();
    }
}

export type Options = {
    output?: string;
    file?: boolean;
    flag?: string;
    level?: string;
};

export function getLogger(options: Options = {}) {
    const logger = winston.createLogger({
        level: options.level,
        format: winston.format.printf((info) => {
            const prefix = info.level === "debug" ? "🚧 " : "";
            return `${prefix}${info.message}`;
        }),
        transports: [new winston.transports.Console()],
    });

    if (options.file !== false && options.output !== undefined) {
        const output = options.output;
        logger.add(
            new SynchronousFileTransport({
                output,
                flag: options.flag,
                level: options.level,
            }),
        );
    }

    return logger;
}
