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
      return -1;
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

  closest(i, j, result = new Set(), toVisit = []) {
    const topLeft = [i - 1, j - 1];
    const top = [i - 1, j];
    const topRight = [i - 1, j + 1];
    const left = [i, j - 1];
    const right = [i, j + 1];
    const bottomLeft = [i + 1, j - 1];
    const bottom = [i + 1, j];
    const bottomRight = [i + 1, j + 1];

    result.add(i * this.width + j);

    if (this.get(...topLeft) >= 0) {
      if (this.get(...topLeft) !== 0) {
        result.add(topLeft[0] * this.width + topLeft[1]);
      } else if (!result.has(topLeft[0] * this.width + topLeft[1])) {
        toVisit.push(topLeft);
      }
    }

    if (this.get(...top) >= 0) {
      if (this.get(...top) !== 0) {
        result.add(top[0] * this.width + top[1]);
      } else if (!result.has(top[0] * this.width + top[1])) {
        toVisit.push(top);
      }
    }

    if (this.get(...topRight) >= 0) {
      if (this.get(...topRight) !== 0) {
        result.add(topRight[0] * this.width + topRight[1]);
      } else if (!result.has(topRight[0] * this.width + topRight[1])) {
        toVisit.push(topRight);
      }
    }

    if (this.get(...left) >= 0) {
      if (this.get(...left) !== 0) {
        result.add(left[0] * this.width + left[1]);
      } else if (!result.has(left[0] * this.width + left[1])) {
        toVisit.push(left);
      }
    }

    if (this.get(...right) >= 0) {
      if (this.get(...right) !== 0) {
        result.add(right[0] * this.width + right[1]);
      } else if (!result.has(right[0] * this.width + right[1])) {
        toVisit.push(right);
      }
    }

    if (this.get(...bottomLeft) >= 0) {
      if (this.get(...bottomLeft) !== 0) {
        result.add(bottomLeft[0] * this.width + bottomLeft[1]);
      } else if (!result.has(bottomLeft[0] * this.width + bottomLeft[1])) {
        toVisit.push(bottomLeft);
      }
    }

    if (this.get(...bottom) >= 0) {
      if (this.get(...bottom) !== 0) {
        result.add(bottom[0] * this.width + bottom[1]);
      } else if (!result.has(bottom[0] * this.width + bottom[1])) {
        toVisit.push(bottom);
      }
    }

    if (this.get(...bottomRight) >= 0) {
      if (this.get(...bottomRight) !== 0) {
        result.add(bottomRight[0] * this.width + bottomRight[1]);
      } else if (!result.has(bottomRight[0] * this.width + bottomRight[1])) {
        toVisit.push(bottomRight);
      }
    }
    if (toVisit.length > 0) {
      this.closest(...toVisit.pop(), result, toVisit);
    }
    return result;
  }

  init() {
    this.plant();
    this.evaluate();
  }
}

export default Field;
