// Generado por scratchpad v3/build.py a partir de docs/guion-v3-niveles-5-12.md y docs/guion-v4-niveles-13-20.md — no editar a mano.
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
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "5.1",
    "type": "tap",
    "target": "first",
    "scene": "diamond"
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
    "lesson": "5.2",
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
    "lesson": "5.3",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "5.3",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 9,
    "lesson": "5.4",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 10,
    "lesson": "5.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "5.5",
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
    "lesson": "5.5",
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
 },
 {
  "n": 6,
  "free": false,
  "lessons": [
   {
    "id": "6.1",
    "level": 6,
    "glossary": [
     "flyBall",
     "lineDrive"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "caught"
       }
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF",
       "posSS"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "caught"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos3b"
      ],
      "foulHit": "caught",
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF"
      ],
      "fx": {
       "ball": {
        "to": "rf",
        "kind": "drop"
       }
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "correct": "true"
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
       "a": "x:flyOF",
       "b": "x:rollGround",
       "c": "x:softBunt"
      }
     },
     {
      "n": 5,
      "type": "umpire",
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
     }
    ]
   },
   {
    "id": "6.2",
    "level": 6,
    "glossary": [
     "forceOut"
    ],
    "demo": [
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
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ],
       "ball": {
        "to": "hole56",
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
       "run-mid12",
       "second"
      ],
      "fx": {
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posSS",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posSS",
        "second"
       ]
      },
      "call": "out"
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 4,
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
      "seg": 4,
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
      "seg": 4,
      "target": "second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 4,
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
    "id": "6.3",
    "level": 6,
    "glossary": [
     "tagOut"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "third"
      ],
      "fx": {
       "runners": [
        "mid23"
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
       "throws": [
        "posSS",
        "mid23"
       ]
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "run-mid23"
      ],
      "fx": {
       "runners": [
        "mid23"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-lead2"
      ],
      "fx": {
       "runners": [
        "lead2"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      },
      "call": "safe"
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
      "type": "choice",
      "seg": 4,
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
      "seg": 3,
      "target": "run-lead2",
      "scene": "diamond",
      "fx": {
       "runners": [
        "lead2"
       ]
      }
     },
     {
      "n": 5,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:tagBall",
       "b": "x:tagEmpty",
       "c": "x:handNoBall"
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
    "id": "6.4",
    "level": 6,
    "glossary": [
     "forceOut",
     "tagOut"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-second",
       "third"
      ],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-mid23",
       "first"
      ],
      "fx": {
       "runners": [
        "mid23"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 4,
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
      "type": "tf",
      "seg": 1,
      "correct": "true"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tap",
      "seg": 2,
      "target": "run-second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "n": 6,
      "type": "umpire",
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
    "id": "6.5",
    "level": 6,
    "glossary": [
     "doublePlay",
     "fieldersChoice"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "first"
      ],
      "fx": {
       "runners": [
        "first"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       },
       "throws": [
        "posSS",
        "second",
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos2b",
       "pos1b"
      ],
      "numbers": true,
      "fx": {
       "throws": [
        "posSS",
        "pos2b",
        "pos1b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posSS",
        "second"
       ]
      },
      "run": [
       "home",
       "first"
      ]
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
      }
     },
     {
      "scene": "field9",
      "highlight": [],
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
      "seg": 0,
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
      "seg": 1,
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
      "type": "tf",
      "seg": 1,
      "correct": "true"
     },
     {
      "n": 5,
      "type": "umpire",
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
   }
  ],
  "lessonIds": [
   "6.1",
   "6.2",
   "6.3",
   "6.4",
   "6.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "6.1",
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
    "lesson": "6.1",
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
    "lesson": "6.1",
    "type": "tap",
    "target": "anyOF",
    "scene": "field9"
   },
   {
    "n": 4,
    "lesson": "6.1",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 5,
    "lesson": "6.2",
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
    "lesson": "6.2",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 7,
    "lesson": "6.3",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "6.3",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 9,
    "lesson": "6.4",
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
    "lesson": "6.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "6.5",
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
    "lesson": "6.5",
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
 },
 {
  "n": 7,
  "free": false,
  "lessons": [
   {
    "id": "7.1",
    "level": 7,
    "glossary": [
     "safe",
     "runner"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      },
      "call": "safe"
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "second",
        "mid12"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "second",
        "mid12"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second",
        "third"
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
      "type": "tap",
      "seg": 0,
      "target": "third",
      "scene": "diamond",
      "fx": {
       "runners": [
        "third"
       ]
      }
     },
     {
      "n": 5,
      "type": "umpire",
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
      "type": "choice",
      "seg": 3,
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
    "id": "7.2",
    "level": 7,
    "glossary": [
     "tagUp"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "run-third"
      ],
      "fx": {
       "runners": [
        "third"
       ],
       "ball": {
        "to": "cf",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-lead3"
      ],
      "fx": {
       "runners": [
        "lead3"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "third"
      ],
      "fx": {
       "runners": [
        "lead3"
       ],
       "ball": {
        "to": "cf",
        "kind": "caught"
       },
       "throws": [
        "posCF",
        "third"
       ]
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "third",
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "caught"
       }
      },
      "run": [
       "third",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "run": [
       "third",
       "home"
      ],
      "call": "safe"
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 3,
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
      "n": 4,
      "type": "tap",
      "seg": 3,
      "target": "third",
      "scene": "diamond",
      "fx": {
       "runners": [
        "third"
       ]
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 4,
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
      "seg": 3,
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
    "id": "7.3",
    "level": 7,
    "glossary": [
     "runner",
     "deadBall"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "ball": {
        "to": "mid12",
        "kind": "hitRunner"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "ball": {
        "to": "mid12",
        "kind": "hitRunner"
       }
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "pos2b"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "ball": {
        "to": "gapR",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "ball": {
        "to": "mid12",
        "kind": "hitRunner"
       }
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "outfield"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "ball": {
        "to": "gapR",
        "kind": "ground"
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
      "type": "tf",
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "umpire",
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
      "type": "tap",
      "seg": 4,
      "target": "outfield",
      "scene": "field9",
      "fx": {
       "ball": {
        "to": "gapR",
        "kind": "ground"
       }
      }
     }
    ]
   },
   {
    "id": "7.4",
    "level": 7,
    "glossary": [
     "runner",
     "passingRunner"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-mid23"
      ],
      "fx": {
       "runners": [
        "mid12",
        "mid23"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-lead3"
      ],
      "fx": {
       "runners": [
        "lead3",
        "mid23"
       ]
      },
      "call": "out"
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-third"
      ],
      "fx": {
       "runners": [
        "third",
        "mid23"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tap",
      "seg": 4,
      "target": "run-second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:rowGood",
       "b": "x:passing",
       "c": "x:backwards"
      }
     }
    ]
   },
   {
    "id": "7.5",
    "level": 7,
    "glossary": [
     "dependingOnOuts"
    ],
    "demo": [
     {
      "scene": "board",
      "highlight": [
       "outs"
      ],
      "board": {
       "inning": 5,
       "half": "top",
       "outs": 2,
       "away": 2,
       "home": 1
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      },
      "run": [
       "second",
       "third",
       "home"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "lead2"
       ],
       "ball": {
        "to": "cf",
        "kind": "caught"
       },
       "throws": [
        "posCF",
        "second"
       ]
      },
      "call": "out"
     },
     {
      "scene": "board",
      "highlight": [
       "outs"
      ],
      "board": {
       "inning": 5,
       "half": "top",
       "outs": 1,
       "away": 2,
       "home": 1
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
      "type": "tf",
      "seg": 1,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 1,
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
      "seg": 1,
      "target": "home",
      "scene": "diamond",
      "fx": {
       "runners": [
        "second"
       ],
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      }
     },
     {
      "n": 6,
      "type": "choice",
      "seg": 3,
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
   "7.1",
   "7.2",
   "7.3",
   "7.4",
   "7.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "7.1",
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
    "lesson": "7.1",
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
    "lesson": "7.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "7.1",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 5,
    "lesson": "7.1",
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
    "lesson": "7.1",
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
    "lesson": "7.1",
    "type": "tap",
    "target": "first",
    "scene": "diamond",
    "fx": {
     "runners": [
      "first"
     ]
    }
   },
   {
    "n": 8,
    "lesson": "7.1",
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
    "lesson": "7.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 10,
    "lesson": "7.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "7.1",
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
    "lesson": "7.1",
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
 },
 {
  "n": 8,
  "free": false,
  "lessons": [
   {
    "id": "8.1",
    "level": 8,
    "glossary": [
     "hit",
     "error"
    ],
    "demo": [
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
     },
     {
      "scene": "field9",
      "highlight": [
       "first"
      ],
      "fx": {
       "ball": {
        "to": "hole56",
        "kind": "ground"
       },
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:dropFly",
       "b": "x:cleanHit",
       "c": "x:hrFence"
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
      "seg": 3,
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
    "id": "8.2",
    "level": 8,
    "glossary": [
     "rbi"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      },
      "run": [
       "second",
       "third",
       "home"
      ],
      "call": "run"
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "hole34",
        "kind": "ground"
       }
      },
      "run": [
       "second",
       "third",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-first",
       "run-second",
       "home"
      ],
      "fx": {
       "runners": [
        "first",
        "second"
       ],
       "ball": {
        "to": "overL",
        "kind": "out"
       }
      }
     },
     {
      "scene": "board",
      "highlight": [
       "runs"
      ],
      "board": {
       "inning": 4,
       "half": "top",
       "outs": 1,
       "away": 3,
       "home": 1
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
      "type": "tf",
      "seg": 3,
      "correct": "true"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "umpire",
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
      "type": "tap",
      "seg": 2,
      "target": "home",
      "scene": "diamond",
      "fx": {
       "runners": [
        "second"
       ]
      }
     }
    ]
   },
   {
    "id": "8.3",
    "level": 8,
    "glossary": [
     "hittersCount",
     "pitchersCount",
     "pitchCount"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       1
      ]
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       2,
       0
      ],
      "showZone": true,
      "pitch": "mid"
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       0,
       2
      ],
      "showZone": true
     },
     {
      "scene": "zone",
      "highlight": [],
      "count": [
       2,
       2
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
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
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
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
      "n": 6,
      "type": "umpire",
      "seg": 0,
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
    "id": "8.4",
    "level": 8,
    "glossary": [
     "strikeoutK"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [],
      "numbers": true
     },
     {
      "scene": "field9",
      "highlight": [],
      "numbers": true
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos2b",
       "pos1b"
      ],
      "numbers": true,
      "fx": {
       "throws": [
        "posSS",
        "pos2b",
        "pos1b"
       ]
      }
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       0,
       3
      ],
      "call": "k"
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "numbers": true,
      "fx": {
       "ball": {
        "to": "hole56",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [],
      "numbers": true
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tf",
      "seg": 3,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "drag",
      "seg": 2,
      "route": [
       "pos2b",
       "pos1b"
      ],
      "from": "posSS"
     },
     {
      "n": 6,
      "type": "umpire",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "b"
     }
    ]
   },
   {
    "id": "8.5",
    "level": 8,
    "glossary": [
     "rhe",
     "error"
    ],
    "demo": [
     {
      "scene": "linescore",
      "highlight": [],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     },
     {
      "scene": "linescore",
      "highlight": [
       "0-0",
       "1-0",
       "2-0",
       "3-0",
       "4-0",
       "5-0",
       "0-1",
       "1-1",
       "2-1",
       "3-1",
       "4-1",
       "5-1"
      ],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     },
     {
      "scene": "linescore",
      "highlight": [
       "R",
       "H",
       "E"
      ],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     },
     {
      "scene": "linescore",
      "highlight": [
       "R",
       "H"
      ],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     },
     {
      "scene": "linescore",
      "highlight": [
       "E"
      ],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     },
     {
      "scene": "linescore",
      "highlight": [
       "R",
       "H",
       "E"
      ],
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
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
       "a": "x:lsR",
       "b": "x:lsH",
       "c": "x:lsTie"
      }
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 5,
      "target": "ls-R0",
      "scene": "linescore",
      "linescore": {
       "innings": 6,
       "rows": [
        {
         "team": "away",
         "runs": [
          1,
          0,
          2,
          0,
          2,
          0
         ],
         "R": 5,
         "H": 8,
         "E": 1
        },
        {
         "team": "home",
         "runs": [
          0,
          1,
          0,
          2,
          0,
          0
         ],
         "R": 3,
         "H": 9,
         "E": 0
        }
       ]
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "8.1",
   "8.2",
   "8.3",
   "8.4",
   "8.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "8.1",
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
    "lesson": "8.1",
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
    "lesson": "8.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "8.1",
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
    "lesson": "8.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 6,
    "lesson": "8.1",
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
    "lesson": "8.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "8.1",
    "type": "tap",
    "target": "posLF",
    "scene": "field9",
    "fx": {
     "ball": {
      "to": "lf",
      "kind": "drop"
     }
    }
   },
   {
    "n": 9,
    "lesson": "8.1",
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
    "lesson": "8.1",
    "type": "tf",
    "correct": "false"
   },
   {
    "n": 11,
    "lesson": "8.1",
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
    "lesson": "8.1",
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
 },
 {
  "n": 9,
  "free": false,
  "lessons": [
   {
    "id": "9.1",
    "level": 9,
    "glossary": [
     "stolenBase",
     "sbScoring",
     "caughtStealing"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "run-first",
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "second"
      ],
      "fx": {
       "throws": [
        "posC",
        "second"
       ]
      },
      "run": [
       "first",
       "second"
      ],
      "call": "safe"
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "seg": 0,
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
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 2,
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
      "seg": 0,
      "target": "second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first"
       ]
      }
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
    "id": "9.2",
    "level": 9,
    "glossary": [
     "lead"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "run-lead1"
      ],
      "fx": {
       "runners": [
        "lead1"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-lead1"
      ],
      "fx": {
       "runners": [
        "lead1"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-lead1",
       "path12"
      ],
      "fx": {
       "runners": [
        "lead1"
       ],
       "path12": true
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "first"
      ],
      "fx": {
       "runners": [
        "lead1"
       ],
       "throws": [
        "mound",
        "first"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "seg": 0,
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
      "type": "tap",
      "seg": 2,
      "target": "path12",
      "scene": "diamond",
      "fx": {
       "path12": true
      }
     },
     {
      "n": 5,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "umpire",
      "seg": 3,
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
    "id": "9.3",
    "level": 9,
    "glossary": [
     "pickoff"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "pickoff"
     },
     {
      "scene": "field9",
      "highlight": [
       "first",
       "run-lead1"
      ],
      "fx": {
       "runners": [
        "lead1"
       ],
       "throws": [
        "mound",
        "pos1b"
       ]
      },
      "call": "out"
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-lead1"
      ],
      "fx": {
       "runners": [
        "lead1"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "lead1"
       ],
       "throws": [
        "mound",
        "foulL"
       ]
      },
      "run": [
       "first",
       "second"
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
      "correct": "true"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 4,
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
      "seg": 2,
      "target": "first",
      "scene": "diamond",
      "fx": {
       "runners": [
        "lead1"
       ]
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
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
      "seg": 3,
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
    "id": "9.4",
    "level": 9,
    "glossary": [
     "balk"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "balk"
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      },
      "run": [
       "first",
       "second"
      ],
      "call": "balk"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "balk"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "type": "tf",
      "seg": 1,
      "correct": "true"
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
       "a": "x:pitchStop",
       "b": "x:pitchNormal",
       "c": "x:pickoffLegal"
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
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
    "id": "9.5",
    "level": 9,
    "glossary": [
     "wildPitch",
     "passedBall"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "backstop"
      ],
      "fx": {
       "runners": [
        "third"
       ],
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "posC"
      ],
      "fx": {
       "backstop": true
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "mound"
      ],
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ],
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home",
       "backstop"
      ],
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "ground"
       }
      },
      "run": [
       "third",
       "home"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "seg": 4,
      "correct": "true"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "umpire",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 4,
      "target": "backstop",
      "scene": "field9",
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "ground"
       }
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "9.1",
   "9.2",
   "9.3",
   "9.4",
   "9.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "9.1",
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
    "lesson": "9.1",
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
    "lesson": "9.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "9.1",
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
    "lesson": "9.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 6,
    "lesson": "9.1",
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
    "lesson": "9.1",
    "type": "tap",
    "target": "second",
    "scene": "diamond",
    "fx": {
     "runners": [
      "first"
     ]
    }
   },
   {
    "n": 8,
    "lesson": "9.1",
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
    "lesson": "9.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 10,
    "lesson": "9.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "9.1",
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
    "lesson": "9.1",
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
 },
 {
  "n": 10,
  "free": false,
  "lessons": [
   {
    "id": "10.1",
    "level": 10,
    "glossary": [
     "droppedThird"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       3
      ],
      "call": "k"
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "first"
      ],
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "drop"
       }
      },
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ],
      "fx": {
       "backstop": true,
       "ball": {
        "to": "backstop",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "board",
      "highlight": [
       "outs"
      ],
      "board": {
       "inning": 3,
       "half": "top",
       "outs": 2,
       "away": 1,
       "home": 1
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "pos1b"
      ],
      "fx": {
       "throws": [
        "posC",
        "pos1b"
       ]
      },
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "n": 5,
      "type": "umpire",
      "seg": 4,
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
      "seg": 6,
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
    "id": "10.2",
    "level": 10,
    "glossary": [
     "infieldFly"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-first",
       "run-second"
      ],
      "fx": {
       "runners": [
        "first",
        "second"
       ],
       "ball": {
        "to": "popIF",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-lead1",
       "run-lead2"
      ],
      "fx": {
       "runners": [
        "lead1",
        "lead2"
       ],
       "ball": {
        "to": "popIF",
        "kind": "drop"
       },
       "throws": [
        "posSS",
        "third"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "runners": [
        "first",
        "second"
       ],
       "ball": {
        "to": "popIF",
        "kind": "fly"
       }
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "run-first",
       "run-second"
      ],
      "fx": {
       "runners": [
        "first",
        "second"
       ],
       "ball": {
        "to": "popIF",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "first",
        "second"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
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
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:popIF",
       "b": "x:lineOF",
       "c": "x:deepFly"
      }
     }
    ]
   },
   {
    "id": "10.3",
    "level": 10,
    "glossary": [
     "liveBall",
     "deadBall",
     "hbp"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      },
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "mid12"
       ]
      },
      "call": "time"
     },
     {
      "scene": "diamond",
      "highlight": [
       "foulLine"
      ],
      "foulHit": "ground",
      "call": "foul"
     },
     {
      "scene": "diamond",
      "highlight": [],
      "call": "time"
     },
     {
      "scene": "zone",
      "highlight": [],
      "call": "hbp"
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
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 4,
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
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 3,
      "target": "first",
      "scene": "diamond",
      "fx": {
       "runners": [
        "mid12"
       ]
      }
     }
    ]
   },
   {
    "id": "10.4",
    "level": 10,
    "glossary": [
     "interference",
     "obstruction"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": []
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "run-hole56"
      ],
      "fx": {
       "runners": [
        "hole56"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      },
      "call": "out"
     },
     {
      "scene": "diamond",
      "highlight": [
       "fld-mid12",
       "run-past1"
      ],
      "fx": {
       "runners": [
        "past1"
       ],
       "fielders": [
        "mid12"
       ]
      },
      "run": [
       "first",
       "second"
      ],
      "call": "safe"
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "run-hole56"
      ],
      "fx": {
       "runners": [
        "hole56"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "fld-mid12"
      ],
      "fx": {
       "runners": [
        "past1"
       ],
       "fielders": [
        "mid12"
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 1,
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
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 4,
      "target": "fld-mid12",
      "scene": "diamond",
      "fx": {
       "runners": [
        "past1"
       ],
       "fielders": [
        "mid12"
       ]
      }
     }
    ]
   },
   {
    "id": "10.5",
    "level": 10,
    "glossary": [
     "appeal"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "second",
       "third",
       "home"
      ],
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
       "second"
      ],
      "fx": {
       "runners": [
        "mid23"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "pos2b"
      ],
      "fx": {
       "runners": [
        "third"
       ],
       "throws": [
        "posCF",
        "pos2b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "third"
       ]
      },
      "call": "out"
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-third"
      ],
      "fx": {
       "runners": [
        "third"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": []
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 4,
      "correct": "true"
     },
     {
      "n": 3,
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
      "type": "tap",
      "seg": 1,
      "target": "third",
      "scene": "diamond",
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "10.1",
   "10.2",
   "10.3",
   "10.4",
   "10.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "10.1",
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
    "lesson": "10.1",
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
    "lesson": "10.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "10.1",
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
    "lesson": "10.1",
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
    "lesson": "10.1",
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
    "lesson": "10.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 8,
    "lesson": "10.1",
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
    "lesson": "10.1",
    "type": "tap",
    "target": "first",
    "scene": "diamond"
   },
   {
    "n": 10,
    "lesson": "10.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "10.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 12,
    "lesson": "10.1",
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
 },
 {
  "n": 11,
  "free": false,
  "lessons": [
   {
    "id": "11.1",
    "level": 11,
    "glossary": [
     "mound",
     "rubber"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [
       "rubber"
      ],
      "pose": "set"
     },
     {
      "scene": "mound",
      "highlight": [
       "rubber"
      ],
      "pose": "set"
     },
     {
      "scene": "field9",
      "highlight": [
       "mound",
       "posC"
      ]
     },
     {
      "scene": "mound",
      "highlight": [
       "distance"
      ],
      "pose": "release"
     },
     {
      "scene": "mound",
      "highlight": [
       "distance"
      ],
      "pose": "release"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "seg": 0,
      "target": "mound",
      "scene": "diamond"
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
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
    "id": "11.2",
    "level": 11,
    "glossary": [
     "windup",
     "setPosition"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "windup"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "diamond",
      "highlight": [],
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:setPose",
       "b": "x:windupPose",
       "c": "x:pitcherBatting"
      }
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
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
      "seg": 3,
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
    "id": "11.3",
    "level": 11,
    "glossary": [
     "fastball",
     "changeup"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "fastball"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "changeup"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "fastball"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 6,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "umpire",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:gripFast",
       "b": "x:curveTwist",
       "c": "x:eyesClosed"
      }
     }
    ]
   },
   {
    "id": "11.4",
    "level": 11,
    "glossary": [
     "pitchCount",
     "restDays"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "warm"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "warm"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 2,
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
      "n": 5,
      "type": "umpire",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:restDugout",
       "b": "x:throwDaily",
       "c": "x:armBandage"
      }
     }
    ]
   },
   {
    "id": "11.5",
    "level": 11,
    "glossary": [
     "reliever"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "rest"
     },
     {
      "scene": "field9",
      "highlight": [
       "mound"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "bullpen"
      ],
      "fx": {
       "bullpen": true
      }
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "warm"
     },
     {
      "scene": "field9",
      "highlight": [
       "mound",
       "bullpen"
      ],
      "fx": {
       "bullpen": true
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
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
      "n": 3,
      "type": "tf",
      "seg": 2,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 0,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
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
      "type": "tap",
      "seg": 2,
      "target": "bullpen",
      "scene": "field9",
      "fx": {
       "bullpen": true
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "11.1",
   "11.2",
   "11.3",
   "11.4",
   "11.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "11.1",
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
    "lesson": "11.1",
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
    "lesson": "11.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "11.1",
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
    "lesson": "11.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 6,
    "lesson": "11.1",
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
    "lesson": "11.1",
    "type": "tap",
    "target": "mound",
    "scene": "diamond"
   },
   {
    "n": 8,
    "lesson": "11.1",
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
    "lesson": "11.1",
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
    "lesson": "11.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 11,
    "lesson": "11.1",
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
    "lesson": "11.1",
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
 },
 {
  "n": 12,
  "free": false,
  "lessons": [
   {
    "id": "12.1",
    "level": 12,
    "glossary": [
     "leadRunner",
     "sureOut"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "runners": [
        "mid12",
        "mid3h"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "first",
       "second",
       "third",
       "home"
      ],
      "fx": {
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "run-mid12"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posSS",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "first"
      ],
      "fx": {
       "throws": [
        "pos3b",
        "pos1b"
       ]
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": []
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "choice",
      "seg": 4,
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
      "seg": 4,
      "correct": "true"
     },
     {
      "n": 4,
      "type": "tap",
      "seg": 3,
      "target": "second",
      "scene": "field9",
      "fx": {
       "runners": [
        "first"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "n": 5,
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
    "id": "12.2",
    "level": 12,
    "glossary": [
     "cutoff"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posCF",
       "home"
      ],
      "fx": {
       "throws": [
        "posCF",
        "home"
       ],
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "cutoff",
       "posCF"
      ],
      "fx": {
       "throws": [
        "posCF",
        "cutoff"
       ],
       "runners": [
        "mid3h"
       ],
       "fielders": [
        "cutoff"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "cutoff",
       "home"
      ],
      "fx": {
       "throws": [
        "posCF",
        "cutoff",
        "home"
       ],
       "runners": [
        "mid3h"
       ],
       "fielders": [
        "cutoff"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "cutoff"
      ],
      "fx": {
       "fielders": [
        "cutoff"
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
      "type": "drag",
      "seg": 2,
      "route": [
       "cutoff",
       "home"
      ],
      "from": "posCF",
      "fx": {
       "fielders": [
        "cutoff"
       ]
      }
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 1,
      "correct": "true"
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
      "type": "choice",
      "seg": 3,
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
    "id": "12.3",
    "level": 12,
    "glossary": [
     "coverBase",
     "backUp"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": []
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "mound",
       "first"
      ],
      "fx": {
       "ball": {
        "to": "gapR",
        "kind": "ground"
       },
       "throws": [
        "mound",
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "posCF"
      ],
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posC",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "first",
       "posCF"
      ],
      "fx": {
       "throws": [
        "mound",
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": []
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
      "type": "tf",
      "seg": 0,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "tap",
      "seg": 2,
      "target": "posCF",
      "scene": "field9",
      "fx": {
       "runners": [
        "mid12"
       ],
       "throws": [
        "posC",
        "second"
       ]
      }
     },
     {
      "n": 5,
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
   },
   {
    "id": "12.4",
    "level": 12,
    "glossary": [
     "baseCoach",
     "signs"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "first",
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
        "mid23"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "balk"
     },
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "runners": [
        "third"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "seg": 1,
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
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
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
   },
   {
    "id": "12.5",
    "level": 12,
    "glossary": [
     "sportsmanship"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "call": "strike"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home",
       "dugout"
      ]
     },
     {
      "scene": "field9",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": []
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
      "seg": 1,
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
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:handshake",
       "b": "x:helmetThrow",
       "c": "x:teasing"
      }
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
   "12.1",
   "12.2",
   "12.3",
   "12.4",
   "12.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "12.1",
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
    "lesson": "12.1",
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
    "lesson": "12.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "12.1",
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
    "lesson": "12.1",
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
    "lesson": "12.1",
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
    "lesson": "12.1",
    "type": "tap",
    "target": "first",
    "scene": "diamond"
   },
   {
    "n": 8,
    "lesson": "12.1",
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
    "lesson": "12.1",
    "type": "tf",
    "correct": "true"
   },
   {
    "n": 10,
    "lesson": "12.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "12.1",
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
    "lesson": "12.1",
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
 },
 {
  "n": 13,
  "free": false,
  "lessons": [
   {
    "id": "13.1",
    "level": 13,
    "glossary": [
     "catcher",
     "catcherMitt",
     "chestProtector",
     "shinGuards"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "warm"
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 2,
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:catcherReady",
       "b": "x:catcherCap",
       "c": "x:catcherNoGlove"
      }
     },
     {
      "n": 3,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "drag",
      "seg": 1,
      "place": {
       "mask": "face",
       "chest": "chestSlot",
       "shins": "legs"
      },
      "board": "match"
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
    "id": "13.2",
    "level": 13,
    "glossary": [
     "signs"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "mound"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "field9",
      "highlight": [
       "dugout",
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "mound"
      ],
      "call": "time"
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "seg": 1,
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
      "seg": 6,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 5,
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
      "seg": 5,
      "target": "posC",
      "scene": "field9"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     }
    ]
   },
   {
    "id": "13.3",
    "level": 13,
    "glossary": [
     "block"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ],
      "fx": {
       "ball": {
        "to": "home",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
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
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
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
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:blockGood",
       "b": "x:catcherSide",
       "c": "x:catcherJump"
      }
     },
     {
      "n": 5,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 5,
      "correct": "false"
     }
    ]
   },
   {
    "id": "13.4",
    "level": 13,
    "glossary": [
     "catcherInterference"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "zone",
      "highlight": []
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
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "umpire",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 2,
      "correct": "false"
     }
    ]
   },
   {
    "id": "13.5",
    "level": 13,
    "glossary": [
     "playAtPlate"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "home",
       "posCF"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ],
       "throws": [
        "posCF",
        "home"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home",
       "posC"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ],
       "throws": [
        "posCF",
        "posC"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "home"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ]
      },
      "call": "out"
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 3,
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
      "n": 4,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 5,
      "type": "tap",
      "seg": 1,
      "target": "home",
      "scene": "diamond",
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "n": 6,
      "type": "umpire",
      "seg": 5,
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
   "13.1",
   "13.2",
   "13.3",
   "13.4",
   "13.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "13.1",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "b"
   },
   {
    "n": 2,
    "lesson": "13.1",
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
    "lesson": "13.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "13.2",
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
    "lesson": "13.3",
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
    "lesson": "13.3",
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
    "lesson": "13.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "13.4",
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
    "lesson": "13.5",
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
    "lesson": "13.5",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "13.5",
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
    "lesson": "13.1",
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
 },
 {
  "n": 14,
  "free": false,
  "lessons": [
   {
    "id": "14.1",
    "level": 14,
    "glossary": [
     "readyPosition"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
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
      "seg": 2,
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
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:readyPos",
       "b": "x:backTurned",
       "c": "x:chatting"
      }
     },
     {
      "n": 5,
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
      "n": 6,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     }
    ]
   },
   {
    "id": "14.2",
    "level": 14,
    "glossary": [
     "fieldBall"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "ball": {
        "to": "hole56",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "ball": {
        "to": "posSS",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "first"
      ],
      "fx": {
       "throws": [
        "posSS",
        "pos1b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
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
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "drag",
      "seg": 5,
      "place": {
       "front": "1",
       "down": "2",
       "two": "3",
       "throw": "4"
      },
      "board": "order"
     },
     {
      "n": 5,
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
      "n": 6,
      "type": "tf",
      "seg": 2,
      "correct": "false"
     }
    ]
   },
   {
    "id": "14.3",
    "level": 14,
    "glossary": [
     "receiveThrow"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "pos1b"
      ],
      "fx": {
       "throws": [
        "posSS",
        "pos1b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "first"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "first"
      ],
      "fx": {
       "throws": [
        "posSS",
        "pos2b",
        "pos1b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b"
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
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "tap",
      "seg": 1,
      "target": "first",
      "scene": "diamond",
      "fx": {
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "n": 5,
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
      "n": 6,
      "type": "tf",
      "seg": 1,
      "correct": "true"
     }
    ]
   },
   {
    "id": "14.4",
    "level": 14,
    "glossary": [
     "doublePlay",
     "coverBase14"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "second",
       "first"
      ],
      "fx": {
       "runners": [
        "first"
       ],
       "throws": [
        "posSS",
        "pos2b",
        "pos1b"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos2b"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos2b",
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ],
       "ball": {
        "to": "hole56",
        "kind": "ground"
       },
       "throws": [
        "posSS",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos2b",
       "posSS",
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ],
       "ball": {
        "to": "hole34",
        "kind": "ground"
       },
       "throws": [
        "pos2b",
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "second"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
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
      "seg": 3,
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
      "seg": 4,
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
      "seg": 5,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 6,
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
      "seg": 0,
      "target": "second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 0,
      "correct": "false"
     }
    ]
   },
   {
    "id": "14.5",
    "level": 14,
    "glossary": [
     "callBall",
     "mine",
     "backUp14"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos3b"
      ],
      "fx": {
       "ball": {
        "to": "popIF",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos3b"
      ],
      "fx": {
       "ball": {
        "to": "popIF",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ],
      "fx": {
       "ball": {
        "to": "popIF",
        "kind": "caught"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos3b"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posSS"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "choice",
      "seg": 4,
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
      "seg": 6,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 5,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:callMine",
       "b": "x:collide",
       "c": "x:lookAway"
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "14.1",
   "14.2",
   "14.3",
   "14.4",
   "14.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "14.1",
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
    "lesson": "14.2",
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
    "lesson": "14.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "14.2",
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
    "lesson": "14.3",
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
    "lesson": "14.3",
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
    "lesson": "14.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "14.4",
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
    "lesson": "14.5",
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
    "lesson": "14.5",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "14.4",
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
    "lesson": "14.5",
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
 },
 {
  "n": 15,
  "free": false,
  "lessons": [
   {
    "id": "15.1",
    "level": 15,
    "glossary": [
     "firstStepBack"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "overC",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "overC",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "caught"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "caught"
       }
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "seg": 2,
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
      "seg": 0,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:dropStep",
       "b": "x:runIn",
       "c": "x:standStill"
      }
     },
     {
      "n": 5,
      "type": "choice",
      "seg": 0,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 3,
      "correct": "true"
     }
    ]
   },
   {
    "id": "15.2",
    "level": 15,
    "glossary": [
     "centerFielder",
     "priority"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posSS",
       "pos3b"
      ],
      "fx": {
       "ball": {
        "to": "popIF",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF",
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "gapL",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF",
       "posLF",
       "posRF"
      ],
      "fx": {
       "ball": {
        "to": "gapL",
        "kind": "caught"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tap",
      "seg": 5,
      "target": "posCF",
      "scene": "field9"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 1,
      "correct": "false"
     }
    ]
   },
   {
    "id": "15.3",
    "level": 15,
    "glossary": [
     "catch15",
     "trap"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "caught"
       }
      },
      "call": "out"
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "drop"
       }
      },
      "call": "safe"
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tf",
      "seg": 4,
      "correct": "false"
     }
    ]
   },
   {
    "id": "15.4",
    "level": 15,
    "glossary": [
     "ballInFront",
     "warningTrack"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posLF",
       "posCF",
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF"
      ],
      "fx": {
       "ball": {
        "to": "overR",
        "kind": "ground"
       },
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF",
       "posCF",
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "track"
      ],
      "fx": {
       "track": true
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "track",
       "posCF"
      ],
      "fx": {
       "track": true,
       "ball": {
        "to": "overC",
        "kind": "caught"
       }
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "choice",
      "seg": 4,
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
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choice",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 5,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 4,
      "target": "track",
      "scene": "field9",
      "fx": {
       "track": true
      }
     }
    ]
   },
   {
    "id": "15.5",
    "level": 15,
    "glossary": [
     "gloveVisor"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posRF"
      ],
      "fx": {
       "ball": {
        "to": "rf",
        "kind": "fly"
       }
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF",
       "posCF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posRF"
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
      "seg": 2,
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
       "a": "x:sunVisor",
       "b": "x:coverFace",
       "c": "x:backToBall"
      }
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "choice",
      "seg": 3,
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
   "15.1",
   "15.2",
   "15.3",
   "15.4",
   "15.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "15.1",
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
    "lesson": "15.1",
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
    "lesson": "15.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "15.2",
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
    "lesson": "15.3",
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
    "lesson": "15.3",
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
    "lesson": "15.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "15.4",
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
    "lesson": "15.4",
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
    "lesson": "15.5",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "15.5",
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
    "lesson": "15.2",
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
 },
 {
  "n": 16,
  "free": false,
  "lessons": [
   {
    "id": "16.1",
    "level": 16,
    "glossary": [
     "battersBox",
     "stance",
     "grip"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true,
      "pitch": "mid"
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
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "choiceImg",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:stanceGood",
       "b": "x:outOfBox",
       "c": "x:lookDugout"
      }
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
      "type": "tf",
      "seg": 1,
      "correct": "false"
     }
    ]
   },
   {
    "id": "16.2",
    "level": 16,
    "glossary": [
     "checkedSwing"
    ],
    "demo": [
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true,
      "pitch": "mid"
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       0
      ],
      "call": "ball"
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true
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
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 0,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "umpire",
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
    "id": "16.3",
    "level": 16,
    "glossary": [
     "foulTip"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       0,
       1
      ],
      "call": "strike"
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       1,
       3
      ],
      "call": "k"
     },
     {
      "scene": "diamond",
      "highlight": [],
      "foulHit": "ground",
      "call": "foul"
     },
     {
      "scene": "field9",
      "highlight": [
       "posC"
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
      "correct": "true"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "umpire",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 5,
      "correct": "false"
     }
    ]
   },
   {
    "id": "16.4",
    "level": 16,
    "glossary": [
     "sacBunt",
     "runnersLane"
    ],
    "demo": [
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
       "home"
      ],
      "fx": {
       "ball": {
        "to": "bunt",
        "kind": "bunt"
       },
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "ball": {
        "to": "bunt",
        "kind": "bunt"
       }
      },
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "lane"
      ],
      "fx": {
       "lane": true
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "lane",
       "first"
      ],
      "fx": {
       "lane": true
      },
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "lane"
      ],
      "fx": {
       "lane": true,
       "runners": [
        "second"
       ]
      }
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "choice",
      "seg": 4,
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
      "type": "choice",
      "seg": 5,
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
      "target": "lane",
      "scene": "diamond",
      "fx": {
       "lane": true
      }
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     }
    ]
   },
   {
    "id": "16.5",
    "level": 16,
    "glossary": [
     "helmet"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "lane",
       "first"
      ],
      "fx": {
       "lane": true
      },
      "run": [
       "home",
       "first"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 4,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:batDrop",
       "b": "x:batFly",
       "c": "x:noHelmet"
      }
     }
    ]
   }
  ],
  "lessonIds": [
   "16.1",
   "16.2",
   "16.3",
   "16.4",
   "16.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "16.1",
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
    "lesson": "16.1",
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
    "lesson": "16.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "16.2",
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
    "lesson": "16.3",
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
    "lesson": "16.3",
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
    "lesson": "16.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "16.4",
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
    "lesson": "16.4",
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
    "lesson": "16.5",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "16.5",
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
    "lesson": "16.5",
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
 },
 {
  "n": 17,
  "free": false,
  "lessons": [
   {
    "id": "17.1",
    "level": 17,
    "glossary": [
     "intentionalWalk"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ],
      "call": "walk"
     },
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "second"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       0,
       0
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "choice",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 3,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "umpire",
      "seg": 2,
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
    "id": "17.2",
    "level": 17,
    "glossary": [
     "hitAndRun"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "run-lead1",
       "pos2b"
      ],
      "fx": {
       "runners": [
        "lead1"
       ]
      },
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "hole34"
      ],
      "fx": {
       "ball": {
        "to": "hole34",
        "kind": "ground"
       },
       "runners": [
        "mid12"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "third"
      ],
      "run": [
       "first",
       "second",
       "third"
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
      "n": 3,
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 0,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "choice",
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
    "id": "17.3",
    "level": 17,
    "glossary": [
     "squeeze",
     "suicideSqueeze"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "run-third"
      ],
      "fx": {
       "runners": [
        "third"
       ]
      }
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
      },
      "run": [
       "third",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-lead3"
      ],
      "fx": {
       "runners": [
        "lead3"
       ]
      },
      "run": [
       "third",
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-mid3h"
      ],
      "fx": {
       "runners": [
        "mid3h"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ],
      "fx": {
       "runners": [
        "third"
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
      "n": 3,
      "type": "tf",
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 4,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 0,
      "target": "third",
      "scene": "diamond",
      "fx": {
       "runners": [
        "third"
       ]
      }
     }
    ]
   },
   {
    "id": "17.4",
    "level": 17,
    "glossary": [
     "defensivePositioning",
     "infieldIn"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b",
       "posLF",
       "posCF",
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b",
       "home"
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
       "pos1b",
       "pos2b",
       "posSS",
       "pos3b"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posLF",
       "posCF",
       "posRF"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "dugout"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "seg": 1,
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
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 3,
      "correct": "true"
     },
     {
      "n": 5,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 0,
      "correct": "false"
     }
    ]
   },
   {
    "id": "17.5",
    "level": 17,
    "glossary": [
     "score",
     "walkOff"
    ],
    "demo": [
     {
      "scene": "board",
      "highlight": [
       "runs",
       "innings",
       "outs"
      ],
      "board": {
       "inning": 6,
       "half": "bottom",
       "outs": 1,
       "away": 3,
       "home": 3
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "run-second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      },
      "run": [
       "second",
       "third",
       "home"
      ],
      "call": "safe"
     },
     {
      "scene": "board",
      "highlight": [
       "runs"
      ],
      "board": {
       "inning": 6,
       "half": "top",
       "outs": 3,
       "away": 2,
       "home": 5
      }
     },
     {
      "scene": "board",
      "highlight": [
       "runs",
       "innings",
       "outs"
      ],
      "board": {
       "inning": 6,
       "half": "bottom",
       "outs": 2,
       "away": 4,
       "home": 4
      }
     }
    ],
    "activities": [
     {
      "n": 1,
      "type": "choice",
      "seg": 0,
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "umpire",
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
   "17.1",
   "17.2",
   "17.3",
   "17.4",
   "17.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "17.1",
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
    "lesson": "17.1",
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
    "lesson": "17.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "17.2",
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
    "lesson": "17.3",
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
    "lesson": "17.3",
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
    "lesson": "17.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "17.4",
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
    "lesson": "17.5",
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
    "lesson": "17.5",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "17.5",
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
    "lesson": "17.4",
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
 },
 {
  "n": 18,
  "free": false,
  "lessons": [
   {
    "id": "18.1",
    "level": 18,
    "glossary": [
     "slide"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "run": [
       "first",
       "second"
      ],
      "call": "safe"
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "runners": [
        "second"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "pos2b",
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 2,
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
      "type": "choice",
      "seg": 5,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 1,
      "correct": "true"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:slideFeet",
       "b": "x:slideHead",
       "c": "x:slideCrash"
      }
     }
    ]
   },
   {
    "id": "18.2",
    "level": 18,
    "glossary": [
     "mercyRule"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "run": [
       "third",
       "home"
      ],
      "call": "run"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home",
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tf",
      "seg": 2,
      "correct": "true"
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
      "type": "umpire",
      "seg": 2,
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
    "id": "18.3",
    "level": 18,
    "glossary": [
     "officialGame",
     "suspendedGame",
     "extraInning"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ],
      "call": "time"
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "type": "tf",
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 2,
      "correct": "false"
     }
    ]
   },
   {
    "id": "18.4",
    "level": 18,
    "glossary": [
     "substitution",
     "reentry"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "lineup",
      "highlight": [],
      "batter": 4,
      "marked": [
       1,
       2,
       3
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "lineup",
      "highlight": [],
      "batter": 6,
      "marked": [
       1,
       2,
       3,
       4
      ]
     },
     {
      "scene": "lineup",
      "highlight": [],
      "batter": 5,
      "marked": [
       1,
       2,
       3,
       4
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
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 5,
      "correct": "true"
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
      "type": "tf",
      "seg": 5,
      "correct": "true"
     }
    ]
   },
   {
    "id": "18.5",
    "level": 18,
    "glossary": [
     "courtesyRunner"
    ],
    "demo": [
     {
      "scene": "field9",
      "highlight": [
       "posC"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "first",
       "dugout"
      ],
      "run": [
       "home",
       "first"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "mound"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "n": 3,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 2,
      "correct": "true"
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
   }
  ],
  "lessonIds": [
   "18.1",
   "18.2",
   "18.3",
   "18.4",
   "18.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "18.1",
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
    "lesson": "18.1",
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
    "lesson": "18.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "18.2",
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
    "lesson": "18.3",
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
    "lesson": "18.3",
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
    "lesson": "18.3",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "18.4",
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
    "lesson": "18.4",
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
    "lesson": "18.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "18.5",
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
    "lesson": "18.5",
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
 },
 {
  "n": 19,
  "free": false,
  "lessons": [
   {
    "id": "19.1",
    "level": 19,
    "glossary": [
     "warmUp"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "first"
      ],
      "run": [
       "home",
       "first"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
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
      "n": 3,
      "type": "tf",
      "seg": 3,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 1,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:warmSoft",
       "b": "x:warmHard",
       "c": "x:sitting"
      }
     }
    ]
   },
   {
    "id": "19.2",
    "level": 19,
    "glossary": [
     "hydration",
     "shade",
     "rest"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "tf",
      "seg": 5,
      "correct": "false"
     },
     {
      "n": 6,
      "type": "choiceImg",
      "seg": 3,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:waterShade",
       "b": "x:noWater",
       "c": "x:jackets"
      }
     }
    ]
   },
   {
    "id": "19.3",
    "level": 19,
    "glossary": [
     "resetBreathing"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true,
      "pitch": "mid"
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "type": "tf",
      "seg": 1,
      "correct": "false"
     },
     {
      "n": 4,
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
      "n": 5,
      "type": "drag",
      "seg": 2,
      "place": {
       "breathe": "1",
       "look": "2",
       "phrase": "3",
       "next": "4"
      },
      "board": "order"
     },
     {
      "n": 6,
      "type": "tf",
      "seg": 2,
      "correct": "true"
     }
    ]
   },
   {
    "id": "19.4",
    "level": 19,
    "glossary": [
     "letItGo",
     "leader"
    ],
    "demo": [
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true,
      "pitch": "mid",
      "swing": true,
      "call": "strike",
      "count": [
       0,
       1
      ]
     },
     {
      "scene": "zone",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF"
      ],
      "fx": {
       "ball": {
        "to": "cf",
        "kind": "drop"
       }
      }
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "seg": 4,
      "correct": "false"
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 0,
      "correct": "true"
     },
     {
      "n": 5,
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
    "id": "19.5",
    "level": 19,
    "glossary": [
     "safetyLimits"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "set"
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
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
      "type": "choice",
      "seg": 4,
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
      "seg": 6,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 4,
      "type": "tf",
      "seg": 6,
      "correct": "false"
     },
     {
      "n": 5,
      "type": "tf",
      "seg": 1,
      "correct": "true"
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
   }
  ],
  "lessonIds": [
   "19.1",
   "19.2",
   "19.3",
   "19.4",
   "19.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "19.1",
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
    "lesson": "19.1",
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
    "lesson": "19.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "19.2",
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
    "lesson": "19.2",
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
    "lesson": "19.3",
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
    "lesson": "19.3",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "19.4",
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
    "lesson": "19.4",
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
    "lesson": "19.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "19.5",
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
    "lesson": "19.5",
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
 },
 {
  "n": 20,
  "free": false,
  "lessons": [
   {
    "id": "20.1",
    "level": 20,
    "glossary": [
     "finalReview"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "first",
       "second",
       "third",
       "home"
      ],
      "numbers": true
     },
     {
      "scene": "zone",
      "highlight": [],
      "showZone": true,
      "pitch": "mid",
      "call": "strike",
      "count": [
       0,
       1
      ]
     },
     {
      "scene": "zone",
      "highlight": [
       "count"
      ],
      "count": [
       3,
       2
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     }
    ],
    "activities": [
     {
      "n": 1,
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
      "n": 2,
      "type": "tf",
      "seg": 1,
      "correct": "true"
     },
     {
      "n": 3,
      "type": "tap",
      "seg": 1,
      "target": "third",
      "scene": "diamond"
     },
     {
      "n": 4,
      "type": "umpire",
      "seg": 2,
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
      "type": "drag",
      "seg": 2,
      "place": {
       "zone": "strikeSlot",
       "fourth": "walkSlot",
       "deflect": "foulSlot"
      },
      "board": "match"
     }
    ]
   },
   {
    "id": "20.2",
    "level": 20,
    "glossary": [
     "finalReview"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "fx": {
       "ball": {
        "to": "lf",
        "kind": "ground"
       }
      },
      "run": [
       "home",
       "first",
       "second"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "second",
       "first",
       "pos2b",
       "pos1b"
      ],
      "fx": {
       "runners": [
        "first"
       ]
      }
     },
     {
      "scene": "field9",
      "highlight": [
       "posCF",
       "third"
      ],
      "fx": {
       "runners": [
        "third"
       ]
      }
     },
     {
      "scene": "board",
      "highlight": [
       "runs"
      ],
      "board": {
       "inning": 3,
       "half": "top",
       "outs": 1,
       "away": 2,
       "home": 1
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
      "correct": "true"
     },
     {
      "n": 3,
      "type": "choice",
      "seg": 4,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
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
      "seg": 2,
      "target": "second",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first"
       ]
      }
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
   },
   {
    "id": "20.3",
    "level": 20,
    "glossary": [
     "finalReview"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": []
     },
     {
      "scene": "diamond",
      "highlight": [
       "second"
      ],
      "run": [
       "first",
       "second"
      ]
     },
     {
      "scene": "mound",
      "highlight": [],
      "pose": "release"
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
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
      "correct": "true"
     },
     {
      "n": 3,
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
      "n": 4,
      "type": "umpire",
      "seg": 1,
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
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a"
     },
     {
      "n": 6,
      "type": "tap",
      "seg": 2,
      "target": "bullpen",
      "scene": "field9",
      "fx": {
       "bullpen": true
      }
     }
    ]
   },
   {
    "id": "20.4",
    "level": 20,
    "glossary": [
     "foulTip",
     "walkOff"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "field9",
      "highlight": [
       "posC",
       "posCF",
       "posLF"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "dugout"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "all"
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
      "correct": "true"
     },
     {
      "n": 3,
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
      "n": 4,
      "type": "umpire",
      "seg": 1,
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
      "seg": 3,
      "target": "third",
      "scene": "diamond",
      "fx": {
       "runners": [
        "first",
        "third"
       ]
      }
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
   },
   {
    "id": "20.5",
    "level": 20,
    "glossary": [
     "hallOfFame",
     "graduation",
     "playBall"
    ],
    "demo": [
     {
      "scene": "diamond",
      "highlight": [
       "all"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
      ],
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
       "all"
      ]
     },
     {
      "scene": "diamond",
      "highlight": [
       "home"
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
      "seg": 2,
      "correct": "false"
     },
     {
      "n": 3,
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
      "n": 4,
      "type": "choiceImg",
      "seg": 2,
      "options": [
       "a",
       "b",
       "c"
      ],
      "correct": "a",
      "images": {
       "a": "x:teamField",
       "b": "x:tvAlone",
       "c": "x:trophyShelf"
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
      "type": "drag",
      "seg": 2,
      "place": {
       "body": "bodySlot",
       "mate": "mateSlot"
      },
      "board": "match"
     }
    ]
   }
  ],
  "lessonIds": [
   "20.1",
   "20.2",
   "20.3",
   "20.4",
   "20.5"
  ],
  "exam": [
   {
    "n": 1,
    "lesson": "20.1",
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
    "lesson": "20.1",
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
    "lesson": "20.2",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 4,
    "lesson": "20.2",
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
    "lesson": "20.3",
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
    "lesson": "20.3",
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
    "lesson": "20.3",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 8,
    "lesson": "20.4",
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
    "lesson": "20.4",
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
    "lesson": "20.4",
    "type": "choice",
    "options": [
     "a",
     "b",
     "c"
    ],
    "correct": "a"
   },
   {
    "n": 11,
    "lesson": "20.4",
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
    "lesson": "20.5",
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
