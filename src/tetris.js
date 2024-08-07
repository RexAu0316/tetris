window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; // milliseconds
    const DROP_DELAY = 1000; // milliseconds

    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(true);
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]);

    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setIsFalling(true);
      setCurrentPosition(0);
    };

const clearFullRows = (squares) => {
  const rowsFilled = Array(BOARD_HEIGHT).fill(0);

  // Count filled squares per row
  squares.forEach(({ row }) => {
    if (row < BOARD_HEIGHT) {
      rowsFilled[row]++;
    }
  });

  // Create a new array without filled rows
  const newSquares = squares.filter(({ row }) => rowsFilled[row] < BOARD_WIDTH);

  // Shift down the squares above cleared rows
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (rowsFilled[row] === BOARD_WIDTH) {
      newSquares.forEach(square => {
        if (square.row < row) return; // Skip squares below cleared row
        square.row--; // Shift down
      });
    }
  }

  return newSquares;
};

    const handleKeyDown = (event) => {
      if (!isFalling) return;

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
          setCurrentPosition(prev => {
            if (prev < BOARD_HEIGHT - 2) {
              return prev + 1; // Move down
            } else {
              // Square has landed
              setFixedSquares(prevFixed => {
                const newFixedSquares = [
                  ...prevFixed,
                  { row: prev, column: squareColumn },
                  { row: prev, column: squareColumn + 1 },
                  { row: prev + 1, column: squareColumn },
                  { row: prev + 1, column: squareColumn + 1 },
                ];
                return clearFullRows(newFixedSquares);
              });
              setIsFalling(false);
              return prev;
            }
          });
          break;
        case "ArrowUp":
          // Implement rotation if desired
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      const handleInterval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition(prev => {
            if (prev < BOARD_HEIGHT - 2) {
              return prev + 1; // Move down automatically
            } else {
              // Square has landed
              setFixedSquares(prevFixed => {
                const newFixedSquares = [
                  ...prevFixed,
                  { row: prev, column: squareColumn },
                  { row: prev, column: squareColumn + 1 },
                  { row: prev + 1, column: squareColumn },
                  { row: prev + 1, column: squareColumn + 1 },
                ];
                return clearFullRows(newFixedSquares);
              });
              setIsFalling(false);
              return prev;
            }
          });
        }
      }, FALL_INTERVAL);

      return () => clearInterval(handleInterval);
    }, [isFalling, squareColumn]);

    useEffect(() => {
      if (!isFalling) {
        const timeout = setTimeout(dropNewSquare, DROP_DELAY);
        return () => clearTimeout(timeout);
      }
    }, [isFalling]);

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFalling]);

    return React.createElement(
      'div',
      { className: "tetris" },
      React.createElement('h2', null, "Simplified Tetris"),
      React.createElement(
        'div',
        { className: "game-board" },
        Array.from({ length: BOARD_HEIGHT }, (_, rowIndex) => 
          React.createElement(
            'div',
            { key: rowIndex, className: "row" },
            Array.from({ length: BOARD_WIDTH }, (_, colIndex) =>
              React.createElement(
                'div',
                {
                  key: colIndex,
                  className: `cell ${
                    (rowIndex === currentPosition && (colIndex === squareColumn || colIndex === squareColumn + 1)) || 
                    (rowIndex === currentPosition + 1 && (colIndex === squareColumn || colIndex === squareColumn + 1)) ||
                    fixedSquares.some(fixed => fixed.row === rowIndex && fixed.column === colIndex)
                    ? 'active' : ''
                  }`,
                },
                ''
              )
            )
          )
        )
      )
    );
  };

  return Tetris;
};

console.log('Tetris game script loaded');
