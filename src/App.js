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
  border: 2px solid #b6c3d1;
  display: flex;
  flex-wrap: wrap;
  width: ${props => props.width * 40 + "px"};
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
      return false;
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
      field: f
    };

    console.log(this.state.field);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleLeftClick = this.handleLeftClick.bind(this);
  }

  handleMouseDown() {
    this.setState({
      mood: "😰"
    });
  }

  handleMouseUp() {
    this.setState({
      mood: "🙂"
    });
  }

  handleLeftClick(cell) {
    console.log(cell);
    const opened = this.state.isOpened;
    opened.add(cell.index);
    this.setState({
      isOpened: opened
    });

    if (cell.value === "💣") {
      const f = this.state.field;
      f.data[cell.index] = "💥";
      this.setState({ mood: "😵", field: f });
    }
  }

  render() {
    this.grid = [];
    for (let i = 0; i < this.state.field.width * this.state.field.height; i++) {
      this.grid.push(
        <Cell
          key={i.toString()}
          index={i}
          value={this.state.field.data[i]}
          isOpened={this.state.isOpened.has(i)}
          onCellClick={cell => this.handleLeftClick(cell)}
        />
      );
    }

    return (
      <React.Fragment>
        <Panel>
          <Timer mood={this.state.mood} />
          <Mood>{this.state.mood}</Mood>
          <Count flagged={this.state.field.mines} />
        </Panel>
        <Wrapper
          onMouseUp={this.handleMouseUp}
          onMouseDown={this.handleMouseDown}
          width={this.state.field.width}
        >
          {this.grid}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default App;
