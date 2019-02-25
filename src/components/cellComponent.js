import React from "react";

import styled from "styled-components";

const Square = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: ${props => (props.isFlagged ? "#c8d6e5" : "#8395a7")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: default;

  &:before {
    position: absolute;
    top: 0px;
    left: 0px;
    content: "";
    width: ${props => (props.isOpened || props.isFlagged ? "0px" : "40px")};
    height: ${props => (props.isOpened || props.isFlagged ? "0px" : "40px")};
    ${props => (props.isFlagged ? "" : "background-color: #c8d6e5")};
  }

  &:hover:before {
    background-color: ${props => (!props.isFlagged ? "#8395a7" : "#c8d6e5")};
  }
`;

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlagged: false,
      isOpened: false,
      value: this.props.value
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      isOpened: !this.state.isFlagged
    });
    console.log("Left click was clicked.");
  }

  handleRightClick(e) {
    e.preventDefault();
    if (!this.state.isOpened) {
      this.setState(state => ({
        isFlagged: !state.isFlagged
      }));
    }
    console.log("Right click was clicked.");
  }

  render() {
    return (
      <Square
        isOpened={this.state.isOpened}
        isFlagged={this.state.isFlagged}
        onContextMenu={this.handleRightClick}
        onClick={this.handleClick}
      >
        {this.state.isFlagged ? "🚩" : this.state.value}
      </Square>
    );
  }
}

export default Cell;
