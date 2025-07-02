// Lorenz Attractor 3D-like Animation - Black, Mathematical Style, Enhanced 3D Rotation
window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('lorenz-bg');
    if (canvas) {
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const ctx = canvas.getContext('2d');
        // Offscreen canvas for smoother drawing
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        function resizeOffscreen() {
            offCanvas.width = canvas.width;
            offCanvas.height = canvas.height;
        }
        resizeOffscreen();
        window.addEventListener('resize', resizeOffscreen);

        // Lorenz parameters
        const sigma = 10, rho = 28, beta = 8/3;
        let x = 0.01, y = 0, z = 0;
        const dt = 0.005;
        let points = [];
        let maxPoints = 3000;
        // 3D rotation
        let angleY = 0;
        let angleX = 0;
        function step() {
            let dx = sigma * (y - x);
            let dy = x * (rho - z) - y;
            let dz = x * y - beta * z;
            x += dx * dt;
            y += dy * dt;
            z += dz * dt;
            points.push([x, y, z]);
            if (points.length > maxPoints) points.shift();
        }
        function project3D([x, y, z], angleY, angleX) {
            // First rotate around Y axis
            let caY = Math.cos(angleY), saY = Math.sin(angleY);
            let cx = x * caY - z * saY;
            let cz = x * saY + z * caY;
            // Then rotate around X axis
            let caX = Math.cos(angleX), saX = Math.sin(angleX);
            let cy = y * caX - cz * saX;
            let cz2 = y * saX + cz * caX;
            // Perspective projection, scaled to fit
            let scaleX = canvas.width / 90;
            let scaleY = canvas.height / 60;
            let perspective = 350 / (350 - cz2);
            let px = canvas.width/2 + cx * scaleX * perspective + 40;
            let py = canvas.height/2 - cy * scaleY * perspective;
            return [px, py];
        }
        function draw() {
            offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
            offCtx.lineJoin = 'round';
            offCtx.lineCap = 'round';
            offCtx.strokeStyle = '#111'; // solid black
            for (let i = 1; i < points.length; ++i) {
                let t = i / points.length;
                offCtx.lineWidth = 1.5 + 1.5 * t;
                offCtx.beginPath();
                let [x0, y0] = project3D(points[i-1], angleY, angleX);
                let [x1, y1] = project3D(points[i], angleY, angleX);
                offCtx.moveTo(x0, y0);
                offCtx.lineTo(x1, y1);
                offCtx.stroke();
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offCanvas, 0, 0);
        }
        function animate() {
            for (let i = 0; i < 35; ++i) step();
            angleY += 0.010;
            angleX += 0.004; // slow X rotation for more 3D
            draw();
            requestAnimationFrame(animate);
        }
        animate();
    }
});

// Theme and navigation logic (as before)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initTheme();
    // Add event listener for dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    // Initialize keyboard navigation
    initKeyboardNav();
});

// Keyboard Navigation
function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        // Alt + H: Home
        if (e.altKey && e.key === 'h') {
            window.location.href = 'index.html';
        }
        // Alt + S: Syllabus
        if (e.altKey && e.key === 's') {
            window.location.href = 'syllabus.html';
        }
        // Alt + L: Lectures
        if (e.altKey && e.key === 'l') {
            window.location.href = 'playground.html';
        }
        // Alt + A: Assignments
        if (e.altKey && e.key === 'a') {
            window.location.href = 'assignments.html';
        }
        // Alt + R: Resources
        if (e.altKey && e.key === 'r') {
            window.location.href = 'resources.html';
        }
    });
}

// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
} 