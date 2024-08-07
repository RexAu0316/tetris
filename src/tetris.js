// This would be stored in the 'src' folder of the GitHub repository
// tetris.js
window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const [positions, setPositions] = useState([]); // Array to hold the positions of dropped squares
    const [currentPosition, setCurrentPosition] = useState(0); // Current position of the falling square
    const [isFalling, setIsFalling] = useState(true);
    const boardHeight = 20; // Height of the game board
    const boardWidth = 10; // Width of the game board

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition((prev) => {
            // Stop the square when it reaches the bottom
            if (prev < boardHeight - 1) {
              return prev + 1;
            } else {
              setPositions((prevPositions) => [...prevPositions, prev]); // Save the position of the dropped square
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
                  className: `cell ${rowIndex === currentPosition ? 'active' : ''}`,
                },
                // Render the square if it is in the current position or already dropped
                (rowIndex === currentPosition || positions.includes(rowIndex)) && 
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
