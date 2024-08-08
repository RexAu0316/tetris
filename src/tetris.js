window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; // milliseconds

    const [currentPosition, setCurrentPosition] = useState(0);
    const [squareColumn, setSquareColumn] = useState(4);
    const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    const [isFalling, setIsFalling] = useState(true);

    const dropNewSquare = () => {
  if (board[0][4] === 1 || board[0][5] === 1) {
    alert("Game Over!"); // Implement better game over logic or UI
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))); // Reset the board
    return;
  }
  setSquareColumn(4); // Reset to middle column
  setCurrentPosition(0); // Start from the top
  setIsFalling(true);
};

    const clearFullRows = (newBoard) => {
      const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0));
      const filledRows = BOARD_HEIGHT - filteredBoard.length; // Count the filled rows
      const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
      return [...emptyRows, ...filteredBoard]; // Add empty rows at the top
    };

    const checkCollision = (newBoard, position, column) => {
  // Check for out of bounds
  if (position >= BOARD_HEIGHT - 2 || column < 0 || column + 1 >= BOARD_WIDTH) {
    return true; // Prevents moving out of bounds
  }
  return (
    newBoard[position][column] === 1 ||
    newBoard[position][column + 1] === 1 ||
    newBoard[position + 1][column] === 1 ||
    newBoard[position + 1][column + 1] === 1
  );
};

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          if (squareColumn > 0) {
            setSquareColumn(prev => Math.max(0, prev - 1)); // Move left
          }
          break;
        case "ArrowRight":
          if (squareColumn < BOARD_WIDTH - 2) {
            setSquareColumn(prev => Math.min(BOARD_WIDTH - 2, prev + 1)); // Move right
          }
          break;
        case "ArrowDown":
          if (isFalling) {
            setCurrentPosition(prev => {
              const newPosition = prev + 1;
              if (newPosition < BOARD_HEIGHT - 2 && !checkCollision(board, newPosition, squareColumn)) {
                return newPosition; // Move down if no collision
              } else {
                // Square has landed
                const newBoard = [...board];
                newBoard[prev][squareColumn] = 1; // Mark the position as filled
                newBoard[prev][squareColumn + 1] = 1;
                newBoard[prev + 1][squareColumn] = 1;
                newBoard[prev + 1][squareColumn + 1] = 1;
                setBoard(clearFullRows(newBoard));
                setIsFalling(false); // Mark as not falling anymore
                dropNewSquare(); // Drop a new square
                return prev; // Return the original position
              }
            });
          } else {
            // Allow moving the piece down after it has landed
            setCurrentPosition(prev => {
              const newPosition = prev + 1;
              if (newPosition < BOARD_HEIGHT - 1 && !checkCollision(board, newPosition, squareColumn)) {
                return newPosition; // Move down if no collision
              }
              return prev; // Stay if it cannot move down
            });
          }
          break;
        default:
          break;
      }
    };

    useEffect(() => {
  const handleInterval = setInterval(() => {
    if (isFalling) {
      setCurrentPosition(prev => {
        const newPosition = prev + 1;
        if (newPosition < BOARD_HEIGHT - 2 && !checkCollision(board, newPosition, squareColumn)) {
          return newPosition; // Move down if no collision
        } else {
          // Square has landed
          const newBoard = [...board];
          newBoard[prev][squareColumn] = 1;
          newBoard[prev][squareColumn + 1] = 1;
          newBoard[prev + 1][squareColumn] = 1;
          newBoard[prev + 1][squareColumn + 1] = 1;
          setBoard(clearFullRows(newBoard));
          setIsFalling(false); // Mark as not falling anymore
          dropNewSquare(); // Drop a new square
          return prev; // Return the original position
        }
      });
    }
  }, FALL_INTERVAL);

  return () => clearInterval(handleInterval);
}, [isFalling, squareColumn, board]);

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
