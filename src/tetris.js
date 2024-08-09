window.initGame = (React) => {
  const { useState, useEffect } = React;
  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; // milliseconds
    const [currentPosition, setCurrentPosition] = useState(0);
    const [squareColumn, setSquareColumn] = useState(4);
    const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    
    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setCurrentPosition(0); // Start from the top
    };

    const clearFullRows = (newBoard) => {
      const filteredBoard = newBoard.filter(row => row.some(cell => cell === 0));
      const filledRows = BOARD_HEIGHT - filteredBoard.length; // Count the filled rows
      const emptyRows = Array.from({ length: filledRows }, () => Array(BOARD_WIDTH).fill(0));
      return [...emptyRows, ...filteredBoard]; // Add empty rows at the top
    };

    const checkCollision = (newPosition) => {
      // Check if the square can move down
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          // Check for bottom boundary and existing blocks
          if (newPosition + i >= BOARD_HEIGHT || squareColumn + j < 0 || squareColumn + j >= BOARD_WIDTH || board[newPosition + i][squareColumn + j] === 1) {
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
          setCurrentPosition(prev => {
            const newPosition = prev + 1;
            if (!checkCollision(newPosition)) {
              return newPosition; // Move down if no collision
            } else {
              // Square has landed
              const newBoard = [...board];
              newBoard[prev][squareColumn] = 1;
              newBoard[prev][squareColumn + 1] = 1;
              newBoard[prev + 1][squareColumn] = 1;
              newBoard[prev + 1][squareColumn + 1] = 1;
              setBoard(clearFullRows(newBoard));
              dropNewSquare(); // Drop a new square
              return prev; // Stay in place
            }
          });
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      const handleInterval = setInterval(() => {
        const newPosition = currentPosition + 1;
        if (!checkCollision(newPosition)) {
          setCurrentPosition(newPosition); // Move down automatically
        } else {
          // Square has landed
          const newBoard = [...board];
          newBoard[currentPosition][squareColumn] = 1;
          newBoard[currentPosition][squareColumn + 1] = 1;
          newBoard[currentPosition + 1][squareColumn] = 1;
          newBoard[currentPosition + 1][squareColumn + 1] = 1;
          setBoard(clearFullRows(newBoard));
          dropNewSquare(); // Drop a new square
        }
      }, FALL_INTERVAL);
      return () => clearInterval(handleInterval);
    }, [currentPosition, squareColumn, board]);

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
        // Create a new board for rendering to include the current falling square
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
