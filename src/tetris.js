window.initGame = (React) => {
  const { useState, useEffect } = React;

  const TETROMINOS = [
    { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O-shape
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' }, // T-shape
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z-shape
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S-shape
    { shape: [[1], [1], [1], [1]], color: 'cyan' }, // I-shape
  ];

  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; 
    const [currentPosition, setCurrentPosition] = useState(0);
    const [squareColumn, setSquareColumn] = useState(4);
    const [currentTetromino, setCurrentTetromino] = useState(getRandomTetromino());
    const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const getRandomTetromino = () => {
      const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
      return TETROMINOS[randomIndex];
    };

    const dropNewSquare = () => {
      setSquareColumn(4);
      setCurrentPosition(0);
      setCurrentTetromino(getRandomTetromino());

      if (checkCollision(0, 4)) {
        setGameOver(true);
      }
    };

    const clearFullRows = (newBoard) => {
      const filledRows = newBoard.filter(row => row.every(cell => cell === 1)).length;
      const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0));
      const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
      setScore(prev => prev + filledRows * 10);
      return [...emptyRows, ...filteredBoard];
    };

    const checkCollision = (newPosition, column) => {
      for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[i].length; j++) {
          if (
            currentTetromino.shape[i][j] &&
            (newPosition + i >= BOARD_HEIGHT || // Check for bottom boundary
            column + j < 0 || // Check for left boundary
            column + j >= BOARD_WIDTH || // Check for right boundary
            board[newPosition + i][column + j] === 1) // Check for collision with other blocks
          ) {
            return true; // Collision detected
          }
        }
      }
      return false; // No collision
    };

    const rotateTetromino = () => {
      const newShape = currentTetromino.shape[0].map((_, index) =>
        currentTetromino.shape.map(row => row[index]).reverse()
      );

      if (!checkCollision(currentPosition, squareColumn, newShape)) {
        setCurrentTetromino({ ...currentTetromino, shape: newShape });
      }
    };

    const handleKeyDown = (event) => {
      event.preventDefault();
      if (gameOver) return;
      switch (event.key) {
        case "ArrowLeft":
          if (squareColumn > 0 && !checkCollision(currentPosition, squareColumn - 1)) {
            setSquareColumn(prev => Math.max(0, prev - 1));
          }
          break;
        case "ArrowRight":
          if (squareColumn <= BOARD_WIDTH - currentTetromino.shape[0].length && !checkCollision(currentPosition, squareColumn + 1)) {
            setSquareColumn(prev => Math.min(BOARD_WIDTH - currentTetromino.shape[0].length, prev + 1));
          }
          break;
        case "ArrowDown":
          if (currentPosition < BOARD_HEIGHT - currentTetromino.shape.length && !checkCollision(currentPosition + 1, squareColumn)) {
            setCurrentPosition(prev => prev + 1);
          }
          break;
        case "ArrowUp":
          rotateTetromino();
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      const handleInterval = setInterval(() => {
        if (!gameOver && currentPosition < BOARD_HEIGHT - currentTetromino.shape.length && !checkCollision(currentPosition + 1, squareColumn)) {
          setCurrentPosition(prev => prev + 1);
        } else {
          const newBoard = [...board];
          currentTetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
              if (cell) {
                newBoard[currentPosition + i][squareColumn + j] = 1; 
              }
            });
          });
          setBoard(clearFullRows(newBoard));
          dropNewSquare();
        }
      }, FALL_INTERVAL);
      return () => clearInterval(handleInterval);
    }, [currentPosition, squareColumn, board, currentTetromino, gameOver]);

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [gameOver]);

    return React.createElement(
      'div',
      { className: "tetris", tabIndex: 0, onFocus: () => dropNewSquare() },
      React.createElement('h2', null, "Simple Tetris"),
      React.createElement('h3', null, `Score: ${score}`),
      !gameOver ? (
        React.createElement(
          'div',
          { className: "game-board" },
          board.map((row, rowIndex) => {
            return React.createElement(
              'div',
              { key: rowIndex, className: "row" },
              row.map((cell, colIndex) => {
                const isActive = cell === 1 || 
                  currentTetromino.shape.some((row, i) => row.some((cell, j) => cell && rowIndex === currentPosition + i && colIndex === squareColumn + j));
                return React.createElement(
                  'div',
                  {
                    key: colIndex,
                    className: `cell ${isActive ? 'active' : ''}`,
                    style: { backgroundColor: isActive ? currentTetromino.color : undefined },
                  },
                  ''
                );
              })
            );
          })
        )
      ) : (
        React.createElement('div', null,
          React.createElement('h3', null, "Game Over!"),
          React.createElement('button', { onClick: dropNewSquare }, "Restart Game")
        )
      )
    );
  };
  return Tetris;
};

console.log('Tetris game script loaded');
