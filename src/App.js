import React, { Component } from "react";
import Cell from "./components/cellComponent";
import styled from "styled-components";

const Wrapper = styled.span`
  border: 2px solid #b6c3d1;
  display: flex;
  flex-wrap: wrap;
  width: 360px;
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
  render() {
    const field = new Field(9, 9, 10);
    field.init();
    console.log(field);

    const grid = [];
    for (let i = 0; i < field.width * field.height; i++) {
      grid.push(
        <Cell key={i.toString()} background={i} value={field.data[i]} />
      );
    }

    return <Wrapper>{grid}</Wrapper>;
  }
}

export default App;
