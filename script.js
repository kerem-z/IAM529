// Lorenz Attractor 2D Animation - GIF-like Infinite Loop
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
        // Lorenz parameters
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = 0.005;
        const totalSteps = 3000;
        let points = [];
        let x0 = 0.01, y0 = 0, z0 = 0;
        let x = x0, y = y0, z = z0;
        let stepCount = 0;
        let animating = true;
        let fadeAlpha = 0;
        function reset() {
            points = [];
            x = x0; y = y0; z = z0;
            stepCount = 0;
            animating = true;
            fadeAlpha = 0;
        }
        function step() {
            let dx = sigma * (y - x);
            let dy = x * (rho - z) - y;
            let dz = x * y - beta * z;
            x += dx * dt;
            y += dy * dt;
            z += dz * dt;
            points.push([x, z]); // 2D: x vs z
            stepCount++;
        }
        function getStrokeColor() {
            const theme = document.documentElement.getAttribute('data-theme');
            return theme === 'dark' ? '#fff' : '#111';
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Find bounds for scaling
            let minX = Math.min(...points.map(p => p[0]));
            let maxX = Math.max(...points.map(p => p[0]));
            let minZ = Math.min(...points.map(p => p[1]));
            let maxZ = Math.max(...points.map(p => p[1]));
            // Make animation compact in a large canvas
            let scaleZ = 0.4 * 0.85 * canvas.height / (maxZ - minZ);
            let scaleX = 0.4 * 0.85 * canvas.width / (maxX - minX);
            let offsetX = canvas.width / 2 - scaleX * (minX + maxX) / 2;
            let offsetY = canvas.height / 2 - scaleZ * (minZ + maxZ) / 2;
            ctx.save();
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = getStrokeColor();
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < points.length; ++i) {
                let [px, pz] = points[i];
                let sx = offsetX + px * scaleX;
                let sy = offsetY + pz * scaleZ;
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.stroke();
            ctx.restore();
            // Fade out if finished
            if (!animating && fadeAlpha < 1) {
                ctx.save();
                ctx.globalAlpha = fadeAlpha;
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        }
        function animate() {
            if (animating) {
                for (let i = 0; i < 3; ++i) {
                    if (stepCount < totalSteps) step();
                }
                if (stepCount >= totalSteps) {
                    animating = false;
                }
            } else {
                fadeAlpha += 0.03;
                if (fadeAlpha >= 1) {
                    reset();
                }
            }
            draw();
            requestAnimationFrame(animate);
        }
        reset();
        animate();
        // Redraw on theme change
        const observer = new MutationObserver(draw);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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