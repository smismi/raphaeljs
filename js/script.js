

function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
    var l1 = (p2x - p1x) / 2,
        l2 = (p3x - p2x) / 2,
        a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
        b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
    a = p1y < p2y ? Math.PI - a : a;
    b = p3y < p2y ? Math.PI - b : b;
    var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
        dx1 = l1 * Math.sin(alpha + a),
        dy1 = l1 * Math.cos(alpha + a),
        dx2 = l2 * Math.sin(alpha + b),
        dy2 = l2 * Math.cos(alpha + b);
    return {
        x1: p2x - dx1,
        y1: p2y + dy1,
        x2: p2x + dx2,
        y2: p2y + dy2
    };
}

// Grab the data
var labels = [1, 2, 3, 4, 5, 6, 7],
    data = [24, 22, 20, 23, 22, 22, 20],
    data2 = [15, 12, 13, 16, 12, 6, 4];




window.onload = function () {


    // Draw
    var width = 800,
        height = 150,
        leftgutter = 0,
        bottomgutter = 0,
        topgutter = 30,
        color = "rgba(255,102,0,1)",
        color2 = "rgba(0,102,153,1)",
        r = Raphael("holder", width, height),
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data.concat(data2)),
        Y = (height - bottomgutter - topgutter) / max;

    var blanket = r.set();

    var path = r.path().attr({stroke: color, "stroke-width": 3, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: 1, fill : 'url(./img/bg.png)'});

    var path2 = r.path().attr({stroke: color2, "stroke-width": 3, "stroke-linejoin": "round"}),
        bgp2 = r.path().attr({stroke: "none", opacity: 1, fill: "#fff"});

    draw_day = draw(data);
    draw_night = draw(data2);


    path.attr({path: draw_day._p});
    bgp.attr({path: draw_day._bgpp});

    bgp2.attr({path: draw_night._bgpp});
    path2.attr({path: draw_night._p});

    path.toFront();
    path2.toFront();
    blanket.toFront();


    function draw(data) {
        var p, bgpp;
        for (var i = 0, ii = labels.length; i < ii; i++) {
            var y = Math.round(height - bottomgutter - Y * data[i]),
                x = Math.round(leftgutter + X * (i + .5));
            if (!i) {
                p = ["M", x, y, "C", x, y];
                bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
            }
            if (i && i < ii - 1) {
                var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                    X0 = Math.round(leftgutter + X * (i - .5)),
                    Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                    X2 = Math.round(leftgutter + X * (i + 1.5));
                var a = getAnchors(X0, Y0, x, y, X2, Y2);
                p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
                bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            }

            blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
            var rect = blanket[blanket.length - 1];
        }




        p = p.concat([x, y, x, y]);
        bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);

        return {_p: p, _bgpp: bgpp}
    }
//    frame.toFront();
};