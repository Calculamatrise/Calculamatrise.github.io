// This code isn't going to be very readable probably

var track;

function decode(str) {
  track = {
    points: [],
    seperators: [],
    powerupData: [],
    noLines: false,
    noScenery: false
  }
  var pos = 0;
  var next = 2;
  var isX = true;
  var hashCount = 0;
  var currentPoint;
  if (str[0] == "#") {
    pos = 1;
    next = 1;
    hashCount++;
    track.noLines = true;
    console.log("asdf")
  }
  while(hashCount < 2 && next < str.length) {
    if (str[next] == " " || str[next] == "," || str[next] == "#") {
      if (next != pos) {
        if (isX) {
          currentPoint = [parseInt(str.substring(pos, next), 32), 0];
          track.points.push(currentPoint);
        }
        else {
          currentPoint[1] = parseInt(str.substring(pos, next), 32);
          track.seperators += str[next];
        }
        isX = !isX;
        pos = next + 1;
      }
      else track.noScenery = true;
      if (str[next] == "#") hashCount++;
    }
    next++;
  }
  if (next != str.length) {
    var pows = str.substr(next).split(",");
    for (let p of pows) {
      var nums = p.split(" ");
      track.points.push([parseInt(nums[1], 32), parseInt(nums[2], 32)]);
      nums.splice(1, 2)
      track.powerupData.push(nums);
    }
  }
}


function encode() {
  var str = "";
  var i;
  if (track.noLines) str += "#";
  for (i = 0; i < track.seperators.length; i++) {
    str += track.points[i][0].toString(32) + " " + track.points[i][1].toString(32) + track.seperators[i];
  }
  if (track.noScenery) str += "#";
  for (let p of track.powerupData) {
    str += p[0] + " " + track.points[i][0].toString(32) + " " + track.points[i][1].toString(32);
    for (let i = 1; i < p.length; i++) str += " " + p[i];
    i++;
    if (i != track.points.length) str += ",";
  }
  return str;
}

function move(x, y) {
  for (let p of track.points) {
    p[0] += x;
    p[1] += y;
  }
}

document.getElementById("moveButton").onclick = function() {
  decode(document.getElementById("inputBox").value);
  move(parseInt(document.getElementById("xMove").value) || 0, -parseInt(document.getElementById("yMove").value) || 0);
  document.getElementById("inputBox").value = encode();
}