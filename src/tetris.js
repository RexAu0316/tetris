// tetris.js

window.initTetrisGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const TetrisGame = ({ assetsUrl }) => {
    const [gameBoard, setGameBoard] = useState(Array(20).fill().map(() => Array(10).fill(false)));
    const [currentPiece, setCurrentPiece] = useState({
      shape: [[true]],
      position: { x: 4, y: 0 }
    });
    const [score, setScore] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        moveDown();
      }, 500);
      return () => clearInterval(interval);
    }, []);

    const moveDown = () => {
      if (canMove(currentPiece.position.x, currentPiece.position.y + 1, currentPiece.shape)) {
        setCurrentPiece({
          ...currentPiece,
          position: { x: currentPiece.position.x, y: currentPiece.position.y + 1 }
        });
      } else {
        placePiece();
        setCurrentPiece({
          shape: [[true]],
          position: { x: 4, y: 0 }
        });
      }
    };

    const canMove = (x, y, shape) => {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] && (y + i >= 20 || gameBoard[y + i][x + j])) {
            return false;
          }
        }
      }
      return true;
    };

    const placePiece = () => {
      const newGameBoard = [...gameBoard];
      for (let i = 0; i < currentPiece.shape.length; i++) {
        for (let j = 0; j < currentPiece.shape[i].length; j++) {
          if (currentPiece.shape[i][j]) {
            newGameBoard[currentPiece.position.y + i][currentPiece.position.x + j] = true;
          }
        }
      }
      setGameBoard(newGameBoard);
    };

    return React.createElement(
      'div',
      { className: "tetris-game" },
      React.createElement('h2', null, "Tetris"),
      React.createElement('p', null, `Score: ${score}`),
      React.createElement(
        'div',
        { className: "game-board" },
        gameBoard.map((row, y) =>
          React.createElement(
            'div',
            { key: y, className: "game-row" },
            row.map((cell, x) =>
              React.createElement(
                'div',
                {
                  key: `${x}-${y}`,
                  className: `game-cell ${cell ? 'filled' : ''} ${currentPiece.position.x === x && currentPiece.position.y === y ? 'active' : ''}`
                }
              )
            )
          )
        )
      )
    );
  };

  return () => React.createElement(TetrisGame, { assetsUrl: assetsUrl });
};

console.log('Tetris game script loaded');
