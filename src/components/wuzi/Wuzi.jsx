import React, { Component } from "react";
import "./Wuzi.css";

const checkGame = function (game) {
    const lines = [];
    let arr1 = [
        [0, 1, 2, 3, 4],
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6],
        [3, 4, 5, 6, 7],
        [4, 5, 6, 7, 8],
        [5, 6, 7, 8, 9],
    ];
    lines.push(...arr1);
    let arr1Copy = Object.assign([], arr1);
    arr1Copy.forEach((arr, index) => {
        for (let i = 0; i < 9; i++) {
            let itemNew = arr.map((val) => val + (i + 1) * 10);
            lines.push(itemNew);
        }
    });

    let arr2 = [
        [0, 10, 20, 30, 40],
        [10, 20, 30, 40, 50],
        [20, 30, 40, 50, 60],
        [30, 40, 50, 60, 70],
        [40, 50, 60, 70, 80],
        [50, 60, 70, 80, 90],
    ];
    lines.push(...arr1);
    let arr2Copy = Object.assign([], arr2);
    arr2Copy.forEach((arr, index) => {
        for (let i = 0; i < 9; i++) {
            let itemNew = arr.map((val) => val + i + 1);
            lines.push(itemNew);
        }
    });

    let arr4 = [
        [0, 11, 22, 33, 44],
        [1, 12, 23, 34, 45],
        [2, 13, 24, 35, 46],
        [3, 14, 25, 36, 47],
        [4, 15, 26, 37, 48],
        [5, 16, 27, 38, 49],
    ];
    lines.push(...arr4);
    let arr4Copy = Object.assign([], arr4);
    arr4Copy.forEach((arr, index) => {
        for (let i = 0; i < 5; i++) {
            let itemNew = arr.map((val) => val + (i + 1) * 10);
            lines.push(itemNew);
        }
    });

    let arr3 = [
        [4, 13, 22, 31, 40],
        [5, 14, 23, 32, 41],
        [6, 15, 24, 33, 42],
        [7, 16, 25, 34, 43],
        [8, 17, 26, 35, 44],
        [9, 18, 27, 36, 45],
    ];
    lines.push(...arr3);
    let arr3Copy = Object.assign([], arr3);
    arr3Copy.forEach((arr) => {
        for (let i = 0; i < 5; i++) {
            let itemNew = arr.map((val) => val + (i + 1) * 10);
            lines.push(itemNew);
        }
    });

    for (let i = 0; i < lines.length; i++) {
        let [index_1, index_2, index_3, index_4, index_5] = lines[i];
        if (
            game[index_1] !== null &&
            game[index_2] === game[index_1] &&
            game[index_1] === game[index_3] &&
            game[index_1] === game[index_4] &&
            game[index_1] === game[index_5]
        ) {
            return {
                winnerName: game[index_1],
                winIndex: [index_1, index_2, index_3, index_4, index_5],
            };
        }
    }
    return false;
};

class History extends Component {
    render() {
        const { xIsNext, winner, history, jump } = this.props;
        let title = "";
        let button = "";
        if (winner) {
            title = `Winner is ${winner.winnerName}`;
            for (let i of winner.winIndex) {
                document.getElementsByClassName("square")[i].style =
                    "background: lightblue; color: #fff;";
            }
        } else {
            if (xIsNext) {
                title = `Next Player is "X"`;
            } else {
                title = `Next Player is "O"`;
            }
        }
        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => jump(move)} className="button">
                        {desc}
                    </button>
                </li>
            );
        });

        return (
            <div className="history">
                <h3>{title}</h3>
                <li>
                    <button type="button" className="button-one" onClick={() => jump(0)}>
                        重新开始
                    </button>
                </li>
                <hr />
                <div className="list">
                    <ol className="oltype">{moves}</ol>
                </div>
            </div>
        );
    }
}

class Square extends Component {
    render() {
        return (
            <div className="square" onClick={this.props.handleClick}>
                {this.props.index}
            </div>
        );
    }
}

class Board extends Component {
    getSquare = (i) => {
        const { game, handleClick } = this.props;
        return <Square key={i} index={game[i]} handleClick={() => handleClick(i)}></Square>;
    };

    renderSquare = () => {
        let squaresBtn = [];
        for (let i = 0; i < 100; i++) {
            squaresBtn.push(this.getSquare(i));
        }
        return squaresBtn;
    };

    render() {
        return <div className="box-wrap">{this.renderSquare()}</div>;
    }
}

class Game extends Component {
    constructor() {
        super();
        this.state = {
            //game: Array(9).fill(null),
            history: [Array(100).fill(null)],
            xIsNext: true,
            nowStep: 0,
        };
    }

    handleClick = (i) => {
        const { xIsNext, nowStep } = this.state;

        let { history } = this.state;
        history = history.slice(0, nowStep + 1);

        let game = history[nowStep].slice();
        if (checkGame(game)) {
            return;
        }
        if (game[i]) {
            return;
        }
        if (xIsNext) {
            game[i] = "X";
        } else {
            game[i] = "O";
        }

        this.setState({
            history: history.concat([game]),
            xIsNext: !xIsNext,
            nowStep: nowStep + 1,
        });
    };
    jump = (i) => {
        var xIsNext = i % 2 === 0 ? true : false;
        var nowStep = i;
        for (let i = 0; i < 100; i++) {
            document.getElementsByClassName("square")[i].style = "";
        }
        this.setState({
            xIsNext: xIsNext,
            nowStep: nowStep,
        });
    };
    render() {
        const { history, xIsNext, nowStep } = this.state;
        const game = history[nowStep];
        return (
            <div className="game">
                <Board
                    game={game}
                    handleClick={(index) => this.handleClick(index)}
                ></Board>
                <History
                    jump={(i) => this.jump(i)}
                    history={history}
                    xIsNext={xIsNext}
                    winner={checkGame(game)}
                ></History>
            </div>
        );
    }
}

export default Game;
