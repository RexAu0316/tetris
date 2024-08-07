window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(false);
    const [isPositionSet, setIsPositionSet] = useState(false); // New state
    const boardHeight = 20;
    const boardWidth = 10;
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]);

    // Handle keydown events
    const handleKeyDown = (event) => {
      if (!isFalling) { // Allow movement only when the square is not falling
        switch (event.key) {
          case "ArrowLeft":
            if (squareColumn > 0) {
              setSquareColumn((prev) => prev - 1);
            }
            break;
          case "ArrowRight":
            if (squareColumn < boardWidth - 2) { // Adjust for 2x2 square
              setSquareColumn((prev) => prev + 1);
            }
            break;
          case "Space": // Confirm the drop position
            setIsPositionSet(true); // Set position for falling
            dropNewSquare(); // Start falling
            break;
          default:
            break;
        }
      } else if (isFalling) { // Handle falling square movement
        switch (event.key) {
          case "ArrowDown":
            setCurrentPosition((prev) => {
              if (prev < boardHeight - 2) {
                return prev + 1;
              } else {
                return prev; // Prevent moving down if at the bottom
              }
            });
            break;
          // Optional: Handle rotation or other logic with ArrowUp
          default:
            break;
        }
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFalling, squareColumn]); // Dependencies to re-attach

    const dropNewSquare = () => {
      setCurrentPosition(0); // Reset position for the new square
      setSquareColumn(4); // Reset to starting column in the middle
      setIsFalling(true); // Start falling again
      setIsPositionSet(false); // Reset position set state
    };

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
