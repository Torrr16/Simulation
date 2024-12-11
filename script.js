const canvas = document.getElementById('satelliteCanvas');
const ctx = canvas.getContext('2d');

const G = 6.67430e-11; // Gravitational constant (m^3 kg^-1 s^-2)
const M = 5.972e24;    // Mass of Earth (kg)
const R = 6371e3;      // Radius of Earth (m)
const scaleFactor = 1 / (200000); // Scale for converting meters to pixels
const dt = 10;            // Time step in seconds

let satellite = {
    x: R + 35786000, // Geostationary orbit distance (m)
    y: 0,
    vx: 0,         // Initial velocity in x-direction (m/s)
    vy: 3074,      // Velocity for geostationary orbit (m/s)
};

function gravitationalForce(x, y) {
    const r = Math.sqrt(x * x + y * y);
    const force = (G * M) / (r * r);
    const fx = -force * (x / r);
    const fy = -force * (y / r);
    return { fx, fy };
}

function rk4Step(satellite, dt) {
    const { x, y, vx, vy } = satellite;

    const k1v = gravitationalForce(x, y);
    const k1vx = k1v.fx;
    const k1vy = k1v.fy;

    const k2v = gravitationalForce(x + 0.5 * dt * vx, y + 0.5 * dt * vy);
    const k2vx = k2v.fx;
    const k2vy = k2v.fy;

    const k3v = gravitationalForce(x + 0.5 * dt * (vx + 0.5 * dt * k1vx), y + 0.5 * dt * (vy + 0.5 * dt * k1vy));
    const k3vx = k3v.fx;
    const k3vy = k3v.fy;

    const k4v = gravitationalForce(x + dt * (vx + 0.5 * dt * k2vx), y + dt * (vy + 0.5 * dt * k2vy));
    const k4vx = k4v.fx;
    const k4vy = k4v.fy;

    satellite.vx += (dt / 6) * (k1vx + 2 * k2vx + 2 * k3vx + k4vx);
    satellite.vy += (dt / 6) * (k1vy + 2 * k2vy + 2 * k3vy + k4vy);

    satellite.x += dt * satellite.vx;
    satellite.y += dt * satellite.vy;
}

function drawSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Earth
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, R * scaleFactor, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Draw Satellite
    const satelliteX = canvas.width / 2 + satellite.x * scaleFactor;
    const satelliteY = canvas.height / 2 + satellite.y * scaleFactor;

    ctx.beginPath();
    ctx.arc(satelliteX, satelliteY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function simulate() {
    rk4Step(satellite, dt);
    drawSimulation();
    requestAnimationFrame(simulate);
}

document.getElementById('simulateButton').addEventListener('click', () => {
    satellite = {
        x: R + 35786000, // Reset position: geostationary orbit distance
        y: 0,
        vx: 0,
        vy: 3074, // Reset velocity for geostationary orbit
    };
    simulate();
});
