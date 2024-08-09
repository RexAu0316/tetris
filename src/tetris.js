window.initGame = (React) => {
  const { useState, useEffect } = React;
  const Tetris = () => {
  const BOARD_HEIGHT = 20;
  const BOARD_WIDTH = 10;
  const FALL_INTERVAL = 500; // milliseconds
  const [currentPosition, setCurrentPosition] = useState(0);
  const [squareColumn, setSquareColumn] = useState(4);
  const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
  const [hasLanded, setHasLanded] = useState(false); // Track if the piece has landed

  const dropNewSquare = () => {
    setSquareColumn(4); // Reset to middle
    setCurrentPosition(0); // Start from the top
    setHasLanded(false); // Reset landed state
  };

  const clearFullRows = (newBoard) => {
    const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0));
    const filledRows = BOARD_HEIGHT - filteredBoard.length; // Count the filled rows
    const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
    return [...emptyRows, ...filteredBoard]; // Add empty rows at the top
  };

  const checkCollision = (newPosition) => {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (
          newPosition + i >= BOARD_HEIGHT ||
          squareColumn + j < 0 ||
          squareColumn + j >= BOARD_WIDTH ||
          board[newPosition + i][squareColumn + j] === 1
        ) {
          return true; // Collision detected
        }
      }
    }
    return false; // No collision
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        if (squareColumn > 0 && !checkCollision(currentPosition)) {
          setSquareColumn(prev => Math.max(0, prev - 1)); // Move left
        }
        break;
      case "ArrowRight":
        if (squareColumn < BOARD_WIDTH - 2 && !checkCollision(currentPosition)) {
          setSquareColumn(prev => Math.min(BOARD_WIDTH - 2, prev + 1)); // Move right
        }
        break;
      case "ArrowDown":
        // Allow moving down only if the piece has not landed
        if (!hasLanded && currentPosition < BOARD_HEIGHT - 2 && !checkCollision(currentPosition + 1)) {
          setCurrentPosition(prev => prev + 1); // Move down
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleInterval = setInterval(() => {
      if (!hasLanded && currentPosition < BOARD_HEIGHT - 2 && !checkCollision(currentPosition + 1)) {
        setCurrentPosition(prev => prev + 1); // Move down automatically
      } else {
        // Square has landed
        const newBoard = [...board];
        newBoard[currentPosition][squareColumn] = 1;
        newBoard[currentPosition][squareColumn + 1] = 1;
        newBoard[currentPosition + 1][squareColumn] = 1;
        newBoard[currentPosition + 1][squareColumn + 1] = 1;
        setBoard(clearFullRows(newBoard));
        setHasLanded(true); // Mark as landed
        dropNewSquare(); // Drop a new square
      }
    }, FALL_INTERVAL);
    return () => clearInterval(handleInterval);
  }, [currentPosition, squareColumn, board, hasLanded]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return React.createElement(
    'div',
    { className: "tetris" },
    React.createElement('h2', null, "Simple Tetris"),
    React.createElement(
      'div',
      { className: "game-board" },
      board.map((row, rowIndex) => {
        const isCurrentRow = rowIndex === currentPosition || rowIndex === currentPosition + 1;
        return React.createElement(
          'div',
          { key: rowIndex, className: "row" },
          row.map((cell, colIndex) => {
            const isActive = cell === 1 || (isCurrentRow && (colIndex === squareColumn || colIndex === squareColumn + 1));
            return React.createElement(
              'div',
              {
                key: colIndex,
                className: `cell ${isActive ? 'active' : ''}`,
              },
              ''
            );
          })
        );
      })
    )
  );
};
  return Tetris;
};
console.log('Tetris game script loaded');
