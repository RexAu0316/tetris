window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const TetrisBlock = ({ x, y, isActive, isFixed }) => {
    return React.createElement(
      'div',
      {
        className: `tetris-block ${isActive ? 'active' : ''} ${isFixed ? 'fixed' : ''}`,
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
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isGameOver) {
          clearInterval(interval);
          return;
        }

        const newActivePiece = { ...activePiece, y: activePiece.y + 1 };
        if (canMovePiece(newActivePiece)) {
          setActivePiece(newActivePiece);
        } else {
          fixActivePiece();
          checkForCompletedRows();
          setActivePiece({
            x: Math.floor(BOARD_WIDTH / 2),
            y: 0,
            width: 1,
            height: 1,
          });
          if (!canMovePiece({ ...newActivePiece, y: 0 })) {
            setIsGameOver(true);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }, [activePiece, isGameOver]);

    const fixActivePiece = () => {
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
          return row[x];
        })
      );
      setBoard(newBoard);
    };

    const checkForCompletedRows = () => {
      const newBoard = board.filter((row) => row.some((cell) => !cell));
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(false));
      }
      setBoard(newBoard);
    };

    const canMovePiece = (piece) => {
      return (
        piece.y >= 0 &&
        piece.y + piece.height <= BOARD_HEIGHT &&
        piece.x >= 0 &&
        piece.x + piece.width <= BOARD_WIDTH &&
        !board.some((row, y) =>
          row.some((cell, x) => {
            return (
              x >= piece.x &&
              x < piece.x + piece.width &&
              y >= piece.y &&
              y < piece.y + piece.height &&
              cell
            );
          })
        )
      );
    };

    return React.createElement(
      'div',
      { className: 'tetris-game' },
      React.createElement('h2', null, 'Tetris'),
      isGameOver
        ? React.createElement('div', { className: 'game-over' }, 'Game Over')
        : React.createElement(
            'div',
            { className: 'game-board' },
            board.map((row, y) =>
              row.map((isActive, x) =>
                React.createElement(TetrisBlock, {
                  key: `${x}-${y}`,
                  x,
                  y,
                  isActive,
                  isFixed: isActive && !board[y][x],
                })
              )
        ))
    );
  };

  return () => React.createElement(TetrisGame, { assetsUrl: assetsUrl });
};

console.log('Tetris game script loaded');
