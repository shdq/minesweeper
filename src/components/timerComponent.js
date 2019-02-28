import React, { Component } from "react";
import styled from "styled-components";

const Clock = styled.span``;

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState(state => ({
      date: state.time++
    }));
  }

  render() {
    return <Clock>{this.state.time.toString().padStart(3, "0")}</Clock>;
  }
}

export default Timer;
