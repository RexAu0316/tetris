window.initGame = (React) => {
  const { useState, useEffect } = React;

  // Adjust your Tetromino definitions to match the active color
const TETROMINOS = [
  { shape: [[1, 1], [1, 1]], color: 'yellow' }, // Square
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' }, // T-shape
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z-shape
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S-shape
  { shape: [[1], [1], [1], [1]], color: 'cyan' }, // I-shape
];

// In the render part of your Tetris component, update the logic for active cells
const backgroundColor = isActive ? currentTetromino.color : (cell === 1 ? 'gray' : undefined);

  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; // milliseconds
    const [currentPosition, setCurrentPosition] = useState(0);
    const [squareColumn, setSquareColumn] = useState(4);
    const [currentTetromino, setCurrentTetromino] = useState(getRandomTetromino());
    const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    const [hasLanded, setHasLanded] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setCurrentPosition(0); // Start from the top
      setHasLanded(false);
      setCurrentTetromino(getRandomTetromino()); // Set a new random Tetromino

      // Check for game over condition
      if (checkCollision(0, 4)) {
        setGameOver(true);
      }
    };

    const resetGame = () => {
      setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
      setScore(0);
      setGameOver(false);
      dropNewSquare();
    };

    const getRandomTetromino = () => {
      const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
      return TETROMINOS[randomIndex];
    };

    const clearFullRows = (newBoard) => {
      const filledRows = newBoard.filter(row => row.every(cell => cell === 1)).length;
      const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0));
      const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
      setScore(prev => prev + filledRows * 10);
      return [...emptyRows, ...filteredBoard];
    };

    const checkCollision = (nextPosition, nextColumn) => {
      for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[i].length; j++) {
          if (currentTetromino.shape[i][j]) {
            const newRow = nextPosition + i;
            const newCol = nextColumn + j;
            // Check for left and right borders
            if (newCol < 0 || newCol >= BOARD_WIDTH) {
              return true; // Collision detected with borders
            }
            // Check for bottom border
            if (newRow >= BOARD_HEIGHT) {
              return true; // Collision detected with bottom
            }
            // Check if the cell is already occupied
            if (newRow >= 0 && board[newRow][newCol] === 1) {
              return true; // Collision detected with landed pieces
            }
          }
        }
      }
      return false; // No collision
    };

    // Falling logic and board updates
    useEffect(() => {
      const handleInterval = setInterval(() => {
        if (!hasLanded && currentPosition < BOARD_HEIGHT - currentTetromino.shape.length && !checkCollision(currentPosition + 1, squareColumn)) {
          setCurrentPosition(prev => prev + 1); // Move down
        } else {
          const newBoard = [...board];
          currentTetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
              if (cell) {
                newBoard[currentPosition + i][squareColumn + j] = 1; // Mark cells as landed
              }
            });
          });
          setBoard(clearFullRows(newBoard));
          setHasLanded(true); // Mark that the piece has landed
          dropNewSquare(); // Drop a new Tetromino
        }
      }, FALL_INTERVAL);
      return () => clearInterval(handleInterval);
    }, [currentPosition, squareColumn, board, hasLanded, currentTetromino]);

    const rotateTetromino = () => {
      const newShape = currentTetromino.shape[0].map((_, index) => 
        currentTetromino.shape.map(row => row[index]).reverse()
      );
      const originalShape = currentTetromino.shape; // Keep original shape for reversion
      setCurrentTetromino(prev => ({ ...prev, shape: newShape }));
      if (checkCollision(currentPosition, squareColumn)) {
        setCurrentTetromino(prev => ({ ...prev, shape: originalShape })); // Revert if collision occurs
      }
    };

    const handleKeyDown = (event) => {
      event.preventDefault();
      if (gameOver) return;
      switch (event.key) {
        case "ArrowLeft":
          if (!checkCollision(currentPosition, squareColumn - 1)) {
            setSquareColumn(prev => Math.max(0, prev - 1));
          }
          break;
        case "ArrowRight":
          if (!checkCollision(currentPosition, squareColumn + 1)) {
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
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [gameOver]); // Add gameOver as a dependency

    return React.createElement(
  'div',
  { className: "game-board" },
  board.map((row, rowIndex) => {
    return React.createElement(
      'div',
      { key: rowIndex, className: "row" },
      row.map((cell, colIndex) => {
        // Determine if this cell is part of the active Tetromino
        const isActive = currentTetromino.shape.some((tetrominoRow, i) => 
          tetrominoRow.some((cellValue, j) => 
            cellValue && rowIndex === currentPosition + i && colIndex === squareColumn + j
          )
        );

        const backgroundColor = isActive ? currentTetromino.color : (cell === 1 ? 'gray' : undefined); // Gray for landed pieces
        return React.createElement(
          'div',
          {
            key: colIndex,
            className: `cell ${isActive ? 'active' : ''}`,
            style: { backgroundColor: backgroundColor },
          },
          ''
        );
      })
    );
  })
);
      ) : (
        React.createElement('div', null,
          React.createElement('h3', null, "Game Over!"),
          React.createElement('button', { onClick: resetGame }, "Restart Game")
        )
      )
    );
  };

  return Tetris;
};

console.log('Tetris game script loaded');
