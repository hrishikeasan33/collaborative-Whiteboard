// src/App.js
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000'); // Connect to backend server

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pen'); // Tool can be 'pen' or 'eraser'
  const [color, setColor] = useState('#000'); // Default pen color

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 5; // Set initial line width
    ctx.lineCap = 'round'; // Round line ends
    setContext(ctx);

    // Listen to 'drawing' events from the server
    socket.on('drawing', ({ x0, y0, x1, y1, color, width }) => {
      drawOnCanvas(x0, y0, x1, y1, color, width, false);
    });

    return () => {
      socket.off('drawing');
    };
  }, []);

  const drawOnCanvas = (x0, y0, x1, y1, color, width, emit) => {
    if (!context) return;

    context.strokeStyle = color;
    context.lineWidth = width;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (!emit) return;

    socket.emit('drawing', { x0, y0, x1, y1, color, width });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { clientX: x, clientY: y } = e;
    prevX.current = x;
    prevY.current = y;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = tool === 'pen' ? 5 : 30; // Eraser is larger
    const strokeColor = tool === 'pen' ? color : '#fff'; // Use white for eraser (background color)

    drawOnCanvas(prevX.current, prevY.current, x, y, strokeColor, width, true);

    prevX.current = x;
    prevY.current = y;
  };

  // Track previous mouse positions
  const prevX = useRef(null);
  const prevY = useRef(null);

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === 'eraser'}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="whiteboard"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default App;
