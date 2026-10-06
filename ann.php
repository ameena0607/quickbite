<?php

// Indexed Array
$fruits = array("Apple", "Mango", "Orange");

echo "Indexed Array:<br>";

foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

// Associative Array
$student = array(
    "Name" => "Ameena",
    "Age" => 20,
    "Course" => "MCA"
);

echo "<br>Associative Array:<br>";

foreach ($student as $key => $value) {
    echo $key . " : " . $value . "<br>";
}

// Multidimensional Array
$marks = array(
    array("Ameena", 85),
    array("Rahul", 90)
);

echo "<br>Multidimensional Array:<br>";

for ($i = 0; $i < 2; $i++) {
    echo $marks[$i][0] . " - " . $marks[$i][1] . "<br>";
}

?>