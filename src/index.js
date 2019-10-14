import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


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
        status = 'Winnner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
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

        while (numPebbles > 0) {
          if (i > 5) {
            i = 0;  // reset counter
            if (inSquareSet1) {
              troughs[0] += 1;
              inSquareSet1 = !inSquareSet1;
            } else {
              troughs[1] += 1;
              inSquareSet1 = !inSquareSet1;
            }
          } else {
            if (inSquareSet1) {
              squares1[i++] += 1;
            } else {
              squares2[i++] += 1;
            }
          }
          numPebbles -= 1;
        }
        // switch players??
        let xIsNext = this.state.xIsNext;
        if (i == 0) xIsNext = !xIsNext;
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

  function calculateWinner(squares1, squares2, troughs) {
    for (let i=0; i<6; i++) {
      if (squares1[i] != 0 || squares2[i] != 0) {
        return null;
      }
    }
    // no tie detection right now but I'm lazy
    return (troughs[0] > troughs[1]) ? troughs[0] : troughs[1];
  }