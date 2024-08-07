window.initGame = (React) => {
  const { useState, useEffect } = React;

const Tetris = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFalling, setIsFalling] = useState(true);
  const boardHeight = 20;
  const boardWidth = 10;
  const [squareColumn, setSquareColumn] = useState(4);
  const [fixedSquares, setFixedSquares] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFalling) {
        setCurrentPosition((prev) => {
          if (prev < boardHeight - 1) { // Change to -1
            return prev + 1;
          } else {
            // Add the square to the fixed squares when it reaches the bottom
            setFixedSquares((prevFixed) => [
              ...prevFixed,
              { row: prev, column: squareColumn }, // Only add the bottom cell
            ]);
            setIsFalling(false); // Stop falling
            clearInterval(interval);
            return prev;
          }
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isFalling]);

  const dropNewSquare = () => {
    setCurrentPosition(0); // Reset position for the new square
    setSquareColumn(4); // Reset to starting column in the middle
    // Check if new square overlaps with fixed squares
    if (fixedSquares.some(fixed => fixed.row === 0 && (fixed.column === squareColumn))) {
      alert("Game Over!"); // Game over logic if the new square overlaps
      return;
    }
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
                  (rowIndex === currentPosition && colIndex === squareColumn) || 
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
