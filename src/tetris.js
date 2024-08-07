window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const boardHeight = 20;
    const boardWidth = 10;
    const [currentPosition, setCurrentPosition] = useState(0); // Fixed at 0 for new squares
    const [isFalling, setIsFalling] = useState(true);
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]);

    const dropNewSquare = () => {
      // Set the square column based on the last placed square's column
      setSquareColumn(squareColumn); // Use the last column where the square was placed
      setIsFalling(true); // Start falling again
      setCurrentPosition(0); // Reset to the top of the board
    };

    const handleKeyDown = (event) => {
      if (isFalling) {
        switch (event.key) {
          case "ArrowLeft":
            // Move left if not at the left edge
            if (squareColumn > 0) {
              setSquareColumn((prev) => prev - 1);
            }
            break;
          case "ArrowRight":
            // Move right if not at the right edge
            if (squareColumn < boardWidth - 2) { // Adjust for 2x2 square
              setSquareColumn((prev) => prev + 1);
            }
            break;
          case "ArrowDown":
            // Place the square where it is currently falling
            setCurrentPosition((prev) => {
              if (prev < boardHeight - 2) { // Adjust for 2x2 square
                return prev + 1;
              } else {
                // Add the square to the fixed squares when it reaches the bottom
                setFixedSquares((prevFixed) => [
                  ...prevFixed,
                  { row: prev, column: squareColumn },
                  { row: prev, column: squareColumn + 1 }, // Right cell
                  { row: prev + 1, column: squareColumn }, // Below cell
                  { row: prev + 1, column: squareColumn + 1 }, // Below right cell
                ]);
                setIsFalling(false); // Stop falling
                return prev; // Keep the position the same
              }
            });
            break;
          case "ArrowUp":
            // Optional: Implement rotation or other logic
            break;
          default:
            break;
        }
      }
    };

    useEffect(() => {
      // Add event listener for keydown
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        // Clean up the event listener
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFalling, squareColumn]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition((prev) => {
            if (prev < boardHeight - 2) { // Adjust for 2x2 square
              return prev + 1;
            } else {
              // Add the square to the fixed squares when it reaches the bottom
              setFixedSquares((prevFixed) => [
                ...prevFixed,
                { row: prev, column: squareColumn },
                { row: prev, column: squareColumn + 1 }, // Right cell
                { row: prev + 1, column: squareColumn }, // Below cell
                { row: prev + 1, column: squareColumn + 1 }, // Below right cell
              ]);
              setIsFalling(false); // Stop falling
              return prev; // Keep the position the same
            }
          });
        }
      }, 500);

      return () => clearInterval(interval);
    }, [isFalling]);

    useEffect(() => {
      if (!isFalling) {
        const timeout = setTimeout(() => {
          dropNewSquare(); // Drop a new square after the current one stops
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }, [isFalling]);

    return React.createElement(
      'div',
      { className: "tetris" },
      React.createElement('h2', null, "Simplified Tetris"),
      React.createElement(
        'div',
        { className: "game-board" },
        Array.from({ length: boardHeight }, (_, rowIndex) =>
          React.createElement(
            'div',
            { key: rowIndex, className: "row" },
            Array.from({ length: boardWidth }, (_, colIndex) =>
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
