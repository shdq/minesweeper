import React, { Component } from "react";
import Timer from "./components/timerComponent";
import Count from "./components/countComponent";
import Cell from "./components/cellComponent";
import styled from "styled-components";

const Panel = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 2rem;
  color: #2e5266;
`;

const Mood = styled.span``;

const Wrapper = styled.span`
  border: 1px solid #b6c3d1;
  display: flex;
  flex-wrap: wrap;
  width: ${props => props.width * 42 + "px"};
`;

class Field {
  constructor(width = 9, height = 9, mines = 10) {
    this.name = "Field";
    this.bomb = "💣";
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.data = Array(this.width * this.height).fill(0);
  }

  width() {
    return this.width;
  }

  height() {
    return this.height;
  }

  mines() {
    return this.mines;
  }

  get(i, j) {
    if (i > this.height - 1 || j > this.width - 1 || i < 0 || j < 0) {
      // out of range
      return -1;
    }
    return this.data[i * this.width + j];
  }

  plant() {
    let planted = this.mines;
    while (planted > 0) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (
            planted > 0 &&
            this.data[i * this.width + j] === 0 &&
            Math.random() <= 0.1
          ) {
            this.data[i * this.width + j] = this.bomb;
            planted--;
          }
        }
      }
    }
  }

  evaluate() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let value = 0;
        if (this.get(i, j) === this.bomb) continue;

        // top left
        if (this.get(i - 1, j - 1) === this.bomb) value++;
        // top
        if (this.get(i - 1, j) === this.bomb) value++;
        // top right
        if (this.get(i - 1, j + 1) === this.bomb) value++;
        // left
        if (this.get(i, j - 1) === this.bomb) value++;
        // right
        if (this.get(i, j + 1) === this.bomb) value++;
        // bottom left
        if (this.get(i + 1, j - 1) === this.bomb) value++;
        // bottom
        if (this.get(i + 1, j) === this.bomb) value++;
        // bottom right
        if (this.get(i + 1, j + 1) === this.bomb) value++;

        this.data[i * this.width + j] = value;
      }
    }
  }

  closest(i, j, result = new Set(), toVisit = []) {
    const topLeft = [i - 1, j - 1];
    const top = [i - 1, j];
    const topRight = [i - 1, j + 1];
    const left = [i, j - 1];
    const right = [i, j + 1];
    const bottomLeft = [i + 1, j - 1];
    const bottom = [i + 1, j];
    const bottomRight = [i + 1, j + 1];

    result.add(i * this.width + j);

    if (this.get(...topLeft) >= 0) {
      if (this.get(...topLeft) !== 0) {
        result.add(topLeft[0] * this.width + topLeft[1]);
      } else if (!result.has(topLeft[0] * this.width + topLeft[1])) {
        toVisit.push(topLeft);
      }
    }

    if (this.get(...top) >= 0) {
      if (this.get(...top) !== 0) {
        result.add(top[0] * this.width + top[1]);
      } else if (!result.has(top[0] * this.width + top[1])) {
        toVisit.push(top);
      }
    }

    if (this.get(...topRight) >= 0) {
      if (this.get(...topRight) !== 0) {
        result.add(topRight[0] * this.width + topRight[1]);
      } else if (!result.has(topRight[0] * this.width + topRight[1])) {
        toVisit.push(topRight);
      }
    }

    if (this.get(...left) >= 0) {
      if (this.get(...left) !== 0) {
        result.add(left[0] * this.width + left[1]);
      } else if (!result.has(left[0] * this.width + left[1])) {
        toVisit.push(left);
      }
    }

    if (this.get(...right) >= 0) {
      if (this.get(...right) !== 0) {
        result.add(right[0] * this.width + right[1]);
      } else if (!result.has(right[0] * this.width + right[1])) {
        toVisit.push(right);
      }
    }

    if (this.get(...bottomLeft) >= 0) {
      if (this.get(...bottomLeft) !== 0) {
        result.add(bottomLeft[0] * this.width + bottomLeft[1]);
      } else if (!result.has(bottomLeft[0] * this.width + bottomLeft[1])) {
        toVisit.push(bottomLeft);
      }
    }

    if (this.get(...bottom) >= 0) {
      if (this.get(...bottom) !== 0) {
        result.add(bottom[0] * this.width + bottom[1]);
      } else if (!result.has(bottom[0] * this.width + bottom[1])) {
        toVisit.push(bottom);
      }
    }

    if (this.get(...bottomRight) >= 0) {
      if (this.get(...bottomRight) !== 0) {
        result.add(bottomRight[0] * this.width + bottomRight[1]);
      } else if (!result.has(bottomRight[0] * this.width + bottomRight[1])) {
        toVisit.push(bottomRight);
      }
    }
    if (toVisit.length > 0) {
      this.closest(...toVisit.pop(), result, toVisit);
    }
    return result;
  }

  init() {
    this.plant();
    this.evaluate();
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    /*
      easy:   9x9, 10 mines
      medium: 16x16, 40 mines
      hard:   30x12, 99 mines
    */

    /* initialize the game */
    const f = new Field(9, 9, 10);
    f.init();
    this.state = {
      mood: "🙂", // 🙂😨😎😵
      isOpened: new Set(),
      isFlagged: new Set(),
      field: f
    };

    console.log(this.state.field);

    // this.handleMouseDown = this.handleMouseDown.bind(this);
    // this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.openMines = this.openMines.bind(this);
  }

  // handleMouseDown() {
  //   if (this.state.mood === "😎" || this.state.mood === "😵") {
  //     return;
  //   }
  //   this.setState({
  //     mood: "😰"
  //   });
  // }

  // handleMouseUp() {
  //   if (this.state.mood === "😎" || this.state.mood === "😵") {
  //     return;
  //   }
  //   this.setState({
  //     mood: "🙂"
  //   });
  // }

  openMines() {
    const opened = this.state.isOpened;
    for (let i = 0; i < this.state.field.width * this.state.field.height; i++) {
      if (this.state.field.data[i] === "💣" && !this.state.isFlagged.has(i)) opened.add(i);
    }
    return opened;
  }

  handleLeftClick(cell) {
    // won or lost disables clicks
    if (this.state.mood !== "🙂") {
      return;
    }

    if (this.state.isFlagged.has(cell.index)) {
      return;
    }

    console.log(cell);
    const opened = this.state.isOpened;
    opened.add(cell.index);
    this.setState({
      isOpened: opened
    });

    if (cell.value === "💣" && this.state.mood !== "😎") {
      const f = this.state.field;
      f.data[cell.index] = "💥";

      this.setState({ mood: "😵", field: f, isOpened: this.openMines() });
    }

    if (cell.value === 0) {
      const opened = this.state.isOpened;
      const closest = this.state.field.closest(
        cell.position.i,
        cell.position.j
      );
      closest.forEach(element => {
        opened.add(element);
      });
      this.setState({
        isOpened: opened
      });
    }

    if (
      this.state.isOpened.size ===
      this.state.field.width * this.state.field.height - this.state.field.mines
    ) {
      this.setState({
        mood: "😎"
      });
    }
  }

  handleRightClick(cell) {
    // won or lost disables clicks
    if (this.state.mood !== "🙂") {
      return;
    }

    if (this.state.isOpened.has(cell.index)) {
      return;
    }

    console.log(cell);
    const flagged = this.state.isFlagged;
    if (flagged.has(cell.index)) {
      flagged.delete(cell.index);
    } else {
      flagged.add(cell.index);
    }

    this.setState({
      isFlagged: flagged
    });
  }

  render() {
    this.grid = [];
    for (let i = 0; i < this.state.field.height; i++) {
      for (let j = 0; j < this.state.field.width; j++) {
        const index = i * this.state.field.width + j;
        this.grid.push(
          <Cell
            key={index.toString()}
            index={index}
            coordinates={{ i: i, j: j }}
            value={this.state.field.data[index]}
            isOpened={this.state.isOpened.has(index)}
            isFlagged={this.state.isFlagged.has(index)}
            onCellClick={cell => this.handleLeftClick(cell)}
            onRightClick={cell => this.handleRightClick(cell)}
          />
        );
      }
    }

    return (
      <React.Fragment>
        <Panel>
          <Timer mood={this.state.mood} />
          <Mood>{this.state.mood}</Mood>
          <Count flagged={this.state.field.mines - this.state.isFlagged.size} />
        </Panel>
        <Wrapper
          // onMouseUp={this.handleMouseUp}
          // onMouseDown={this.handleMouseDown}
          width={this.state.field.width}
        >
          {this.grid}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default App;
