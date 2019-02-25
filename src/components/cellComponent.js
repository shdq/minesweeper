import React from "react";

import styled from "styled-components";

const Square = styled.span`
  width: 40px;
  height: 40px;
  background-color: #c8d6e5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: default;

  &:hover {
    background-color: #8395a7;
  }
`;

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlagged: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState(state => ({
      isFlagged: !state.isFlagged
    }));
    console.log("Right click was clicked.");
  }

  render() {
    return <Square onContextMenu={this.handleClick}>{ this.state.isFlagged ? "🚩" : "" }</Square>;
  }
}

export default Cell;
