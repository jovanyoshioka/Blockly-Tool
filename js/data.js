/**
 * TEMPORARY: This data will be stored and retrieved from a database in the future.
 */
const CHARACTERX_ID    = "character";
const BOUNDARYX_ID     = "boundary";
const GOALX_ID         = "goal";

// Note: pages array size does not match numLevels because one index for opening pages (cover/intro).
const STORIES_DATA = [
  {title: "the_very_hungry_caterpillar", numLevels: 5, pages:[2,1,1,1,1,1], character:"the caterpillar", goals:["apple","pears","plums","strawberries","oranges"], boundary:"leaves"},
  {title: "green_eggs_and_ham", numLevels: 6, pages:[3,2,2,1,2,2,3], character:"Sam", goals:["house","box","car","train","boat","green eggs and ham"], boundary:"yellow trees"}
];

const MAZES_DATA = [
  {
    title: "the_very_hungry_caterpillar",
    levels: [
      [
        { type: CHARACTERX_ID, coords: [[0,0]] },
        { type: GOALX_ID, coords: [[3,2]] },
        { type: BOUNDARYX_ID, coords: [[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,2],[4,1],[4,0]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[3,1]] },
        { type: GOALX_ID, coords: [[1,5]] },
        { type: BOUNDARYX_ID, coords: [[2,0],[3,0],[4,0],[2,1],[4,1],[2,2],[4,2],[5,2],[6,2],[2,3],[6,3],[0,4],[1,4],[2,4],[3,4],[4,4],[6,4],[0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[1,1]] },
        { type: GOALX_ID, coords: [[9,9]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
                                       [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[10,2],
                                       [0,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],
                                       [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[10,6],
                                       [0,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
                                       [0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],
                                       [0,1],[10,1],[0,3],[10,3],[0,5],[10,5],[0,7],[10,7],[0,9],[10,9]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ],
    ]
  },
  {
    title: "green_eggs_and_ham",
    levels: [
      [
        { type: CHARACTERX_ID, coords: [[0,0]] },
        { type: GOALX_ID, coords: [[3,3]] },
        { type: BOUNDARYX_ID, coords: [[1,0],[1,1],[1,2],[2,2],[3,2],[4,3],[4,2],[4,4],[3,4],[2,4],[1,4],[0,4]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[1,3]] },
        { type: GOALX_ID, coords: [[5,1]] },
        { type: BOUNDARYX_ID, coords: [[0,2],[0,3],[0,4],[1,2],[1,4],[2,2],[2,4],[2,5],[2,6],[3,2],[3,6],[4,0],[4,1],[4,2],[4,3],[4,4],[4,6],[5,0],[5,6],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ],
      [
        { type: CHARACTERX_ID, coords: [[0,1]] },
        { type: GOALX_ID, coords: [[2,1]] },
        { type: BOUNDARYX_ID, coords: [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]] }
      ]
    ]
  }
];