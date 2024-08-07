window.initGame = (React) => {
  const { useState, useEffect } = React;

  const Tetris = () => {
    const boardHeight = 20;
    const boardWidth = 10;
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFalling, setIsFalling] = useState(true);
    const [squareColumn, setSquareColumn] = useState(4);
    const [fixedSquares, setFixedSquares] = useState([]);
    const [currentShape, setCurrentShape] = useState([]);
    const [score, setScore] = useState(0);

    const shapes = [
      [[1, 1], [1, 1]], // Square
      [[0, 1, 0], [1, 1, 1]], // T-shape
      [[1, 1, 1], [0, 0, 1]], // L-shape
      [[1, 1, 0], [0, 1, 1]], // Z-shape
    ];

    const getRandomShape = () => {
      const randomIndex = Math.floor(Math.random() * shapes.length);
      return shapes[randomIndex];
    };

    const dropNewSquare = () => {
      setSquareColumn(4);
      setIsFalling(true);
      setCurrentPosition(0);
      setCurrentShape(getRandomShape());
    };

    const rotateShape = (shape) => {
      return shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    };

    const handleKeyDown = (event) => {
      if (isFalling) {
        switch (event.key) {
          case "ArrowLeft":
            if (canMove(-1, 0)) {
              setSquareColumn((prev) => prev - 1);
            }
            break;
          case "ArrowRight":
            if (canMove(1, 0)) {
              setSquareColumn((prev) => prev + 1);
            }
            break;
          case "ArrowDown":
            moveDown();
            break;
          case "ArrowUp":
            const rotatedShape = rotateShape(currentShape);
            if (canPlace(rotatedShape, currentPosition, squareColumn)) {
              setCurrentShape(rotatedShape);
            }
            break;
          default:
            break;
        }
      }
    };

    const canMove = (deltaX, deltaY) => {
      return canPlace(currentShape, currentPosition + deltaY, squareColumn + deltaX);
    };

    const canPlace = (shape, position, column) => {
      return shape.every((row, rowIndex) => 
        row.every((value, colIndex) => {
          if (value === 0) return true; // Empty cell
          const newRow = position + rowIndex;
          const newCol = column + colIndex;
          return newRow < boardHeight && newCol >= 0 && newCol < boardWidth && 
                 !fixedSquares.some(fixed => fixed.row === newRow && fixed.column === newCol);
        })
      );
    };

    const moveDown = () => {
      setCurrentPosition((prev) => {
        if (canMove(0, 1)) {
          return prev + 1;
        } else {
          // Save the square in fixed squares
          placeSquare();
          return prev; // Keep the position the same
        }
      });
    };

    const placeSquare = () => {
      currentShape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value !== 0) {
            setFixedSquares((prevFixed) => [
              ...prevFixed,
              { row: currentPosition + rowIndex, column: squareColumn + colIndex },
            ]);
          }
        });
      });

      setScore((prevScore) => {
        const clearedRows = clearFullRows();
        return prevScore + clearedRows * 100; // Example scoring
      });

      setIsFalling(false);
    };

    const clearFullRows = () => {
      const rowsToClear = [];
      for (let row = 0; row < boardHeight; row++) {
        if (Array.from({ length: boardWidth }, (_, col) => fixedSquares.some(fixed => fixed.row === row && fixed.column === col)).every(Boolean)) {
          rowsToClear.push(row);
        }
      }
      setFixedSquares((prevFixed) => prevFixed.filter(fixed => !rowsToClear.includes(fixed.row)));
      return rowsToClear.length;
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFalling, squareColumn, currentShape]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isFalling) {
          moveDown();
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
      React.createElement('h2', null, "Tetris"),
      React.createElement('div', null, `Score: ${score}`),
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
                    (currentShape.some((shapeRow, shapeRowIdx) =>
                      shapeRow[colIndex - squareColumn] && rowIndex === currentPosition + shapeRowIdx
                    )) ||
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
