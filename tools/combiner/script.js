var input1 = document.getElementById("input1"),
    input2 = document.getElementById("input2"),
    output = document.getElementById("output");

function run() {
  i1 = input1.value.split('#');
  i2 = input2.value.split('#');
  combined = `${i1[0]},${i2[0]}#${i1[1]},${i2[1]}#${i1[2]},${i2[2]}`;
  output.value = combined;
  output.select();
}

function copy() {
  output.select();
  document.execCommand('copy');
}

input1.addEventListener('click',function() {
  input1.select();
});

input2.addEventListener('click',function() {
  input2.select();
});

output.addEventListener('click',function() {
  output.select();
});

window.addEventListener('keydown',function(e) {
  var key = e.keyCode || e.which;
  if (key == 13) run();
  if (key == 67) copy();
});