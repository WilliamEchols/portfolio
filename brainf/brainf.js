class BrainfInterpreter {
    constructor(memorySize = 30000) {
        this.memory = new Uint8Array(memorySize);
        this.pointer = 0;
        this.output = '';
        this.input = '';
        this.inputIndex = 0;
        this.instructionCount = 0;
        this.maxMemoryUsed = 0;
        this.reset();
    }

    reset() {
        this.memory.fill(0);
        this.pointer = 0;
        this.output = '';
        this.inputIndex = 0;
        this.instructionCount = 0;
        this.maxMemoryUsed = 0;
    }

    stripComments(code) {
        let result = '';
        let inComment = false;
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if (char === '#') {
                inComment = true;
            } else if (char === '\n') {
                inComment = false;
            } else if (!inComment && '><+-.,[]'.includes(char)) {
                result += char;
            }
        }
        
        return result;
    }

    execute(code) {
        this.code = this.stripComments(code);
        this.ip = 0;
        this.bracketMap = this.buildBracketMap();
        
        while (this.ip < this.code.length) {
            this.step();
        }
        
        return this.output;
    }

    step() {
        if (this.ip >= this.code.length) return false;

        const command = this.code[this.ip];
        this.instructionCount++;
        
        switch (command) {
            case '>':
                this.pointer = (this.pointer + 1) % this.memory.length;
                this.maxMemoryUsed = Math.max(this.maxMemoryUsed, this.pointer);
                break;
            case '<':
                this.pointer = (this.pointer - 1 + this.memory.length) % this.memory.length;
                break;
            case '+':
                this.memory[this.pointer] = (this.memory[this.pointer] + 1) % 256;
                break;
            case '-':
                this.memory[this.pointer] = (this.memory[this.pointer] - 1 + 256) % 256;
                break;
            case '.':
                this.output += String.fromCharCode(this.memory[this.pointer]);
                break;
            case ',':
                if (this.inputIndex < this.input.length) {
                    this.memory[this.pointer] = this.input.charCodeAt(this.inputIndex++);
                }
                break;
            case '[':
                if (this.memory[this.pointer] === 0) {
                    this.ip = this.bracketMap[this.ip];
                }
                break;
            case ']':
                if (this.memory[this.pointer] !== 0) {
                    this.ip = this.bracketMap[this.ip];
                }
                break;
        }
        
        this.ip++;
        return true;
    }

    buildBracketMap() {
        const map = {};
        const stack = [];
        let hasError = false;
        
        for (let i = 0; i < this.code.length; i++) {
            if (this.code[i] === '[') {
                stack.push(i);
            } else if (this.code[i] === ']') {
                if (stack.length === 0) {
                    hasError = true;
                    break;
                }
                const start = stack.pop();
                map[start] = i;
                map[i] = start;
            }
        }
        
        if (stack.length > 0) hasError = true;
        this.hasError = hasError;
        return map;
    }

    getState() {
        return {
            memory: [...this.memory],
            pointer: this.pointer,
            output: this.output,
            currentCommand: this.code ? this.code[this.ip] : null,
            ip: this.ip,
            isFinished: this.ip >= this.code.length,
            instructionCount: this.instructionCount,
            maxMemoryUsed: this.maxMemoryUsed,
            hasError: this.hasError
        };
    }
}

class Visualizer {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.setupElements();
        this.setupEventListeners();
        this.isRunning = false;
        this.speed = 50;
        this.visibleCells = 15;
        this.centerCellIndex = Math.floor(this.visibleCells / 2);
        this.initializeTape();
    }

    setupElements() {
        this.codeInput = document.getElementById('code-input');
        this.codeDisplay = document.getElementById('code-display');
        this.runButton = document.getElementById('run-btn');
        this.stepButton = document.getElementById('step-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.speedControl = document.getElementById('speed-control');
        this.tape = document.getElementById('tape');
        this.pointer = document.getElementById('pointer');
        this.output = document.getElementById('program-output');
        this.cellWidth = 44; // 40px width + 2px margin on each side
        this.instructionCount = document.getElementById('instruction-count');
        this.memoryUsed = document.getElementById('memory-used');
        this.bracketsStatus = document.getElementById('brackets-status');
        
        document.querySelectorAll('.example-buttons button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.codeInput.value = btn.dataset.program;
                this.reset();
            });
        });

        // Ensure the textarea uses monospace and matches the display
        this.codeInput.style.fontFamily = 'monospace';
        this.codeInput.style.fontSize = '14px';
        this.codeInput.style.lineHeight = '1.4';
    }

    setupEventListeners() {
        this.runButton.addEventListener('click', () => this.toggleRun());
        this.stepButton.addEventListener('click', () => this.step());
        this.resetButton.addEventListener('click', () => this.reset());
        this.speedControl.addEventListener('input', (e) => {
            this.speed = e.target.value;
        });
        
        // Update code display when input changes
        this.codeInput.addEventListener('input', () => {
            this.updateCodeDisplay();
        });

        // Sync scrolling between input and display
        this.codeInput.addEventListener('scroll', () => {
            this.codeDisplay.scrollTop = this.codeInput.scrollTop;
            this.codeDisplay.scrollLeft = this.codeInput.scrollLeft;
        });

        // Handle tab key
        this.codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.codeInput.selectionStart;
                const end = this.codeInput.selectionEnd;
                const value = this.codeInput.value;
                
                this.codeInput.value = value.substring(0, start) + '    ' + value.substring(end);
                this.codeInput.selectionStart = this.codeInput.selectionEnd = start + 4;
                this.updateCodeDisplay();
            }
        });
    }

    updateCodeDisplay() {
        const code = this.codeInput.value;
        const ip = this.interpreter.ip || 0;
        const state = this.interpreter.getState();
        const strippedCode = this.interpreter.stripComments(code);
        
        let html = '';
        let codeIndex = 0;
        let inComment = false;
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            
            if (char === '#') {
                inComment = true;
                html += '<span class="token comment">#';
                continue;
            }
            
            if (char === '\n') {
                if (inComment) {
                    html += '</span>';
                    inComment = false;
                }
                html += '\n';
                continue;
            }
            
            if (inComment) {
                html += char;
                continue;
            }
            
            if ('><+-.,[]'.includes(char)) {
                let classes = ['token'];
                
                // Add syntax highlighting class
                if ('><'.includes(char)) classes.push('pointer');
                else if ('+-'.includes(char)) classes.push('memory');
                else if ('.,'.includes(char)) classes.push('io');
                else if ('[]'.includes(char)) classes.push('loop');
                
                // Add current token highlight
                if (codeIndex === ip && !state.isFinished) classes.push('current');
                
                // Add error highlighting for unmatched brackets
                if (state.hasError && '[]'.includes(char)) classes.push('error');
                
                html += `<span class="${classes.join(' ')}">${char}</span>`;
                codeIndex++;
            } else {
                html += char;
            }
        }
        
        if (inComment) {
            html += '</span>';
        }
        
        this.codeDisplay.innerHTML = html || 'Program will appear here...';
        
        // Update program state
        this.instructionCount.textContent = state.instructionCount;
        this.memoryUsed.textContent = state.maxMemoryUsed + 1;
        this.bracketsStatus.textContent = state.hasError ? 'Invalid' : 'Valid';
        this.bracketsStatus.style.color = state.hasError ? '#dc2626' : '#059669';
        
        // Update button states
        this.runButton.disabled = state.hasError;
        this.stepButton.disabled = state.hasError;
    }

    initializeTape() {
        this.tape.innerHTML = '';
        for (let i = 0; i < this.visibleCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = '0';
            this.tape.appendChild(cell);
        }
        this.updateVisualization();
        this.updateCodeDisplay();
    }

    updateVisualization() {
        const state = this.interpreter.getState();
        const cells = this.tape.children;
        
        // Update cell values and active state
        for (let i = 0; i < cells.length; i++) {
            // Calculate the memory index relative to the pointer position
            const memoryOffset = i - this.centerCellIndex;
            const memoryIndex = (state.pointer + memoryOffset + this.interpreter.memory.length) % this.interpreter.memory.length;
            
            cells[i].textContent = state.memory[memoryIndex];
            cells[i].className = 'cell' + (i === this.centerCellIndex ? ' active' : '');
        }
        
        // Calculate the offset to keep the active cell centered
        // No need to adjust the transform since we're using the center cell as our reference
        this.tape.style.transform = 'translateX(-50%)';
        
        // Update output and code display
        this.output.textContent = state.output;
        this.updateCodeDisplay();
        
        if (state.isFinished) {
            this.stop();
        }
    }

    async toggleRun() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.isRunning = true;
            this.runButton.textContent = 'Stop';
            
            while (this.isRunning) {
                if (!this.step()) break;
                await new Promise(resolve => setTimeout(resolve, 101 - this.speed));
            }
        }
    }

    step() {
        const result = this.interpreter.step();
        this.updateVisualization();
        return result;
    }

    stop() {
        this.isRunning = false;
        this.runButton.textContent = 'Run';
    }

    reset() {
        this.stop();
        this.interpreter.reset();
        this.interpreter.code = this.codeInput.value.replace(/[^><+\-.,\[\]]/g, '');
        this.interpreter.ip = 0;
        this.interpreter.bracketMap = this.interpreter.buildBracketMap();
        this.initializeTape();
    }
}

// Initialize the interpreter and visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const interpreter = new BrainfInterpreter();
    const visualizer = new Visualizer(interpreter);
});
