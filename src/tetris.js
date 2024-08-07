window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const boardHeight = 20;
    const boardWidth = 10;
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(false); // Initially not falling
    const [squareColumn, setSquareColumn] = useState(null); // Start with no column
    const [fixedSquares, setFixedSquares] = useState([]);

    const dropNewSquare = () => {
      setIsFalling(true); // Start falling
      setCurrentPosition(0); // Reset to the top of the board
    };

    const handleKeyDown = (event) => {
      if (isFalling) {
        switch (event.key) {
          case "ArrowLeft":
            if (squareColumn > 0) {
              setSquareColumn((prev) => prev - 1);
            }
            break;
          case "ArrowRight":
            if (squareColumn < boardWidth - 2) {
              setSquareColumn((prev) => prev + 1);
            }
            break;
          case "ArrowDown":
            setCurrentPosition((prev) => {
              if (prev < boardHeight - 2) {
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

    const handleCellClick = (colIndex) => {
      if (!isFalling && squareColumn === null) { // Only if not falling and no column selected
        setSquareColumn(colIndex); // Set the selected column
        dropNewSquare(); // Start dropping the square
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFalling, squareColumn]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition((prev) => {
            if (prev < boardHeight - 2) {
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
                  onClick: () => handleCellClick(colIndex), // Allow column selection
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
