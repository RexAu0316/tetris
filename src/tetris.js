// tetris.js
window.initGame = (React) => {
  const { useState, useEffect, useCallback } = React;

  const TetrisGame = () => {
    const [position, setPosition] = useState({ x: 4, y: 0 }); // Start in the middle at the top
    const [isGameOver, setIsGameOver] = useState(false);

    const boardWidth = 10;
    const boardHeight = 20;

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (isGameOver) return;
        switch (event.key) {
          case 'ArrowLeft':
            if (position.x > 0) {
              setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
            }
            break;
          case 'ArrowRight':
            if (position.x < boardWidth - 1) {
              setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
            }
            break;
          case 'ArrowDown':
            if (position.y < boardHeight - 1) {
              setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
            }
            break;
          case 'ArrowUp':
            // Up arrow doesn't do anything in this simplified version
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [position, isGameOver]);

    useEffect(() => {
      const dropInterval = setInterval(() => {
        if (!isGameOver) {
          setPosition((prev) => {
            if (prev.y < boardHeight - 1) {
              return { ...prev, y: prev.y + 1 };
            } else {
              setIsGameOver(true);
              clearInterval(dropInterval);
              return prev;
            }
          });
        }
      }, 1000); // Drop every second

      return () => clearInterval(dropInterval);
    }, [isGameOver]);

    return React.createElement(
      'div',
      { className: 'tetris-game' },
      React.createElement('h2', null, 'Simplified Tetris'),
      React.createElement('div', { className: 'game-board' },
        Array.from({ length: boardHeight }).map((_, rowIndex) => (
          React.createElement('div', {
            key: rowIndex,
            className: 'row',
          },
            Array.from({ length: boardWidth }).map((_, colIndex) => (
              React.createElement('div', {
                key: colIndex,
                className: `cell ${position.x === colIndex && position.y === rowIndex ? 'active' : ''}`
              })
            ))
          ))
        ))
      ),
      isGameOver && React.createElement('h3', null, 'Game Over!')
    );
  };

  return () => React.createElement(TetrisGame);
};

console.log('Simplified Tetris game script loaded');
