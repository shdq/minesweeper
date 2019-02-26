import React, { Component } from "react";
import Cell from "./components/cellComponent";
import styled from "styled-components";

const Field = styled.span`
  border: 2px solid #b6c3d1;
  display: flex;
  flex-wrap: wrap;
  width: 360px;
`;

const mines = 10;
const size = 9;
const bomb = "💣";

class App extends Component {
  render() {
    const cells = Array(size * size).fill(0);
    let planted = mines;
    while (planted > 0) {
      for (let i = 0; i < size * size; i++) {
        if (planted > 0 && cells[i] === 0 && Math.random() <= 0.10) {
          cells[i] = bomb;
          planted--;
          // console.log({ planted });
        }
      }
    }

    const grid = cells.map((value, index) => (
      <Cell key={index.toString()} background={index} value={value} />
    ));

    return <Field>{grid}</Field>;
  }
}

export default App;
