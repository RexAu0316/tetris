window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const TetrisBlock = ({ x, y, isActive, color }) => {
    return React.createElement(
      'div',
      {
        className: `tetris-block block-color-${color} ${isActive ? 'active' : ''}`,
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
      width: 2,
      height: 2,
      color: 1,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setActivePiece((prevPiece) => {
          // Check if the piece can move down
          if (prevPiece.y + prevPiece.height < BOARD_HEIGHT && !isColliding(prevPiece.x, prevPiece.y + 1, prevPiece.width, prevPiece.height, board)) {
            return {
              ...prevPiece,
              y: prevPiece.y + 1,
            };
          } else {
            // Stop the piece and update the board
            updateBoard(prevPiece.x, prevPiece.y, prevPiece.width, prevPiece.height, prevPiece.color, board, true);
            // Generate a new piece
            return {
              x: Math.floor(BOARD_WIDTH / 2),
              y: 0,
              width: 2,
              height: 2,
              color: Math.floor(Math.random() * 7) + 1,
            };
          }
        });
      }, 500);
      return () => clearInterval(interval);
    }, [board]);

    // Helper function to check if the piece is colliding with the existing blocks
    const isColliding = (x, y, width, height, board) => {
      for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
          if (i >= 0 && i < BOARD_HEIGHT && j >= 0 && j < BOARD_WIDTH && board[i][j]) {
            return true;
          }
        }
      }
      return false;
    };

    // Helper function to update the board with the new piece
    const updateBoard = (x, y, width, height, color, board, isActive) => {
      const newBoard = [...board];
      for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
          newBoard[i][j] = isActive ? color : false;
        }
      }
      setBoard(newBoard);
    };

    useEffect(() => {
      const newBoard = board.map((row, y) =>
        row.map((_, x) => {
          if (
            x >= activePiece.x &&
            x < activePiece.x + activePiece.width &&
            y >= activePiece.y &&
            y < activePiece.y + activePiece.height
          ) {
            return activePiece.color;
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
          row.map((color, x) =>
            React.createElement(TetrisBlock, {
              key: `${x}-${y}`,
              x,
              y,
              isActive: color !== false,
              color: color || 0,
            })
          )
        )
      )
    );
  };

  return () => React.createElement(TetrisGame, { assetsUrl: assetsUrl });
};

console.log('Tetris game script loaded');
