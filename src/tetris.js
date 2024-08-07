// This would be stored in the 'src' folder of the GitHub repository
// tetris.js
window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const [position, setPosition] = useState(0);
    const boardHeight = 15; // Height of the game board
    const boardWidth = 10; // Width of the game board

    useEffect(() => {
      const interval = setInterval(() => {
        setPosition((prev) => {
          // Stop the square when it reaches the bottom
          if (prev < boardHeight - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev; // Don't change position if it is at the bottom
          }
        });
      }, 500); // Adjust speed of falling

      return () => clearInterval(interval);
    }, []);

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
                  className: `cell ${rowIndex === position ? 'active' : ''}`,
                },
                rowIndex === position && React.createElement('div', { className: "square" })
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
