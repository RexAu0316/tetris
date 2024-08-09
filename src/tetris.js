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
    const [gameOver, setGameOver] = useState(false); // Track game over state
    const [score, setScore] = useState(0); // Track player score

    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setCurrentPosition(0); // Start from the top
      setHasLanded(false); // Reset landed state

      // Check for game over condition
      if (checkCollision(0)) {
        setGameOver(true); // Set game over state
      }
    };

    const resetGame = () => {
      setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
      setScore(0); // Reset score
      setGameOver(false); // Reset game over state
      dropNewSquare(); // Start a new game
    };

    const clearFullRows = (newBoard) => {
      const filledRows = newBoard.filter(row => row.every(cell => cell === 1)).length; // Count filled rows
      const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0)); // Keep rows that have empty cells
      const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
      setScore(prev => prev + filledRows * 10); // Update score
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
      if (gameOver) return; // Prevent any key action if game is over
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
          // Allow moving down if not landed or if not blocked
          if (currentPosition < BOARD_HEIGHT - 2 && !checkCollision(currentPosition + 1)) {
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
      React.createElement('h3', null, `Score: ${score}`), // Display the score
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
                  (rowIndex === currentPosition && (colIndex === squareColumn || colIndex === squareColumn + 1)) ||
                  (rowIndex === currentPosition + 1 && (colIndex === squareColumn || colIndex === squareColumn + 1));
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
      ) : (
        React.createElement('button', { onClick: resetGame }, "Restart Game") // Restart button
      )
    );
  };
  return Tetris;
};

console.log('Tetris game script loaded');
