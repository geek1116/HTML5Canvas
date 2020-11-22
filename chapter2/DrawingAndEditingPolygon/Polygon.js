const Point = function (x, y) {
    this.x = x;
    this.y = y;
}

const Polygon = function(centerX, centerY, radius, sides, startAngle) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.sides = sides;
    this.startAngle = startAngle;
}

Polygon.prototype = {
    getPoints: function() {
        let points = [], angle = this.startAngle || 0;

        for(let i = 0; i < this.sides; ++i) {
            points.push(new Point(this.x + this.radius * Math.cos(angle), this.y - this.radius * Math.sin(angle)));
            angle += Math.PI * 2 / this.sides;
        }
        return points;
    },

    createPath: function(context) {
        let points = this.getPoints();

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for(let i = 1; i < points.length; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
    },

    draw: function(context) {
        context.save();
        this.createPath(context);
        context.fill();
        context.restore();
    },

    move: function(x, y) {
        this.x = x;
        this.y = y;
    }
}