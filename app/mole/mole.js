
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

    function hanndle_html_change() {
        send(JSON.stringify({
            code: "inspector",
            raw_html: document.querySelector("html").outerHTML
        }))
    }

    const targetNode = document.querySelector("html");
    const config = { childList: true, subtree: true, attributes: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                hanndle_html_change();
            }
        }
    };

    // Create an instance of MutationObserver
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    if (targetNode) {
        observer.observe(targetNode, config);
    }

    hanndle_html_change();


    document.addEventListener('DOMContentLoaded', () => {
        // Create a button element
        const button = document.createElement('button');
        button.innerText = 'Inspect';

        button.id = 'highlightButton'; // Set the button ID

        // Variable to track selecting mode
        let selectingMode = false;

        // Add click event to the button to toggle selecting mode
        button.addEventListener('click', () => {
            selectingMode = !selectingMode; // Toggle selecting mode
            if (selectingMode) {
                button.innerText = 'Selecting Mode ON';
            } else {
                // Remove all selections
                const highlightedElements = document.querySelectorAll('[proxy_dev_tools_highlight]');
                highlightedElements.forEach(element => {
                    element.removeAttribute('proxy_dev_tools_highlight');
                });

                // Remove the highlighted class from all elements
                const allHighlightedElements = document.querySelectorAll('.highlighted');
                allHighlightedElements.forEach(element => {
                    element.classList.remove('highlighted');
                });


                button.innerText = 'Inspect ';
                hanndle_html_change();
            }
        });

        document.addEventListener('mouseover', (event) => {
            if (selectingMode) {
                event.target.classList.add('highlighted');
            }
        });

        document.addEventListener('mouseout', (event) => {
            if (selectingMode) {
                event.target.classList.remove('highlighted');
            }
        });

        // Add click event to the document to handle element selection
        document.addEventListener('click', (event) => {
            if (selectingMode) {
                // Prevent the button click from triggering this event
                if (event.target !== button) {
                    event.target.setAttribute('proxy_dev_tools_highlight', 'true');
                }
            }
        });

        // Append the button to the body
        document.body.appendChild(button);
    });

})()
