import React, { Component } from "react";

import styled from "styled-components";

const Square = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: ${props => {
    if (props.isFlagged && props.isEven) {
      return "#c8d6e5";
    }
    if (props.isFlagged && !props.isEven) {
      return "#b6c3d1";
    }
    if (!props.isFlagged) return "#ebf0f5;";
  }};
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
    background-color: ${props => (props.isEven ? "#c8d6e5" : "#b6c3d1")};
  }

  &:hover {
    opacity: ${props => (!props.isOpened ? "0.85" : "")};
  }
`;

class Cell extends Component {
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
    if (!this.state.isFlagged) {
      this.setState({
        isOpened: true
      });
    }
    if (this.state.value === "💣") {
      this.setState({
        value: "💥"
      });
    }
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
    let value;
    this.state.value === 0 ? (value = "") : (value = this.state.value);
    return (
      <Square
        isEven={this.props.background % 2 === 0 ? true : false}
        isOpened={this.state.isOpened}
        isFlagged={this.state.isFlagged}
        onContextMenu={this.handleRightClick}
        onClick={this.handleClick}
      >
        {this.state.isFlagged ? "🚩" : value}
      </Square>
    );
  }
}

export default Cell;
