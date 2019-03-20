import React, { Component } from "react";
import Timer from "./components/timerComponent";
import Count from "./components/countComponent";
import Cell from "./components/cellComponent";
import styled from "styled-components";
import Field from "./utility/Field";

const Panel = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 2rem;
  color: #2e5266;
`;

const Mood = styled.span`
  cursor: pointer;
`;

const Wrapper = styled.span`
  border: 1px solid #b6c3d1;
  display: flex;
  flex-wrap: wrap;
  width: ${props => props.width * 42 + "px"};
`;

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
      field: f,
      restarted: 0
    };

    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.openMines = this.openMines.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  openMines() {
    const opened = this.state.isOpened;
    for (let i = 0; i < this.state.field.width * this.state.field.height; i++) {
      if (this.state.field.data[i] === "💣" && !this.state.isFlagged.has(i))
        opened.add(i);
      // it opens cell with a flag that placed not on the mine
      if (this.state.field.data[i] !== "💣" && this.state.isFlagged.has(i))
        opened.add(i);
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
        if (!this.state.isFlagged.has(element)) opened.add(element);
      });
      this.setState({
        isOpened: opened
      });
    }

    if (
      this.state.isOpened.size ===
        this.state.field.width * this.state.field.height -
          this.state.field.mines &&
      cell.value !== "💣"
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

  restartGame() {
    const restart = this.state.restarted + 1;
    const f = new Field(9, 9, 10);
    f.init();
    this.setState({
      mood: "🙂",
      isOpened: new Set(),
      isFlagged: new Set(),
      field: f,
      restarted: restart
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
          <Timer mood={this.state.mood} restarted={this.state.restarted} />
          <Mood onClick={this.restartGame}>{this.state.mood}</Mood>
          <Count flagged={this.state.field.mines - this.state.isFlagged.size} />
        </Panel>
        <Wrapper width={this.state.field.width}>{this.grid}</Wrapper>
      </React.Fragment>
    );
  }
}

export default App;
