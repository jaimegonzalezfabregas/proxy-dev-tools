
(() => {
    console.log2 = console.log; // keeping original function under new name
    console.error2 = console.error; // keeping original function under new name

    const socket = new WebSocket(
        "ws://localhost:8889",
    );

    let pending_msg = [];
    let already_opened_ws = false;

    function send(msg) {
        if (already_opened_ws) {
            socket.send(msg)
        } else {
            pending_msg.push(msg)
        }
    }


    console.log = function (...args) {
        console.log2.apply(this, args);

        send(JSON.stringify({
            code: "console log",
            elms: [...args]
        }));
    };


    console.error = function (...args) {
        console.error2.apply(this, socket);
        console.error2.apply(this, args);

        send(JSON.stringify({
            code: "console error",
            elms: [...args]
        }));
    };

    window.onerror = (ev, src, lineno, colno, error) => {

        send(JSON.stringify({
            code: "execute error",
            ev, src, lineno, colno, error
        }));
    }

    socket.onopen = () => {
        socket.send(JSON.stringify({
            code: "start"
        }))

        already_opened_ws = true;
        for (const msg of pending_msg) {
            socket.send(msg);
        }
    }

    

})()
