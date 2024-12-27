export type ConsoleLine = {
    contents: any[],
    time: Date,
    type: "log" | "console error",
} | {
    type: "reload_marker"
} | {
    type: "execute error";
    ev: string;
    src: string;
    lineno: string;
    colno: string;
    time: Date;
    error: any;
}