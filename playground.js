// Lorenz Attractor Playground - Interactive
window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('playground-lorenz');
    const sigmaSlider = document.getElementById('sigma-slider');
    const rhoSlider = document.getElementById('rho-slider');
    const betaSlider = document.getElementById('beta-slider');
    const speedSlider = document.getElementById('speed-slider');
    const resetBtn = document.getElementById('reset-btn');

    let sigma = parseFloat(sigmaSlider.value);
    let rho = parseFloat(rhoSlider.value);
    let beta = parseFloat(betaSlider.value);
    let rotationSpeed = parseFloat(speedSlider.value);

    sigmaSlider.oninput = () => sigma = parseFloat(sigmaSlider.value);
    rhoSlider.oninput = () => rho = parseFloat(rhoSlider.value);
    betaSlider.oninput = () => beta = parseFloat(betaSlider.value);
    speedSlider.oninput = () => rotationSpeed = parseFloat(speedSlider.value);

    let x = 0.01, y = 0, z = 0;
    const dt = 0.005;
    let points = [];
    let maxPoints = 3000;
    let angleY = 0;
    let angleX = 0;
    let dragging = false;
    let lastX = 0, lastY = 0;

    function resetAttractor() {
        x = 0.01; y = 0; z = 0;
        points = [];
        angleY = 0;
        angleX = 0;
    }
    resetBtn.onclick = resetAttractor;

    canvas.addEventListener('mousedown', e => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    window.addEventListener('mousemove', e => {
        if (dragging) {
            angleY += (e.clientX - lastX) * 0.01;
            angleX += (e.clientY - lastY) * 0.01;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
    window.addEventListener('mouseup', () => dragging = false);

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    function resizeOffscreen() {
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
    }
    resizeOffscreen();
    window.addEventListener('resize', resizeOffscreen);

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
        let caY = Math.cos(angleY), saY = Math.sin(angleY);
        let cx = x * caY - z * saY;
        let cz = x * saY + z * caY;
        let caX = Math.cos(angleX), saX = Math.sin(angleX);
        let cy = y * caX - cz * saX;
        let cz2 = y * saX + cz * caX;
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
        offCtx.strokeStyle = '#111';
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
        angleY += rotationSpeed;
        draw();
        requestAnimationFrame(animate);
    }
    animate();
}); 