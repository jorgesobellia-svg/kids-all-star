// Generado por scratchpad v3/build.py a partir de docs/guion-v3-niveles-5-12.md — no editar a mano.
import type { Level } from './types';

export const LEVELS_V3: Level[] = [
 {
  "n": 5,
  "free": false,
  "lessons": [
   {
    "id": "5.1",
    "level": 5,
    "glossary": [
     "hit",
     "safe"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "fx": {
       "ball": {
        "to": "gapL",
        "kind": "fly"
       }
      },
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "field9",
      "highlight": [],
      "fx": {
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      },
      "call": "safe"
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-first"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "tf",
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 3,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:hitOF",
       "b": "x:caughtAir",
       "c": "x:swingMiss"
      }
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "tap",
      "seg": 4,
      "target": "first",
      "scene": "diamond"
     },
     {
      "n": 6,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     }
    ]
   },
   {
    "id": "5.2",
    "level": 5,
    "glossary": [
     "single",
     "double",
     "triple"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "second",
       "third"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "fx": {
       "ball": {
        "to": "hole34",
        "kind": "ground"
       }
      },
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "ball": {
        "to": "gapR",
        "kind": "fly"
       }
      },
      "run": [
       "home",
       "first",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "third"
      ],
      "fx": {
       "ball": {
        "to": "rf",
        "kind": "fly"
       }
      },
      "run": [
       "home",
       "first",
       "second",
       "third"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "third"
      ],
      "fx": {
       "runners": [
        "third"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-mid23"
      ],
      "fx": {
       "runners": [
        "mid23"
       ],
       "ball": {
        "to": "lf",
        "kind": "fly"
       }
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "choice",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "drag",
      "seg": 0,
      "place": {
       "single": "first",
       "double": "second",
       "triple": "third"
      },
      "board": "diamond"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "choice",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     }
    ]
   },
   {
    "id": "5.3",
    "level": 5,
    "glossary": [
     "homeRun",
     "groundRuleDouble"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "ball": {
        "to": "overC",
        "kind": "out"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "overL",
        "kind": "out"
       }
      },
      "run": [
       "home",
       "first",
       "second",
       "third",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "outfield"
      ],
      "fx": {
       "ball": {
        "to": "overR",
        "kind": "bounceOut"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "ball": {
        "to": "overR",
        "kind": "bounceOut"
       }
      },
      "run": [
       "home",
       "first",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "ball": {
        "to": "overC",
        "kind": "bounceOut"
       }
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "choice",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 3,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "drag",
      "seg": 4,
      "place": {
       "air": "hr",
       "bounce": "grd"
      },
      "board": "match"
     }
    ]
   },
   {
    "id": "5.4",
    "level": 5,
    "glossary": [
     "safe"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ],
      "call": "safe"
     },
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "run-past1"
      ],
      "fx": {
       "runners": [
        "past1"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "second",
       "third"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "run-past2"
      ],
      "fx": {
       "runners": [
        "past2"
       ]
      },
      "call": "out"
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "tap",
      "seg": 1,
      "target": "first",
      "scene": "diamond"
     },
     {
      "n": 5,
      "type": "choiceImg",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:overrun2",
       "b": "x:overrun1back",
       "c": "x:onBase"
      }
     },
     {
      "n": 6,
      "type": "umpire",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     }
    ]
   },
   {
    "id": "5.5",
    "level": 5,
    "glossary": [
     "bunt"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": [],
      "count": [
       0,
       0
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "bunt",
        "kind": "bunt"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "fx": {
       "ball": {
        "to": "bunt",
        "kind": "bunt"
       },
       "runners": [
        "lead1"
       ]
      }
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       2
      ],
      "call": "k"
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       2
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:buntPose",
       "b": "x:swingFull",
       "c": "x:batFloor"
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "choice",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     }
    ]
   }
  ],
  "lessonIds": [
   "5.1",
   "5.2",
   "5.3",
   "5.4",
   "5.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 2,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 3,
    "lesson": "5.1",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 4,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 5,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 6,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 7,
    "lesson": "5.1",
    "type": "tap",
    "target": "first",
    "scene": "diamond"
   },
   {
    "n": 8,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 9,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 10,
    "lesson": "5.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 11,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 12,
    "lesson": "5.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   }
  ],
  "passPercent": 80
 }
] as unknown as Level[];
