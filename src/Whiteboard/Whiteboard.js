import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './Whiteboard.css'; 
const socket = io('http://localhost:4000'); 

const Whiteboard = () => {
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); 
  const [color, setColor] = useState('black');
  const [users, setUsers] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    socket.on('updateCanvas', (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = data.lineWidth;
      ctx.strokeStyle = data.color;
      ctx.lineCap = 'round';

      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    socket.on('activeUsers', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('updateCanvas');
      socket.off('activeUsers');
    };
  }, []);

  const startDrawing = (event) => {
    setDrawing(true);
    draw(event); 
  };

  const stopDrawing = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); 
  };

  const draw = (event) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;

    ctx.lineWidth = tool === 'paint' ? 10 : (tool === 'pen' ? 5 : 2);
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color; 
    ctx.lineCap = 'round';

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    
    socket.emit('draw', {
      x: offsetX,
      y: offsetY,
      color: ctx.strokeStyle,
      lineWidth: ctx.lineWidth,
    });
  };

  return (
    <div className="whiteboard-container">
      <div className="controls">
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option value="pencil">Pencil</option>
          <option value="pen">Pen</option>
          <option value="paint">Paint</option>
        </select>
        <button onClick={() => setTool('eraser')}>
          Eraser
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Pick a color"
        />
      </div>
      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        className="whiteboard-canvas"
      />
      <div className="user-list">
        <h3>Active Users</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Whiteboard;
