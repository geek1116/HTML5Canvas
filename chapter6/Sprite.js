class Sprite {
    constructor(name, painter, behaviors) {
        if(name !== undefined) this.name = name;
        if(painter !== undefined) this.painter = painter;

        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.visible = true;
        this.animating = false;
        this.behaviors = behaviors || [];
    }

    paint(context) {
        if(this.painter && this.visible) {
            this.painter.paint(this, context);
        }
    }

    update(context, time) {
        this.behaviors.forEach(behavior => {
            behavior.execute(this, context, time);
        });
    }
}