import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavBar from './toolBar';


let difficulty = 5;

function Square(props) {
    return (
        <button
        className="square"
        onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Trough(props) {
  return (
    <rect
    className="trough"
    >
      {props.value}
    </rect>
  )
}

  class Board extends React.Component {
    renderBoard() {
      return (<Board/>)
    }

    renderSquare(set, i) {
      if (set) {
        return (
          <Square
          value={this.props.squares1[i]}
          onClick={() => this.props.onClick(1, i)}
          />
        );
      } else {
        return (
          <Square
          value={this.props.squares2[i]}
          onClick={() => this.props.onClick(0, i)}
          />
        );
      }
    }

    renderTrough(i) {
      return (
        <Trough
        value={this.props.troughs[i]}
        />
      )
    }
  
    render() {
      return (
        <div>
            <div className="board">
              {this.renderBoard}
              <div className="board-row">
              {this.renderTrough(0)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 0)}
              {this.renderSquare(1, 5)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 1)}
              {this.renderSquare(1, 4)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 2)}
              {this.renderSquare(1, 3)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 3)}
              {this.renderSquare(1, 2)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 4)}
              {this.renderSquare(1, 1)}
            </div>
            <div className="board-row">
              {this.renderSquare(0, 5)}
              {this.renderSquare(1, 0)}
            </div>
            <div className="board-row">
              {this.renderTrough(1)}
            </div>
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                troughs:  Array(2).fill(0),
                squares1: Array(6).fill(4),
                squares2: Array(6).fill(4),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(
        current.squares1,
        current.squares2,
        current.troughs
      );

      if (!current.xIsNext) {
        let i = bestMove(current.squares1, current.squares2);
        setTimeout(() => {
          this.handleClick(1, i);
        }, 5000);
      }

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
      return (
        <div>
          <div style={{align: -1 + 'em'}}>
            <NavBar/>
          </div>
          <div className="game">
            <div className="game-board">
              <Board
              squares1={current.squares1}
              squares2={current.squares2}
              troughs={current.troughs}
              onClick={(set, i) => this.handleClick(set, i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      );
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    handleClick(inSquareSet1, i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares1 = current.squares1.slice();
        const squares2 = current.squares2.slice();
        const troughs = current.troughs.slice();
        if (calculateWinner(squares1, squares2, troughs))
            return;
        if (!this.state.xIsNext && squares1[i] == 0)
            return;
        if (this.state.xIsNext && inSquareSet1)
            return;
        if (!this.state.xIsNext && !inSquareSet1)
            return;

        let numPebbles;
        if (inSquareSet1) {
          numPebbles = squares1[i];
          squares1[i++] = 0;
        } else {
          numPebbles = squares2[i];
          squares2[i++] = 0;
        }

        let lastTrough = 0;
        while (numPebbles > 1) {
          if (i > 5) {
            i = 0;  // reset counter
            if (inSquareSet1) {
              if (!this.state.xIsNext) {
                troughs[0] += 1;
                numPebbles -= 1;
              }
              inSquareSet1 = !inSquareSet1;
              lastTrough = 0;
            } else {
              if (this.state.xIsNext) {
                troughs[1] += 1;
                numPebbles -= 1;
              }
              inSquareSet1 = !inSquareSet1;
              lastTrough = 1;
            }
          } else {
            if (inSquareSet1) {
              squares1[i++] += 1;
            } else {
              squares2[i++] += 1;
            }
            numPebbles -= 1;
          }
        }
        if (i === 6 && this.state.xIsNext && !inSquareSet1) {
          troughs[1] += 1;
        } else if (i === 6 && !this.state.xIsNext && inSquareSet1) {
            troughs[0] += 1;
        } else {
          if (!inSquareSet1 && this.state.xIsNext && squares2[i] === 0) {
            // player gets all of the pebbles in adjacent square
            squares2[i] = 0;
            troughs[1] += 1+squares1[5-i];
            squares1[5-i] = 0;
          } else if (inSquareSet1 && !this.state.xIsNext && squares1[i] === 0) {
            squares1[i] = 0;
            troughs[0] += 1+squares2[5-i];
            squares2[5-i] = 0;
          } else if (inSquareSet1) {
            squares1[i] += 1;
          } else {
            squares2[i] += 1;
          }
        }
        i = i % 6;
        // switch players??
        let xIsNext = this.state.xIsNext;
        if (i === 0) xIsNext = !xIsNext;
        this.setState({
            history: history.concat([{
                squares1: squares1,
                squares2: squares2,
                troughs: troughs,
            }]),
            stepNumber: history.length,
            xIsNext: !xIsNext,
        });
    }
  }

  // ========================================

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function detectPlayerDone(squares) {
    for (let i=0; i<squares.length; i++)
      if (squares[i] !== 0)
        return false;
    return true;
  }

  function calculateWinner(squares1, squares2, troughs) {
    if (troughs[0] + troughs[1] == 48)
      return (troughs[0] > troughs[1]) ? 'O' : 'X';
    if (detectPlayerDone(squares1)) {
      for (let i=0; i<squares2.length; i++) {
        troughs[0] += squares2[i];
        squares2[i] = 0;
      }
      return (troughs[0] > troughs[1]) ? 'O' : 'X';
    }
    if (detectPlayerDone(squares2)) {
      for (let i=0; i<squares1.length; i++) {
        troughs[0] += squares1[i];
        squares1[i] = 0;
      }
      return (troughs[0] > troughs[1]) ? 'O' : 'X';
    }
    return null;
  }

function bestMove(squares1, squares2) {
    return miniMax(squares1, squares2, false, 0, 0, -1)[1];
}

function miniMax(squares1, squares2, playerTurn, depth, score) {
    if (depth == difficulty)  // base case
      return [score, 0];

    let winner = calculateWinner(squares1, squares2, [0,0]);
    if (winner === 'X' && playerTurn) {
      return [-Infinity, pit];
    } else if (winner === 'O' && !playerTurn) {
      return [Infinity, pit];
    } else if (winner === 'X' && !playerTurn) {
      return [-Infinity, pit];
    } else if (winner === 'O' && playerTurn) {
      return [Infinity, pit];
    }

    let bestScore, move = 0;
    if (playerTurn) {
      bestScore = Infinity;
      for (let i=0; i<6; i++) {
        let tmpScore = score;
        let tSquares1 = squares1.slice(), tSquares2 = squares2.slice();
        // test using each pit
        if (squares1[i] == 0)
          continue;
        let j = i;
        while (tSquares1[i] > 1) {
          j = (j+1)%13;
          if (j<6) {
            tSquares1[j]++;
          } else if (j===6) {
            tmpScore--;
          } else {
            tSquares2[j-7]++;
          }
          tSquares1[i]--;
        }
        j = (j+1)%13;
        let result;
        if (j < 6) {
          if (tSquares1[j] === 0) {
            tmpScore -= tSquares2[5-j] + 1;
            tSquares2[5-j] = 0;
          } else {
            tSquares1[j]++;
          }
          result = miniMax(tSquares1, tSquares2, !playerTurn, depth+1, tmpScore);
        } else if (j === 6) {
          result = miniMax(tSquares1, tSquares2, playerTurn, depth+1, tmpScore-1);
        } else {
          tSquares2[j-7] += 1;
          result = miniMax(tSquares1, tSquares2, !playerTurn, depth+1, tmpScore);
        }
        if (result[0] < bestScore) {
          bestScore = result[0];
          move = result[1];
        }
      }
    } else {
      bestScore = -Infinity;
      for (let i=0; i<6; i++) {
        let tmpScore = score;
        let tSquares1 = squares1.slice(), tSquares2 = squares2.slice();
        if (squares2[i] == 0)
          continue;
        let j = i;
        while (tSquares2[i] > 1) {
          j = (j+1)%13;
          if (j<6) {
            tSquares2[j]++;
          } else if (j===6) {
            tmpScore++;
          } else {
            tSquares1[j-7]++;
          }
          tSquares2[i]--;
        }
        j = (j+1)%13;
        let result;
        if (j < 6) {
          if (tSquares2[j] === 0) {
            tmpScore += tSquares1[5-j] + 1;
            tSquares1[5-j] = 0;
          } else {
            tSquares2[j]++;
          }
          result = miniMax(tSquares1, tSquares2, !playerTurn, depth+1, tmpScore);
        } else if (j === 6) {
          result = miniMax(tSquares1, tSquares2, playerTurn, depth+1, tmpScore+1);
        } else {
          tSquares1[j-7] += 1;
          result = miniMax(tSquares1, tSquares2, !playerTurn, depth+1, tmpScore);
        }
        if (result[0] > bestScore) {
          bestScore = result[0];
          move = result[1];
        }
      }
    }
    return [bestScore, move];
}