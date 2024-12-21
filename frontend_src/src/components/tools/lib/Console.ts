export type ConsoleLine = {
    contents: any[],
    time: Date,
    type: "log" | "error",
    action: undefined,
} | {
    type: "reload_marker"
}