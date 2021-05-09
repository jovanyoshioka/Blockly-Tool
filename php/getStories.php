<?php

  // TEMPORARY: GRAB STORIES FROM DATABASE LATER.
  echo '
    <tr>
      <td>The Very Hungry Caterpillar</td>
      <td>Eric Carle</td>
      <td>Default</td>
      <td class="hideWhenSelected">
        <input type="button" onclick="openModal(\'previewModal\')" class="orangeBtn" value="Preview" />
        <input type="button" onclick="selectStory(this.parentElement.parentElement)" class="orangeBtn" value="Select" />
      </td>
      <td class="showWhenSelected">
        <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
      </td>
    </tr>
    <tr>
      <td>Green Eggs and Ham</td>
      <td>Dr. Seuss</td>
      <td>Default</td>
      <td class="hideWhenSelected">
        <input type="button" onclick="openModal(\'previewModal\')" class="orangeBtn" value="Preview" />
        <input type="button" onclick="selectStory(this.parentElement.parentElement)" class="orangeBtn" value="Select" />
      </td>
      <td class="showWhenSelected">
        <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
      </td>
    </tr>
    <tr>
      <td>Magic Tree House #1, Dinosaurs Before Dark</td>
      <td>Mary Pope Osborne</td>
      <td>Jennifer Cox, Cedar Bluff Elementary School</td>
      <td class="hideWhenSelected">
        <input type="button" onclick="openModal(\'previewModal\')" class="orangeBtn" value="Preview" />
        <input type="button" onclick="selectStory(this.parentElement.parentElement)" class="orangeBtn" value="Select" />
      </td>
      <td class="showWhenSelected">
        <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
      </td>
    </tr>
    <tr>
      <td>Green Eggs and Ham</td>
      <td>Dr. Seuss</td>
      <td>Default</td>
      <td class="hideWhenSelected">
        <input type="button" onclick="openModal(\'previewModal\')" class="orangeBtn" value="Preview" />
        <input type="button" onclick="selectStory(this.parentElement.parentElement)" class="orangeBtn" value="Select" />
      </td>
      <td class="showWhenSelected">
        <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
      </td>
    </tr>
    <tr>
      <td>Green Eggs and Ham</td>
      <td>Dr. Seuss</td>
      <td>Default</td>
      <td class="hideWhenSelected">
        <input type="button" onclick="openModal(\'previewModal\')" class="orangeBtn" value="Preview" />
        <input type="button" onclick="selectStory(this.parentElement.parentElement)" class="orangeBtn" value="Select" />
      </td>
      <td class="showWhenSelected">
        <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
      </td>
    </tr>
  ';

?>