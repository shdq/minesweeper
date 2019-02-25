import React, { Component } from "react";
import Cell from "./components/cellComponent";
import styled from "styled-components";

const Wrapper = styled.span`
  display: flex;
`;

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Cell value="💣" />
      </Wrapper>
    );
  }
}

export default App;
