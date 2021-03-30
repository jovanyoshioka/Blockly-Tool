const MOVEMENT_BLOCK_COLOR = 180;

Blockly.defineBlocksWithJsonArray([
  // Block for character moving forward one unit.
  {
    "type": "movement_move_forward",
    "message0": "move forward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
  // Block for character turning left or right.
  {
    "type": "movement_turn_lr",
    "message0": "turn %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          ["left", "Left"],
          ["right", "Right"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": MOVEMENT_BLOCK_COLOR
  },
]);

// Character moving forward.
Blockly.JavaScript["movement_move_forward"] = function(block)
{
  // Return move forward JavaScript code.
  return "moveForward();\n";
};

// Character turning left or right.
Blockly.JavaScript["movement_turn_lr"] = function(block)
{
  // Get turn value, left or right.
  var dir = block.getFieldValue("DIRECTION");
  return "turn" + dir + "();\n";
};