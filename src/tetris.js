window.initTetrisGame = (React) => {
  const { useState, useEffect } = React;

  const TetrisGame = () => {
    const [board, setBoard] = useState(Array(20).fill(Array(10).fill(0)));
    const [position, setPosition] = useState({ x: 4, y: 0 });
    const [intervalId, setIntervalId] = useState(null);

    const moveDown = () => {
      setPosition((pos) => {
        if (pos.y < 19 && board[pos.y + 1][pos.x] === 0) {
          return { ...pos, y: pos.y + 1 };
        }
        clearInterval(intervalId);
        return pos;
      });
    };

    useEffect(() => {
      const id = setInterval(moveDown, 500);
      setIntervalId(id);
      return () => clearInterval(id);
    }, []);

    const renderBoard = () => {
      return board.map((row, y) =>
        row.map((cell, x) => {
          const isSquare = position.x === x && position.y === y;
          return React.createElement('div', {
            key: `${x}-${y}`,
            className: `cell ${isSquare ? 'square' : ''}`,
          });
        })
      );
    };

    return React.createElement(
      'div',
      { className: "tetris-game" },
      React.createElement('h2', null, "Tetris Game"),
      React.createElement('div', { className: "game-board" }, renderBoard())
    );
  };

  return () => React.createElement(TetrisGame);
};

console.log('Tetris game script loaded');
