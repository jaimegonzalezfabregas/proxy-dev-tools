const old_console_log = console.log;

console.log = (...x) => {
    old_console_log(...x);
    alert(x)
}