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
    const [score, setScore] = useState(0); // New score state

    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setIsFalling(true);
      setCurrentPosition(0);
    };

    const checkForFullRows = () => {
      const rowsToClear = [];
      // Create an array to count filled cells in each row
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        let isFull = true;
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (!fixedSquares.some(fixed => fixed.row === row && fixed.column === col)) {
            isFull = false;
            break;
          }
        }
        if (isFull) rowsToClear.push(row);
      }
      return rowsToClear;
    };

    const removeFullRows = (rowsToClear) => {
      // Update score based on number of cleared rows
      setScore(prevScore => prevScore + rowsToClear.length);
      // Remove full rows from fixed squares
      setFixedSquares(prevFixed => {
        return prevFixed.filter(fixed => !rowsToClear.includes(fixed.row))
          .map(fixed => ({
            ...fixed,
            row: fixed.row > Math.max(...rowsToClear) ? fixed.row - rowsToClear.length : fixed.row // Shift down
          }));
      });
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
              setFixedSquares(prevFixed => [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 },
                { row: prev + 1, column: squareColumn },
                { row: prev + 1, column: squareColumn + 1 },
              ]);
              setIsFalling(false);
              // Check for full rows
              const fullRows = checkForFullRows();
              if (fullRows.length > 0) {
                removeFullRows(fullRows);
              }
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
              setFixedSquares(prevFixed => [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 },
                { row: prev + 1, column: squareColumn },
                { row: prev + 1, column: squareColumn + 1 },
              ]);
              setIsFalling(false);
              // Check for full rows
              const fullRows = checkForFullRows();
              if (fullRows.length > 0) {
                removeFullRows(fullRows);
              }
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
      React.createElement('div', null, `Score: ${score}`), // Display score
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
