import statik from 'statik';
import { spawn } from 'node:child_process';

export function start_frontend(PORT) {
    if (false) {
        console.log("> Running frontend on port", PORT);
        statik(PORT);
        statik({
            port: PORT,
            root: './fontend_dist'
        });
    } else {
        console.log("> Running frontend on vite's default port");

        const child = spawn('npm', ["run", "dev"], {
            cwd: "../frontend_src", stdio: 'inherit'
        });

        process.on('SIGINT', () => {
            child.kill(); // Kill the child process
            process.exit(0); // Exit the parent process
        });
    }
}