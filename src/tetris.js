// This would be stored in the 'src' folder of the GitHub repository
// tetris.js
window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const [currentPosition, setCurrentPosition] = useState(0); // Current position of the falling square
    const [isFalling, setIsFalling] = useState(true);
    const boardHeight = 20; // Height of the game board
    const boardWidth = 10; // Width of the game board
    const [droppedSquare, setDroppedSquare] = useState(null); // Store the position of the dropped square

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition((prev) => {
            // Stop the square when it reaches the bottom
            if (prev < boardHeight - 2) { // Adjust for 2x2 square
              return prev + 1;
            } else {
              setDroppedSquare(prev); // Save the position of the dropped square
              setIsFalling(false); // Stop falling
              clearInterval(interval);
              return prev; // Don't change position if it is at the bottom
            }
          });
        }
      }, 500); // Adjust speed of falling

      return () => clearInterval(interval);
    }, [isFalling]);

    const dropNewSquare = () => {
      setCurrentPosition(0); // Reset position for the new square
      setIsFalling(true); // Start falling again
    };

    useEffect(() => {
      if (!isFalling) {
        const timeout = setTimeout(() => {
          dropNewSquare(); // Drop a new square after the current one stops
        }, 1000); // Wait before dropping the next square

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
                  className: `cell ${rowIndex === currentPosition || rowIndex === currentPosition + 1 ? 'active' : ''}`,
                },
                // Render the square only if it's in the current position or if it's the dropped square
                (rowIndex === currentPosition || rowIndex === currentPosition + 1) && 
                (colIndex === droppedSquare || colIndex === droppedSquare + 1) && 
                React.createElement('div', { className: "square" })
              )
            )
          )
        )
      )
    );
  };

  return () => React.createElement(Tetris);
};

console.log('Tetris game script loaded');
