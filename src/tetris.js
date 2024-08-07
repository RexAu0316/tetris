window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(true);
    const boardHeight = 20;
    const boardWidth = 10;
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]); // To store fixed squares

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
                { row: prev + 1, column: squareColumn },
              ]);
              setIsFalling(false); // Stop falling
              clearInterval(interval);
              return prev; // Don't change position if it is at the bottom
            }
          });
        }
      }, 500);

      return () => clearInterval(interval);
    }, [isFalling]);

    const dropNewSquare = () => {
      setCurrentPosition(0); // Reset position for the new square
      setSquareColumn(4); // Reset to starting column in the middle
      setIsFalling(true); // Start falling again
    };

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
                    // Check if the cell is part of the active square or fixed squares
                    (rowIndex === currentPosition && (colIndex === squareColumn || colIndex === squareColumn + 1)) || 
                    (rowIndex === currentPosition + 1 && (colIndex === squareColumn || colIndex === squareColumn + 1)) ||
                    fixedSquares.some(fixed => fixed.row === rowIndex && fixed.column === colIndex) // Check fixed squares
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
