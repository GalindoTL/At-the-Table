(function () {
  var h = React.createElement;
  function I(paths) {
    return function (props) {
      props = props || {};
      var size = props.size || 24, color = props.color || "currentColor";
      return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
        paths.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
    };
  }
  window.Plus = I([["line",{x1:12,y1:5,x2:12,y2:19}],["line",{x1:5,y1:12,x2:19,y2:12}]]);
  window.Minus = I([["line",{x1:5,y1:12,x2:19,y2:12}]]);
  window.X = I([["line",{x1:18,y1:6,x2:6,y2:18}],["line",{x1:6,y1:6,x2:18,y2:18}]]);
  window.Check = I([["polyline",{points:"20 6 9 17 4 12"}]]);
  window.Trash2 = I([["polyline",{points:"3 6 5 6 21 6"}],["path",{d:"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"}],["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"}]]);
  window.ShoppingBasket = I([["path",{d:"M5.5 21h13a2 2 0 0 0 2-1.6L22 10H2l1.5 9.4A2 2 0 0 0 5.5 21z"}],["path",{d:"M7 10l3-7"}],["path",{d:"M17 10l-3-7"}],["line",{x1:9,y1:14,x2:9,y2:17}],["line",{x1:15,y1:14,x2:15,y2:17}]]);
  window.BookOpen = I([["path",{d:"M2 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"}],["path",{d:"M22 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"}]]);
  window.Pencil = I([["path",{d:"M12 20h9"}],["path",{d:"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"}]]);
  window.ChefHat = I([["path",{d:"M6 13.87A4 4 0 0 1 7.4 6a5 5 0 0 1 9.2 0A4 4 0 0 1 18 13.87V18H6z"}],["line",{x1:6,y1:21,x2:18,y2:21}]]);
  window.Snowflake = I([["line",{x1:12,y1:2,x2:12,y2:22}],["line",{x1:2,y1:12,x2:22,y2:12}],["line",{x1:5,y1:5,x2:19,y2:19}],["line",{x1:19,y1:5,x2:5,y2:19}]]);
  window.Printer = I([["polyline",{points:"6 9 6 2 18 2 18 9"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}],["rect",{x:6,y:14,width:12,height:8}]]);
  window.CalendarRange = I([["rect",{x:3,y:4,width:18,height:18,rx:2}],["line",{x1:16,y1:2,x2:16,y2:6}],["line",{x1:8,y1:2,x2:8,y2:6}],["line",{x1:3,y1:10,x2:21,y2:10}],["path",{d:"M8 14h.01"}],["path",{d:"M12 14h4"}]]);
  window.RotateCcw = I([["polyline",{points:"1 4 1 10 7 10"}],["path",{d:"M3.5 15a9 9 0 1 0 2.1-9.4L1 10"}]]);
  window.Users = I([["path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}],["circle",{cx:9,cy:7,r:4}],["path",{d:"M23 21v-2a4 4 0 0 0-3-3.9"}],["path",{d:"M16 3.1a4 4 0 0 1 0 7.8"}]]);
  window.Download = I([["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:12,y1:15,x2:12,y2:3}]]);
  window.Upload = I([["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"17 8 12 3 7 8"}],["line",{x1:12,y1:3,x2:12,y2:15}]]);
  window.DatabaseBackup = I([["ellipse",{cx:12,cy:5,rx:9,ry:3}],["path",{d:"M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"}],["path",{d:"M3 11v6c0 1.7 4 3 9 3"}]]);
  window.AlertTriangle = I([["path",{d:"M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"}],["line",{x1:12,y1:9,x2:12,y2:13}],["line",{x1:12,y1:17,x2:12.01,y2:17}]]);
})();
