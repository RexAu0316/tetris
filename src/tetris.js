// tetris.js
window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const TetrisBlock = ({ x, y, isActive }) => {
    return React.createElement(
      'div',
      {
        className: `tetris-block ${isActive ? 'active' : ''}`,
        style: {
          gridColumnStart: x + 1,
          gridRowStart: y + 1,
        },
      },
      null
    );
  };

  const TetrisGame = ({ assetsUrl }) => {
    const [board, setBoard] = useState(
      Array(BOARD_HEIGHT)
        .fill(0)
        .map(() => Array(BOARD_WIDTH).fill(false))
    );
    const [activePiece, setActivePiece] = useState({
      x: Math.floor(BOARD_WIDTH / 2),
      y: 0,
      width: 1,
      height: 1,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setActivePiece((prevPiece) => ({
          ...prevPiece,
          y: prevPiece.y + 1,
        }));
      }, 500);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const newBoard = board.map((row, y) =>
        row.map((_, x) => {
          if (
            x >= activePiece.x &&
            x < activePiece.x + activePiece.width &&
            y >= activePiece.y &&
            y < activePiece.y + activePiece.height
          ) {
            return true;
          }
          return false;
        })
      );
      setBoard(newBoard);
    }, [activePiece]);

    return React.createElement(
      'div',
      { className: 'tetris-game' },
      React.createElement('h2', null, 'Tetris'),
      React.createElement(
        'div',
        { className: 'game-board' },
        board.map((row, y) =>
          row.map((isActive, x) =>
            React.createElement(TetrisBlock, {
              key: `${x}-${y}`,
              x,
              y,
              isActive,
            })
          )
        )
      )
    );
  };

  return () => React.createElement(TetrisGame, { assetsUrl: assetsUrl });
};

console.log('Tetris game script loaded');
