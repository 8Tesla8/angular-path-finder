export class PathFinder {
  constructor() {
    let data = [
      ["=", "O", "=", "=", "=", "="], // 0
      [" ", " ", " ", " ", " ", " "], // 1
      [" ", "=", " ", "=", " ", "="], // 2
      ["X", " ", " ", " ", " ", " "], // 3
      [" ", "=", "=", " ", "=", " "], // 4
      [" ", " ", "=", "=", "=", " "], // 5
      ["=", " ", "=", " ", "=", " "], // 6
      ["=", " ", " ", " ", " ", " "], // 7
    ];

    let field = new Field(data, 6, 8);

    this.findPath(field, "X", "O");
  }

  //obsticles: string[], notobsticles: string[]
  public findPath(field: Field, startSymbol: string, endSymbol: string) {
    let startEndCoordinates = this.findStartEndCoordinate(
      field,
      startSymbol,
      endSymbol
    );

    let start = startEndCoordinates.start;
    let end = startEndCoordinates.end;

    let pathes: PathResult[] = [];

    let startWaysCoord = this.whereCanGo(field, start);

    //create possible routes
    startWaysCoord.forEach(coord => {
      let path = new PathResult();
      path.moveCount++;
      path.coordinates.push(coord);

      pathes.push(path);
    });

    if (pathes.length === 0) {
      //end
      debugger;
      return;
    }

    let pathIndex = 0;
    let path = pathes[pathIndex];

    while (path != null) {
      if (path.success === false || path.success === true) {
        pathIndex++;
        if (pathIndex < pathes.length) {
          path = pathes[pathIndex];
        } else {
          path = null;
        }

        continue;
      }

      var possibleWays = this.whereCanGo(field, path.getLastCoordinate());

      if (possibleWays.length === 0) {
        path.success = false;

        pathIndex++;
        if (pathIndex < pathes.length) {
          path = pathes[pathIndex];
        } else {
          path = null;
        }

        continue;
      }

      //create possible routes func
      let coordForNewPath = false;
      let haveOptions = false;

      possibleWays.forEach(coord => {
        if (path.isCoordinateNew(coord)) {
          haveOptions = true;

          if (!coordForNewPath) {
            path.coordinates.push(coord);
            path.moveCount++;

            coordForNewPath = true;
            if (this.foundEnd(coord, end)) {
              path.success = true;
            }

          } else {
            //new path
            let newPath = new PathResult();
            newPath.moveCount = path.moveCount;
            newPath.coordinates = path.getCoordinatesCopy();
            newPath.coordinates.push(coord);

            pathes.push(newPath);

            if (this.foundEnd(coord, end)) {
              newPath.success = true;
            }
          }
        }
      });

      if (!haveOptions) {
        //debugger;

        path.success = false;

        pathIndex++;
        if (pathIndex < pathes.length) {
          path = pathes[pathIndex];
        } else {
          path = null;
        }
      }
    }


    debugger;
  }

  private findStartEndCoordinate(
    field: Field,
    startSymbol: string,
    endSymbol: string
  ) {
    let pathStart = null;
    let pathEnd = null;

    let stop = false;
    for (let row = 0; row < field.maxRow() && !stop; row++) {
      for (let column = 0; column < field.maxColumn() && !stop; column++) {
        const element = field.getValue(row, column);

        if (element === startSymbol) {
          pathStart = {
            row: row,
            column: column
          } as Coordinates;
        } else if (element === endSymbol) {
          pathEnd = {
            row: row,
            column: column
          } as Coordinates;
        }

        if (pathStart && pathEnd) {
          stop = true;
        }
      }
    }

    return {
      start: pathStart,
      end: pathEnd
    };
  }

  private whereCanGo(field: Field, coord: Coordinates): Coordinates[] {
    let coordinates = [];

    if (
      coord.column - 1 >= field.minColumn() &&
      this.checkCoord(field, coord.row, coord.column - 1) 
    ) {
        coordinates.push({
          column: coord.column - 1,
          row: coord.row
        });
    }

    if (
      coord.column + 1 < field.maxColumn() &&
      this.checkCoord(field, coord.row, coord.column + 1)
    ) {
      coordinates.push({
        column: coord.column + 1,
        row: coord.row
      });
    }

    if (
      coord.row - 1 >= field.minRow() &&
      this.checkCoord(field, coord.row - 1, coord.column) 
    ) {
      coordinates.push({
        column: coord.column,
        row: coord.row - 1
      });
    }

    if (
      coord.row + 1 < field.maxRow() &&
      this.checkCoord(field, coord.row + 1, coord.column)
    ) {
      coordinates.push({
        column: coord.column,
        row: coord.row + 1
      });
    }

    return coordinates;
  }

  private checkCoord(field: Field, row: number, column: number): boolean {
    if (
      field.getValue(row, column) === " " ||
      field.getValue(row, column) === "O"
    ) {
      return true;
    }

    return false;
  }

  private foundEnd(coord: Coordinates, endCoord: Coordinates): boolean {
    if (coord.column === endCoord.column && coord.row === endCoord.row) {
      return true;
    }

    return false;
  }

}

export class Field {
  private _column: number;
  private _row: number;

  constructor(data: string[][], column: number, row: number) {
    this.data = data;
    this._column = column;
    this._row = row;
  }

  public data: string[][];

  public getValue(row: number, column: number) {
    return this.data[row][column];
  }

  public maxRow(): number {
    return this.data.length;
  }

  public minRow() {
    return 0;
  }

  public minColumn() {
    return 0;
  }

  public maxColumn() {
    return this.data[0].length;
  }

}

export class PathResult {
  public moveCount: number;
  public coordinates: Coordinates[];
  public success: boolean | null;

  constructor() {
    this.moveCount = 0;
    this.coordinates = [];
    this.success = null;
  }

  public getLastCoordinate(): Coordinates {
    return this.coordinates[this.coordinates.length - 1];
  }

  public getCoordinatesCopy(): Coordinates[] {
    let copy = [];

    for (let index = 0; index < this.coordinates.length; index++) {
      copy.push({
        column: this.coordinates[index].column,
        row: this.coordinates[index].row
      });
    }

    return copy;
  }

  public isCoordinateNew(coord: Coordinates): boolean {
    // for (int i = max - 1; i >= 0; i--)
    // {
    // }


    for (let index = 0; index < this.coordinates.length; index++) {
      const element = this.coordinates[index];
      if (element.column === coord.column && element.row === coord.row) {
        return false;
      }
    }
    return true;
  }
}

export class Coordinates {
  public column: number;
  public row: number;
}
