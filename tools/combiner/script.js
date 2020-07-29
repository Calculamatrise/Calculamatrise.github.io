var input1 = document.getElementById('input1'),
    input2 = document.getElementById('input2'),
    output = document.getElementById('output'),
    physic,scenery,powerup,
    trackcode = '',
    copyenable = true;
output.addEventListener('click',exec);
function exec() {
  var in1 = input1.value.toString().split('#',3),
      in2 = input2.value.toString().split('#',3),
      p1,p2,p3;
  if(check(in2[0]) === '')p1 = '';else p1 = ',';
  if(check(in2[1]) === '')p2 = '';else p2 = ',';
  if(check(in2[2]) === '')p3 = '';else p3 = ',';
  physic = check(in1[0]) + p1 + check(in2[0]) + ',';
  scenery = check(in1[1]) + p2 + check(in2[1]) + ',';
  powerup = check(in1[2]) + p3 + check(in2[2]) + ',';
  trackcode = physic.slice(0,-1) + '#' + scenery.slice(0,-1) + '#' + powerup.slice(0,-1);
  output.innerHTML = trackcode;
  output.select();
}
function check(str) {
  if(str === undefined) return '';
  else return str;
}
output.addEventListener('dblclick',copy);
function copy() {
  if (copyenable === true) {
    output.select();
    document.execCommand('copy');
  }
  copyenable = false;
  output.innerHTML = 'Code copied.';
  setTimeout(function() {
    output.innerHTML = trackcode;
    copyenable = true;
    output.blur();
  },500);
}
input1.addEventListener('click',function() {
  input1.select();
});
input2.addEventListener('click',function() {
  input2.select();
});
window.addEventListener('keydown',function(e) {
  var key = e.keyCode || e.which;
  if (key == 13) exec();
  if (key == 67) copy();
});
output.addEventListener('focusout',function() {
  if(output.innerHTML == '##') {
    output.innerHTML = '';
  }
});