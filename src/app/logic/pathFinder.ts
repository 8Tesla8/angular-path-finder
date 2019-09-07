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
    for (let column = 0; column < field.maxColumn() && !stop; column++) {
      for (let row = 0; row < field.maxRow() && !stop; row++) {
        const element = field.getValue(column, row);

        if (element === startSymbol) {
          pathStart = {
            column: column,
            row: row
          } as Coordinates;
        } else if (element === endSymbol) {
          pathEnd = {
            column: column,
            row: row
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

    //top
    if (
      coord.column - 1 >= field.minColumn() &&
      this.checkCoord(field, coord.column - 1, coord.row) 
    ) {
        coordinates.push({
          column: coord.column - 1,
          row: coord.row
        });
    }

    //down
    if (
      coord.column + 1 < field.maxColumn() &&
      this.checkCoord(field, coord.column + 1, coord.row)
    ) {
      coordinates.push({
        column: coord.column + 1,
        row: coord.row
      });
    }

    //left
    if (
      coord.row - 1 >= field.minRow() &&
      this.checkCoord(field, coord.column, coord.row - 1) 
    ) {
      coordinates.push({
        column: coord.column,
        row: coord.row - 1
      });
    }

    //right
    if (
      coord.row + 1 < field.maxRow() &&
      this.checkCoord(field, coord.column, coord.row + 1)
    ) {
      coordinates.push({
        column: coord.column,
        row: coord.row + 1
      });
    }

    return coordinates;
  }

  private checkCoord(field: Field, column: number, row: number): boolean {
    if (
      field.getValue(column, row) === " " ||
      field.getValue(column, row) === "O"
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

  public getValue(column: number, row: number) {
    return this.data[column][row];
  }

  public maxColumn(): number {
    return this.data.length;
  }

  public minColumn() {
    return 0;
  }

  public maxRow() {
    return this.data[0].length;
  }

  public minRow() {
    return 0;
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
