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
  color: ${props => {
    switch (props.value) {
      case 1:
        return "#4169e1;";
      case 2:
        return "#228b22";
      case 3:
        return "#dc143c";
      case 4:
        return "#00008b";
      case 5:
        return "#a0522d";
      case 6:
        return "#ff00ff";
      default:
        return "#000000;";
    }
  }};
  font-weight: 600;

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
      // value: this.props.value
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onCellClick({
      value: this.props.value,
      index: this.props.index,
      position: this.props.coordinates
    });
    
    console.log("Left click was clicked.");
  }

  handleRightClick(e) {
    e.preventDefault();
    if (!this.props.isOpened) {
      this.setState(state => ({
        isFlagged: !state.isFlagged
      }));
    }
    console.log("Right click was clicked.");
  }

  render() {
    let value;
    this.props.value === 0 ? (value = "") : (value = this.props.value);
    return (
      <Square
        isEven={this.props.index % 2 === 0 ? true : false}
        isOpened={this.props.isOpened}
        isFlagged={this.state.isFlagged}
        onContextMenu={this.handleRightClick}
        onClick={this.handleClick}
        value={value}
      >
        {this.state.isFlagged ? "🚩" : value}
      </Square>
    );
  }
}

export default Cell;
