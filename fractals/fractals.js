document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas and its context
    const canvas = document.getElementById('sierpinski-canvas');
    if (!canvas) return;
    
    // Ensure canvas is properly sized on page load
    window.addEventListener('load', function() {
        if (canvas) {
            resetCanvasDimensions(canvas);
            drawSierpinski();
        }
        
        const chaosCanvas = document.getElementById('chaos-game-canvas');
        if (chaosCanvas) {
            resetCanvasDimensions(chaosCanvas);
            if (typeof initChaosGame === 'function') {
                initChaosGame();
            }
        }
    });
    
    // Set up high-DPI canvas
    setupHighDPICanvas(canvas);
    const ctx = canvas.getContext('2d');
    
    // Set up variables
    let iterations = 0;
    const maxIterations = 6; // Limit to prevent browser hanging

    // Get the controls
    const iterateBtn = document.getElementById('iterate-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Set up event listeners
    if (iterateBtn) {
        iterateBtn.addEventListener('click', function() {
            if (iterations < maxIterations) {
                iterations++;
                drawSierpinski();
                
                // Disable the button if we've reached max iterations
                if (iterations >= maxIterations) {
                    iterateBtn.disabled = true;
                    iterateBtn.textContent = 'Max Iterations Reached';
                }
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            iterations = 0;
            drawSierpinski();
            
            // Re-enable the iterate button
            if (iterateBtn) {
                iterateBtn.disabled = false;
                iterateBtn.textContent = 'Add Iteration';
            }
        });
    }
    
    // Function to draw a triangle
    function drawTriangle(x1, y1, x2, y2, x3, y3, depth) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        
        // Fill based on color scheme
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // Add a subtle outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
    
    // Recursive function to draw the Sierpinski gasket
    function drawSierpinskiRecursive(x1, y1, x2, y2, x3, y3, depth) {
        if (depth === 0) {
            drawTriangle(x1, y1, x2, y2, x3, y3, iterations - depth);
            return;
        }
        
        // Calculate midpoints
        const midX1 = (x1 + x2) / 2;
        const midY1 = (y1 + y2) / 2;
        const midX2 = (x2 + x3) / 2;
        const midY2 = (y2 + y3) / 2;
        const midX3 = (x3 + x1) / 2;
        const midY3 = (y3 + y1) / 2;
        
        // Recursively draw three smaller triangles
        drawSierpinskiRecursive(x1, y1, midX1, midY1, midX3, midY3, depth - 1);
        drawSierpinskiRecursive(midX1, midY1, x2, y2, midX2, midY2, depth - 1);
        drawSierpinskiRecursive(midX3, midY3, midX2, midY2, x3, y3, depth - 1);
    }
    
    // Main function to draw the Sierpinski gasket
    function drawSierpinski() {
        // Clear the canvas
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        ctx.clearRect(0, 0, width, height);
        
        // If iterations is 0, just draw the outline
        if (iterations === 0) {
            const x1 = width / 2;
            const y1 = 50;
            const x2 = 50;
            const y2 = height - 50;
            const x3 = width - 50;
            const y3 = height - 50;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            return;
        }
        
        // For higher iterations, use different methods based on iteration count
        if (iterations <= 6) {
            // Use recursive method for lower iterations
            const x1 = width / 2;
            const y1 = 50;
            const x2 = 50;
            const y2 = height - 50;
            const x3 = width - 50;
            const y3 = height - 50;
            
            drawSierpinskiRecursive(x1, y1, x2, y2, x3, y3, iterations);
        } else {
            // Use chaos game method for higher iterations
            drawSierpinskiChaosGame();
        }
        
        // Display the current iteration
        ctx.fillStyle = '#000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`Iteration: ${iterations}`, width - 20, 30);
    }
    
    // Function to draw the Sierpinski gasket using the chaos game method
    function drawSierpinskiChaosGame() {
        // Get the canvas dimensions
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Define the three vertices of the triangle
        const vertices = [
            { x: width / 2, y: 50 },
            { x: 50, y: height - 50 },
            { x: width - 50, y: height - 50 }
        ];
        
        // Draw the outer triangle
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.closePath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Start with a random point inside the triangle
        let point = {
            x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
            y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3
        };
        
        // Number of points to plot increases with iterations
        const numPoints = 10000 * iterations;
        
        // Plot points using the chaos game algorithm with anti-aliased rendering
        for (let i = 0; i < numPoints; i++) {
            // Randomly select one of the three vertices
            const vertex = vertices[Math.floor(Math.random() * 3)];
            
            // Move halfway from current position toward the selected vertex
            point.x = (point.x + vertex.x) / 2;
            point.y = (point.y + vertex.y) / 2;
            
            // Skip the first 20 points (burn-in period)
            if (i < 20) continue;
            
            // Plot the point with a small anti-aliased circle for sharper rendering
            ctx.beginPath();
            ctx.arc(point.x, point.y, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
        }
    }
    
    // Initial draw
    drawSierpinski();
    
    // Chaos Game Visualization
    const chaosCanvas = document.getElementById('chaos-game-canvas');
    if (chaosCanvas) {
        // Set up high-DPI canvas
        setupHighDPICanvas(chaosCanvas);
        const chaosCtx = chaosCanvas.getContext('2d');
        
        // Set up variables
        let animationId = null;
        let isRunning = false;
        let speed = 10; // Default points per frame
        let frameDelay = 0; // Delay between frames in ms (0 = run at full speed)
        const MAX_POINTS = 50000; // Maximum number of points to plot
        
        // Get controls
        const startBtn = document.getElementById('start-chaos-game');
        const resetChaosBtn = document.getElementById('reset-chaos-game');
        const speedSlider = document.getElementById('speed-slider');
        
        // Define the triangle vertices
        const dpr = window.devicePixelRatio || 1;
        const width = chaosCanvas.width / dpr;
        const height = chaosCanvas.height / dpr;
        
        const vertices = [
            { x: width / 2, y: 50 },
            { x: 50, y: height - 50 },
            { x: width - 50, y: height - 50 }
        ];
        
        // Current point
        let currentPoint = {
            x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
            y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3
        };
        
        // Points plotted so far
        let pointsPlotted = 0;
        
        // Function to draw the initial state
        function initChaosGame() {
            // Get the canvas dimensions
            const dpr = window.devicePixelRatio || 1;
            const width = chaosCanvas.width / dpr;
            const height = chaosCanvas.height / dpr;
            
            // Clear the canvas
            chaosCtx.clearRect(0, 0, width, height);
            
            // Define the three vertices of the triangle
            const vertices = [
                { x: width / 2, y: 50 },
                { x: 50, y: height - 50 },
                { x: width - 50, y: height - 50 }
            ];
            
            // Draw the triangle
            chaosCtx.beginPath();
            chaosCtx.moveTo(vertices[0].x, vertices[0].y);
            chaosCtx.lineTo(vertices[1].x, vertices[1].y);
            chaosCtx.lineTo(vertices[2].x, vertices[2].y);
            chaosCtx.closePath();
            chaosCtx.strokeStyle = '#000';
            chaosCtx.lineWidth = 2;
            chaosCtx.stroke();
            
            // Draw the vertices as points
            vertices.forEach(vertex => {
                chaosCtx.beginPath();
                chaosCtx.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
                chaosCtx.fillStyle = '#000';
                chaosCtx.fill();
            });
            
            // Reset the current point
            currentPoint = {
                x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
                y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3
            };
            
            // Draw the starting point
            chaosCtx.beginPath();
            chaosCtx.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2);
            chaosCtx.fillStyle = 'red';
            chaosCtx.fill();
            
            // Reset points plotted
            pointsPlotted = 0;
        }
        
        // Function to update the chaos game
        function updateChaosGame() {
            // Get the canvas dimensions
            const dpr = window.devicePixelRatio || 1;
            const width = chaosCanvas.width / dpr;
            const height = chaosCanvas.height / dpr;
            
            // Define the three vertices of the triangle if needed
            const vertices = [
                { x: width / 2, y: 50 },
                { x: 50, y: height - 50 },
                { x: width - 50, y: height - 50 }
            ];
            
            // Check if we've reached the maximum number of points
            if (pointsPlotted >= MAX_POINTS) {
                isRunning = false;
                if (startBtn) {
                    startBtn.textContent = 'Max Points Reached';
                    startBtn.disabled = true;
                }
                return;
            }
            
            // For very slow speeds, plot one point at a time with a delay
            if (speed <= 5) {
                // Plot a single point
                // Randomly select one of the three vertices
                const vertex = vertices[Math.floor(Math.random() * 3)];
                
                // Move halfway from current position toward the selected vertex
                currentPoint.x = (currentPoint.x + vertex.x) / 2;
                currentPoint.y = (currentPoint.y + vertex.y) / 2;
                
                // Plot the point with a small anti-aliased circle for sharper rendering
                chaosCtx.beginPath();
                chaosCtx.arc(currentPoint.x, currentPoint.y, 0.5, 0, Math.PI * 2);
                chaosCtx.fillStyle = '#000';
                chaosCtx.fill();
                
                // Increment points plotted
                pointsPlotted++;
                
                // Update the display
                updatePointsDisplay();
                
                // Continue animation with a delay if still running
                if (isRunning) {
                    // Calculate delay based on speed (1-5)
                    // speed 1 = 1000ms (1 per second)
                    // speed 5 = 200ms (5 per second)
                    const delay = 1000 / speed;
                    setTimeout(() => {
                        animationId = requestAnimationFrame(updateChaosGame);
                    }, delay);
                }
            } else {
                // For normal speeds, plot multiple points per frame
                const pointsToPlot = Math.min(speed, MAX_POINTS - pointsPlotted);
                
                for (let i = 0; i < pointsToPlot; i++) {
                    // Randomly select one of the three vertices
                    const vertex = vertices[Math.floor(Math.random() * 3)];
                    
                    // Move halfway from current position toward the selected vertex
                    currentPoint.x = (currentPoint.x + vertex.x) / 2;
                    currentPoint.y = (currentPoint.y + vertex.y) / 2;
                    
                    // Plot the point with a small anti-aliased circle for sharper rendering
                    chaosCtx.beginPath();
                    chaosCtx.arc(currentPoint.x, currentPoint.y, 0.5, 0, Math.PI * 2);
                    chaosCtx.fillStyle = '#000';
                    chaosCtx.fill();
                    
                    // Increment points plotted
                    pointsPlotted++;
                    
                    // Stop if we've reached the maximum
                    if (pointsPlotted >= MAX_POINTS) {
                        break;
                    }
                }
                
                // Update the display
                updatePointsDisplay();
                
                // Continue animation if running
                if (isRunning) {
                    animationId = requestAnimationFrame(updateChaosGame);
                }
            }
        }
        
        // Function to update the points display
        function updatePointsDisplay() {
            // Display points plotted and max points
            chaosCtx.fillStyle = '#fff';
            chaosCtx.fillRect(0, 0, 200, 30);
            chaosCtx.fillStyle = '#000';
            chaosCtx.font = '12px monospace';
            chaosCtx.textAlign = 'left';
            chaosCtx.fillText(`Points: ${pointsPlotted} / ${MAX_POINTS}`, 10, 20);
        }
        
        // Set up event listeners
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                if (!isRunning) {
                    isRunning = true;
                    this.textContent = 'Pause';
                    animationId = requestAnimationFrame(updateChaosGame);
                } else {
                    isRunning = false;
                    this.textContent = 'Resume';
                    cancelAnimationFrame(animationId);
                }
            });
        }
        
        if (resetChaosBtn) {
            resetChaosBtn.addEventListener('click', function() {
                isRunning = false;
                if (startBtn) {
                    startBtn.textContent = 'Start Chaos Game';
                    startBtn.disabled = false;
                }
                cancelAnimationFrame(animationId);
                initChaosGame();
            });
        }
        
        if (speedSlider) {
            // Update the slider to allow for very slow speeds
            speedSlider.min = "1";
            speedSlider.max = "100";
            speedSlider.value = "10";
            
            speedSlider.addEventListener('input', function() {
                speed = parseInt(this.value);
                
                // Update a label to show the current speed if it exists
                const speedLabel = document.getElementById('speed-value');
                if (speedLabel) {
                    if (speed <= 5) {
                        speedLabel.textContent = `${speed} point${speed === 1 ? '' : 's'} per second`;
                    } else {
                        speedLabel.textContent = `${speed} points per frame`;
                    }
                }
            });
        }
        
        // Initialize the chaos game
        initChaosGame();
    }
    
    // Handle window resize to maintain sharp canvas
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce the resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Resize and redraw the main canvas
            if (canvas) {
                resetCanvasDimensions(canvas);
                drawSierpinski();
            }
            
            // Resize and redraw the chaos game canvas
            if (chaosCanvas) {
                resetCanvasDimensions(chaosCanvas);
                initChaosGame();
            }
        }, 250); // Wait for resize to finish
    });
    
    // Helper function to set up high-DPI canvas
    function setupHighDPICanvas(canvas) {
        // Get the device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        
        // Store the original width and height attributes
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        
        // Get the computed style
        const style = getComputedStyle(canvas);
        const styleWidth = parseInt(style.width, 10) || originalWidth;
        const styleHeight = parseInt(style.height, 10) || originalHeight;
        
        // Set the canvas display size
        canvas.style.width = `${styleWidth}px`;
        canvas.style.height = `${styleHeight}px`;
        
        // Scale the canvas by the device pixel ratio
        canvas.width = styleWidth * dpr;
        canvas.height = styleHeight * dpr;
        
        // Scale the context to match the device pixel ratio
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Set the canvas drawing dimensions back to the original size
        // This ensures the content is properly positioned and scaled
        canvas.setAttribute('data-original-width', originalWidth);
        canvas.setAttribute('data-original-height', originalHeight);
        
        return ctx;
    }
    
    // Function to reset the canvas dimensions after resize
    function resetCanvasDimensions(canvas) {
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Clear any transformations
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Get the current display size
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        
        // Update the canvas size
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        
        // Scale the context
        ctx.scale(dpr, dpr);
        
        return ctx;
    }
}); 