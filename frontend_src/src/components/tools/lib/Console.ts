export type ConsoleLine = {
    contents: any[],
    time: Date,
    type: "log" | "error",
} | {
    type: "reload_marker"
}