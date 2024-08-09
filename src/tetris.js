return React.createElement(
  'div',
  { className: "tetris", tabIndex: 0, onFocus: () => dropNewSquare() },
  React.createElement('h2', null, "Simple Tetris"),
  React.createElement('h3', null, `Score: ${score}`),
  !gameOver ? (
    React.createElement(
      'div',
      { className: "game-board" },
      board.map((row, rowIndex) => {
        return React.createElement(
          'div',
          { key: rowIndex, className: "row" },
          row.map((cell, colIndex) => {
            const isActive = currentTetromino.shape.some((row, i) => row.some((cell, j) => cell && rowIndex === currentPosition + i && colIndex === squareColumn + j));
            const backgroundColor = isActive ? currentTetromino.color : (cell === 1 ? 'gray' : undefined); // Gray for landed pieces
            return React.createElement(
              'div',
              {
                key: colIndex,
                className: `cell ${isActive ? 'active' : ''}`,
                style: { backgroundColor: backgroundColor },
              },
              ''
            );
          })
        );
      })
    )
  ) : (
    React.createElement('div', null,
      React.createElement('h3', null, "Game Over!"),
      React.createElement('button', { onClick: resetGame }, "Restart Game")
    )
  )
);
