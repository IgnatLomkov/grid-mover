import {
  EPlaneBlockType,
  PlaneRowBlock
} from '../plane/components/row/components/block'
import { IPlaneRowBlockCoordinates } from '.'

//NOTE: modified A-star path-finding algorithm (it mightn't be the best solution here,
//but I think it isn't matter for the test task)
export function getCharacterPath(
  planeRowsBlocks: PlaneRowBlock[][],
  start: IPlaneRowBlockCoordinates,
  end: IPlaneRowBlockCoordinates
) {
  const queue: IPathQueueItemType[] = []
  const path: number[][] = []
  const parent: (INode | null)[][] = []

  for (let row = 0; row < planeRowsBlocks.length; row++) {
    const planeRowBlocks = planeRowsBlocks[row]
    path[row] = []
    parent[row] = []

    for (let column = 0; column < planeRowBlocks.length; column++) {
      if (planeRowBlocks[column].type === EPlaneBlockType.Obstacle) continue
      if (start.row === row && start.column === column) {
        queue.unshift({
          node: {
            row,
            column,
            object: planeRowBlocks[column]
          },
          distance: Math.sqrt(start.row ** 2 + start.column ** 2)
        })
        path[row][column] = 0
      } else {
        const maxDistance =
          Math.max(planeRowsBlocks.length, planeRowBlocks.length) ** 3
        queue.push({
          node: {
            row,
            column,
            object: planeRowBlocks[column]
          },
          distance: maxDistance
        })
        path[row][column] = maxDistance
      }

      parent[row][column] = null
    }
  }

  while (queue.length > 0) {
    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const queueItem = queue.shift()!

    if (
      queueItem.node.row === end.row &&
      queueItem.node.column === end.column
    ) {
      const objects: PlaneRowBlock[] = []

      let curretNode = queueItem.node
      while (parent[curretNode.row][curretNode.column] !== null) {
        objects.unshift(curretNode.object)
        curretNode = <INode>parent[curretNode.row][curretNode.column]
      }

      return objects
    } else {
      const neighbors = getEmptyNeighborsNodes(queueItem.node, planeRowsBlocks)
      const pathToItem = path[queueItem.node.row][queueItem.node.column]
      for (const neighbor of neighbors) {
        let pathToNode = path[neighbor.row][neighbor.column]
        if (pathToItem + 1 < pathToNode) {
          pathToNode = pathToItem + 1
          path[neighbor.row][neighbor.column] = pathToNode
          parent[neighbor.row][neighbor.column] = queueItem.node
          const queuePosition = getItemPositionmInQueue(neighbor, queue)
          if (queuePosition !== null)
            queue[queuePosition].distance =
              pathToNode +
              Math.sqrt(
                (queue[queuePosition].node.column - end.column) ** 2 +
                  (queue[queuePosition].node.row - end.row) ** 2
              )
        }
      }

      queue.sort((a, b) => a.distance - b.distance)
    }
  }

  return []
}

function getEmptyNeighborsNodes(
  node: IPlaneRowBlockCoordinates,
  obstaclePlaneMatrix: PlaneRowBlock[][]
) {
  const maxNodeRow = obstaclePlaneMatrix.length
  const maxNodeColumn = obstaclePlaneMatrix[0].length
  const nodes: IPlaneRowBlockCoordinates[] = []

  if (
    node.row > 0 &&
    obstaclePlaneMatrix[node.row - 1][node.column].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row - 1,
      column: node.column
    })
  if (
    node.column < maxNodeColumn - 1 &&
    obstaclePlaneMatrix[node.row][node.column + 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row,
      column: node.column + 1
    })
  if (
    node.row < maxNodeRow - 1 &&
    obstaclePlaneMatrix[node.row + 1][node.column].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row + 1,
      column: node.column
    })
  if (
    node.column > 0 &&
    obstaclePlaneMatrix[node.row][node.column - 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row,
      column: node.column - 1
    })
  //NOTE: edges modification
  if (
    node.row > 0 &&
    node.column > 0 &&
    obstaclePlaneMatrix[node.row - 1][node.column - 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row - 1,
      column: node.column - 1
    })
  if (
    node.row < maxNodeRow - 1 &&
    node.column > 0 &&
    obstaclePlaneMatrix[node.row + 1][node.column - 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row + 1,
      column: node.column - 1
    })
  if (
    node.row < maxNodeRow - 1 &&
    node.column < maxNodeColumn - 1 &&
    obstaclePlaneMatrix[node.row + 1][node.column + 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row + 1,
      column: node.column + 1
    })
  if (
    node.row > 0 &&
    node.column < maxNodeColumn - 1 &&
    obstaclePlaneMatrix[node.row - 1][node.column + 1].type !==
      EPlaneBlockType.Obstacle
  )
    nodes.push({
      row: node.row - 1,
      column: node.column + 1
    })
  //---

  return nodes
}

function getItemPositionmInQueue(
  node: IPlaneRowBlockCoordinates,
  queue: IPathQueueItemType[]
) {
  let currentIndex: number | null = null

  for (let i = 0; i < queue.length; i++) {
    const queueItem = queue[i]
    if (
      node.row === queueItem.node.row &&
      node.column === queueItem.node.column &&
      currentIndex === null
    )
      currentIndex = i
  }

  return currentIndex
}
//---

interface INode extends IPlaneRowBlockCoordinates {
  //NOTE: additional info for final return
  object: PlaneRowBlock
}

interface IPathQueueItemType {
  node: INode
  distance: number
}
