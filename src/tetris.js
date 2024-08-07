window.initGame = (React) => {
  const { useState, useEffect, useRef } = React;

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

    const handleKeyDown = (event) => {
      if (!isFalling) return;

      const moveSquare = (newColumn) => {
        setSquareColumn(prev => Math.max(0, Math.min(newColumn, BOARD_WIDTH - 2))); // Ensure within bounds
      };

      switch (event.key) {
        case "ArrowLeft":
          moveSquare(squareColumn - 1);
          break;
        case "ArrowRight":
          moveSquare(squareColumn + 1);
          break;
        case "ArrowDown":
          setCurrentPosition((prev) => {
            if (prev < BOARD_HEIGHT - 2) {
              return prev + 1;
            } else {
              setFixedSquares(prevFixed => [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 },
                { row: prev + 1, column: squareColumn },
                { row: prev + 1, column: squareColumn + 1 },
              ]);
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
          setCurrentPosition((prev) => {
            if (prev < BOARD_HEIGHT - 2) {
              return prev + 1;
            } else {
              setFixedSquares(prevFixed => [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 },
                { row: prev + 1, column: squareColumn },
                { row: prev + 1, column: squareColumn + 1 },
              ]);
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
