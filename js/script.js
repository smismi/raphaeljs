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

window.onload = function () {
    // Grab the data

    var data = [24, 22, 20, 23, 22, 22, 20],
        data2 = [12, 11, 12, 11, 12, 11, 13];



    // Draw
    var width = 800,
        height = 150,
        leftgutter = 0,
        bottomgutter = 0,
        topgutter = 0,
        color = "rgba(255,102,0,1)",
        color2 = "rgba(0,102,153,1)",
        r = Raphael("holder", width, height),
        min = Math.min.apply(Math, data.concat(data2)),
        max = Math.max.apply(Math, data.concat(data2));

        X = (width - leftgutter) / data.length,
        Y = (height - bottomgutter - topgutter) / max;

    console.log(min, max);

    var path = r.path().attr({stroke: color, "stroke-width": 2, "stroke-linejoin": "round"}),
        path2 = r.path().attr({stroke: color2, "stroke-width": 2, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
        bgp2 = r.path().attr({stroke: "none", opacity: .3, fill: color2}),
        blanket = r.set();


    day = draw(data);
    night = draw(data2);



    path.attr({path: day._p});
    path2.attr({path : night._p});

    bgp.attr({path: day._p});
    bgp2.attr({path: night._p});



    function draw(data) {

        var p;

        for (var i = 0, ii = data.length; i < ii; i++) {
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



//            var dot = r.circle(x, y, 4).attr({fill: "#333", stroke: color, "stroke-width": 2});

            blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
            var rect = blanket[blanket.length - 1];
            (function (x, y, data /*, dot */) {
                var timer, i = 0;
                rect.hover(function () {
//                    clearTimeout(leave_timer);
                    var side = "right";
//                    if (x + frame.getBBox().width > width) {
//                        side = "left";
//                    }
//                var ppp = r.popup(x, y, label, side, 1),
//                    anim = Raphael.animation({
//                        path: ppp.path,
//                        transform: ["t", ppp.dx, ppp.dy]
//                    }, 200 * is_label_visible);
//                    lx = label[0].transform()[0][1] + ppp.dx;
//                    ly = label[0].transform()[0][2] + ppp.dy;
//                    frame.show().stop().animate(anim);
//                    label[0].attr({text: data + " hit" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
//                    label[1].attr({text: lbl + " September 2008"}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
//                    dot.attr("r", 6);
//                    is_label_visible = true;
                }, function () {
//                    dot.attr("r", 4);
//                    leave_timer = setTimeout(function () {
//                        frame.hide();
//                        label[0].hide();
//                        label[1].hide();
//                        is_label_visible = false;
//                    }, 1);
                });
            })(x, y, data[i]/*, dot */);

        }



        bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
        bgpp = bgpp.concat([0, 0, 0, 0, "L", 0, height, "z"]);

        p = p.concat([x, y, x, y]);

        return {_p: p, _bgpp: bgpp};

    }


};