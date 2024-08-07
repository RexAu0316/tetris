window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const boardHeight = 20;
    const boardWidth = 10;
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(true);
    const [squareColumn, setSquareColumn] = useState(Math.floor(boardWidth / 2) - 1); // Start in the middle
    const [fixedSquares, setFixedSquares] = useState([]);

    const dropNewSquare = () => {
      // Check for game over condition
      if (fixedSquares.some(square => square.row === 0 && square.column === squareColumn)) {
        alert("Game Over!");
        resetGame(); // You can implement this function to reset the game state
        return;
      }
      setSquareColumn(Math.floor(boardWidth / 2) - 1); // Reset to middle
      setIsFalling(true);
      setCurrentPosition(0);
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
            if (squareColumn < boardWidth - 2) { // Adjust for 2x2 square
              setSquareColumn((prev) => prev + 1);
            }
            break;
          case "ArrowDown":
            setCurrentPosition((prev) => {
              if (prev < boardHeight - 2) {
                return prev + 1;
              } else {
                setFixedSquares((prevFixed) => [
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
    }, [isFalling, squareColumn]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          setCurrentPosition((prev) => {
            if (prev < boardHeight - 2) {
              return prev + 1;
            } else {
              setFixedSquares((prevFixed) => [
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
      }, 500);

      return () => clearInterval(interval);
    }, [isFalling]);

    useEffect(() => {
      if (!isFalling) {
        const timeout = setTimeout(() => {
          dropNewSquare();
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
