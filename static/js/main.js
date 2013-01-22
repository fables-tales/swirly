/*jslint sloppy: true, vars: true, plusplus: true, browser: true */


var holder = document.getElementById("holder");
var width = document.body.clientWidth;
var height = document.body.clientHeight;

holder.innerHTML = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
var canvas = document.getElementById("canvas");
var ctx    = canvas.getContext("2d");

function clear() {
    ctx.globalCompositeOperation = "darker";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 3000, 3000);
    ctx.globalCompositeOperation = "lighter";
}


function make_swirly(x, y, r_start, r_converge, velocity) {
    return {
        "radius": r_start,
        "point_size": 2,
        "center_x": x,
        "center_y": y,
        "past_points": [],
        "max_angles": 120,
        "max_intensity": 200,
        "current_angle": 0,
        "velocity": Math.PI / velocity,
        "converge_rate": 3,
        "r_converge": r_converge,
        "update": function () {
            this.past_points.push(this.compute_point(this.current_angle, this.radius));
            while (this.past_points.length > this.max_angles) {
                this.past_points.shift();
            }
            this.current_angle += this.velocity;
            if (Math.random() < 0.1) {
                if (this.radius < this.r_converge) {
                    this.radius += Math.random() * this.converge_rate + this.converge_rate;
                } else {
                    this.radius -= Math.random() * this.converge_rate + this.converge_rate;
                }
                this.past_points.push(this.compute_point(this.current_angle, this.radius));
            }
        },

        "draw": function () {
            var i;
            for (i = 1; i < this.past_points.length; i++) {
                var intensity = this.max_intensity * (i - 1) / this.max_angles;
                var previous_point = this.past_points[i - 1];
                var current_point = this.past_points[i];
                this.arc_from_to(previous_point, current_point, "rgb(0,0," + intensity + ")");
            }
        },

        "compute_point": function (angle, radius) {
            var x = this.center_x + Math.sin(angle) * radius;
            var y = this.center_y + Math.cos(angle) * radius;
            return {"x": x, "y": y};
        },

        "arc_from_to": function (previous_point, current_point, color) {
            ctx.lineWidth = this.point_size;
            ctx.beginPath();
            ctx.strokeStyle = color;

            var start_point = previous_point;
            var end_point   = current_point;
            ctx.moveTo(start_point.x, start_point.y);
            ctx.lineTo(end_point.x, end_point.y);
            ctx.stroke();
        }
    };
}

var swirlies = [];

function setup() {
    var i;
    for (i = 0; i < 15; i++) {
        var start_radius = Math.random() * 50 + 30;
        var target_radius = Math.random() * 200 + 30;
        var velocity = Math.random() * 140 + 60;
        swirlies.push(make_swirly(width / 2, height / 2, start_radius, target_radius, velocity));
    }
    clear();
}
var lastLoop = new Date().getTime();


function loop() {
    var thisLoop = new Date().getTime();
    var fps = Math.round(1000 / (thisLoop - lastLoop));
    var i;
    lastLoop = thisLoop;
    document.getElementById("details").innerHTML = fps;
    for (i = 0; i < swirlies.length; i++) {
        swirlies[i].update();
    }

    clear();

    for (i = 0; i < swirlies.length; i++) {
        swirlies[i].draw();
    }
}

setup();
setInterval(loop, 1000.0 / 30);
