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
        setActivePiece((prevPiece) => {
          // Check if the piece can move down
          if (prevPiece.y + prevPiece.height < BOARD_HEIGHT && !isColliding(prevPiece.x, prevPiece.y + 1, prevPiece.width, prevPiece.height, board)) {
            return {
              ...prevPiece,
              y: prevPiece.y + 1,
            };
          } else {
            // Stop the piece and update the board
            updateBoard(prevPiece.x, prevPiece.y, prevPiece.width, prevPiece.height, board, true);
            return {
              x: Math.floor(BOARD_WIDTH / 2),
              y: 0,
              width: 1,
              height: 1,
            };
          }
        });
      }, 500);
      return () => clearInterval(interval);
    }, [board]);
  
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
  
    const updateBoard = (x, y, width, height, board, isActive) => {
      const newBoard = board.map((row, rowIndex) => {
        if (rowIndex >= y && rowIndex < y + height) {
          return row.map((_, columnIndex) => {
            if (columnIndex >= x && columnIndex < x + width) {
              return isActive;
            }
            return row[columnIndex];
          });
        }
        return row;
      });
      setBoard(newBoard);
    };

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
