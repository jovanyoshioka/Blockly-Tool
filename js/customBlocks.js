const MOVEMENT_BLOCK_COLOR = 180;
const VALID_VAR_CHARS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
];

Blockly.defineBlocksWithJsonArray([
  // Any connected blocks are executed on run.
  {
    "type": "run",
    "message0": "Run",
    "colour": "315",
    "nextStatement": null
  },
  {
    "type": "run_img",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/play.svg",
        "width": 25,
        "height": 40,
        "alt": "Play"
      }
    ],
    "colour": "315",
    "nextStatement": null
  },
  // Block for character moving forward one unit.
  {
    "type": "movement_move_forward",
    "message0": "move forward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Block for character turning left.
  {
    "type": "movement_turn_left",
    "message0": "turn left \u21BA",
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  {
    "type": "movement_turn_right",
    "message0": "turn right \u21BB",
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Image block for character moving forward one unit.
  {
    "type": "movement_move_forward_img",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/rightArrow.svg",
        "width": 35,
        "height": 50,
        "alt": "Right Arrow"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Image block for character turning left.
  {
    "type": "movement_turn_left_img",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/leftCurvedArrow.svg",
        "width": 35,
        "height": 50,
        "alt": "Left Curved Arrow"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Image block for character turning right.
  {
    "type": "movement_turn_right_img",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/rightCurvedArrow.svg",
        "width": 35,
        "height": 50,
        "alt": "Right Curved Arrow"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Image "for" loop.
  {
    "type": "controls_repeat_ext_img",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/repeatArrow.svg",
        "width": 35,
        "height": 50,
        "alt": "Two Curved Arrows"
      },
      {
        "type": "input_value",
        "name": "TIMES"
      },
      {
        "type": "input_dummy"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "loop_blocks",
    "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
  },
  // Image block for numbers.
  {
    "type": "math_number_0",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberZero.svg",
        "width": 35,
        "height": 45,
        "alt": "0"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_1",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberOne.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_2",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberTwo.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_3",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberThree.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_4",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberFour.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_5",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberFive.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_6",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberSix.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_7",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberSeven.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_8",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberEight.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  },
  {
    "type": "math_number_9",
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "../assets/custom_block_icons/numberNine.svg",
        "width": 35,
        "height": 45,
        "alt": "1"
      }
    ],
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}"
  }
]);

// TEMPORARY
function dummy() {}

// Character moving forward.
moveForward = function(block) {
  // Return move forward JavaScript code.
  return "moveForward();\n";
};
Blockly.JavaScript["movement_move_forward"] = moveForward;
Blockly.JavaScript["movement_move_forward_img"] = moveForward;

// Character turning left.
turnLeft = function(block) {
  // Return turn left JavaScript code.
  return "turnLeft();\n";
};
Blockly.JavaScript["movement_turn_left"] = turnLeft;
Blockly.JavaScript["movement_turn_left_img"] = turnLeft;

// Character turning right.
turnRight = function(block) {
  // Return turn right JavaScript code.
  return "turnRight();\n";
};
Blockly.JavaScript["movement_turn_right"] = turnRight;
Blockly.JavaScript["movement_turn_right_img"] = turnRight;

// Run block.
Blockly.JavaScript["run"] = function(block) {
  return "dummy();\n";
}
Blockly.JavaScript["run_img"] = function(block) {
  return "dummy();\n";
}

// Image block for numbers.
mathNumber = function(block) {
  return ["dummy();\n", Blockly.JavaScript.ORDER_NONE];
};
for (var i = 0; i <= 9; i++)
  Blockly.JavaScript["math_number_" + i] = mathNumber;

// Image "for" loop.
Blockly.JavaScript["controls_repeat_ext_img"] = function(block) {
  // Times
  var times_obj = block.getInputTargetBlock("TIMES");
  var times = 0;
  if (times_obj !== null)
    times = parseInt(times_obj.type.substring(12));

  // Statements
  var blocks_obj = block.getInputTargetBlock('DO');
  var statements = "";
  if (blocks_obj)
    statements = Blockly.JavaScript.blockToCode(blocks_obj);
  // Re-highlight for loop block.
  statements += "highlightBlock('" + block.id + "');";

  // Set step variable name based on block's id.
  // Note: Need unique variable names to prevent step conflicts in multi-dimensional arrays.
  var loopID = block.id;
  var varName = "";
  for (var i = 0; i < loopID.length; i++)
  {
    for (var j = 0; j < VALID_VAR_CHARS.length; j++)
    {
      if (loopID[i] == VALID_VAR_CHARS[j])
      {
        varName += loopID[i];
        break;
      }
    }
  }
  
  return "for (var " + varName + " = 0; " + varName + " < " + parseInt(times) + "; " + varName + "++) {" + statements + " }";
}