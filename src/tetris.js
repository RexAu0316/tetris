window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const BOARD_HEIGHT = 20;
    const BOARD_WIDTH = 10;
    const FALL_INTERVAL = 500; // milliseconds
    const DROP_DELAY = 1000; // milliseconds

    const [currentPosition, setCurrentPosition] = useState(0);
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]);

    const dropNewSquare = () => {
      setSquareColumn(4); // Reset to middle
      setCurrentPosition(0); // Start from the top
    };

    const clearFullRows = () => {
      const filledRows = new Set(fixedSquares.map(square => square.row));
      const newFixedSquares = fixedSquares.filter(square => !filledRows.has(square.row));
      return newFixedSquares;
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
          setCurrentPosition(prev => {
            if (prev < BOARD_HEIGHT - 2) {
              return prev + 1; // Move down
            } else {
              // Square has landed
              setFixedSquares(prevFixed => {
                const newFixed = [
                  ...prevFixed,
                  { row: prev, column: squareColumn },
                  { row: prev, column: squareColumn + 1 },
                  { row: prev + 1, column: squareColumn },
                  { row: prev + 1, column: squareColumn + 1 },
                ];
                return clearFullRows(newFixed);
              });
              return prev;
            }
          });
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      const handleInterval = setInterval(() => {
        setCurrentPosition(prev => {
          if (prev < BOARD_HEIGHT - 2) {
            return prev + 1; // Move down automatically
          } else {
            // Square has landed
            setFixedSquares(prevFixed => {
              const newFixed = [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 },
                { row: prev + 1, column: squareColumn },
                { row: prev + 1, column: squareColumn + 1 },
              ];
              return clearFullRows(newFixed);
            });
            dropNewSquare(); // Drop a new square
            return prev;
          }
        });
      }, FALL_INTERVAL);

      return () => clearInterval(handleInterval);
    }, [squareColumn]);

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
