// linearInterpolation also means dividing it evenly
function linearInterpolate(A, B, t) { return A + (B - A) * t; }

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linearInterpolate(A.x, B.x, t),
        y: linearInterpolate(A.y, B.y, t),
        offset: t
      }
    }
  }

  return null;
}

function polyIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + ", " + B + ", " + alpha + ")";

}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}

// load local json using pure js
function loadJSON(file, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}