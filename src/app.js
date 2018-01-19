//
// var HelloWorldLayer = cc.Layer.extend({
//     sprite:null,
//     ctor:function () {
//         //////////////////////////////
//         // 1. super init first
//         this._super();
//
//         /////////////////////////////
//         // 2. add a menu item with "X" image, which is clicked to quit the program
//         //    you may modify it.
//         // ask the window size
//         var size = cc.winSize;
//
//         /////////////////////////////
//         // 3. add your codes below...
//         // add a label shows "Hello World"
//         // create and initialize a label
//         var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
//         // position the label on the center of the screen
//         helloLabel.x = size.width / 2;
//         helloLabel.y = size.height / 2 + 200;
//         // add the label as a child to this layer
//         this.addChild(helloLabel, 5);
//
//         // add "HelloWorld" splash screen"
//         this.sprite = new cc.Sprite(res.HelloWorld_png);
//         this.sprite.attr({
//             x: size.width / 2,
//             y: size.height / 2
//         });
//         this.addChild(this.sprite, 0);
//
//         return true;
//     }
// });

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //var layer = new HelloWorldLayer();
        var layer = createStartGameLayer();
        this.addChild(layer);
        this.addChild(createAudioLayer());
    }
});

function createStartGameLayer() {
    var StartGameLayer = cc.LayerColor.extend({

        ctor:function () {
            //////////////////////////////
            // 1. super init first
            this._super();
            var size = cc.winSize;
            var width = (size.width - 30) / 2;
            var height = (size.height - 40) / 3;
            this.init(cc.color(0, 153, 255, 255), width, height);

            var startLabel = new cc.LabelTTF("开始", "Arial", 24);
            // startLabel.anchorX = 0.5;
            // startLabel.anchorY = 0.5;
            // position the label on the center of the screen
            startLabel.x = this.width / 2;
            startLabel.y = this.height / 2;
            // add the label as a child to this layer

            this.x = 10;
            this.y = size.height - this.height - 10;
            this.addChild(startLabel, 5);
            addTouchEvent(this, function (touch, event) {
                cc.director.pushScene(new GameScene());
            });
            return true;
        }
    });

    return new StartGameLayer();
}

function createAudioLayer() {
    var StartGameLayer = cc.LayerColor.extend({
        sprite:null,
        ctor:function () {
            //////////////////////////////
            // 1. super init first
            this._super();
            var size = cc.winSize;
            var width = (size.width  - 30) / 2;
            var height = (size.height - 40) / 3;

            this.init(cc.color(0, 153, 255, 255), width, height);

            var startLabel = new cc.LabelTTF("声音\n关", "Arial", 24);
            // startLabel.anchorX = 0.5;
            // startLabel.anchorY = 0.5;
            // position the label on the center of the screen
            startLabel.x = this.width / 2;
            startLabel.y = this.height / 2;
            // add the label as a child to this layer
            console.log(this.anchorX);
            this.x = 20 + this.width;
            this.y = size.height - this.height - 10;
            this.addChild(startLabel, 5);
            addTouchEvent(this, function (touch, event) {
                console.log("touch...");
            });
            return true;
        }
    });

    return new StartGameLayer();
}

function addTouchEvent(target, callback){
    var touchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
        swallowTouches: true,

        onTouchBegan: function (touch, event) {
            var pos = touch.getLocation();
            var target = event.getCurrentTarget();
            if ( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {
                if (callback != null){
                    callback(touch, event);
                }
                return true;
            }
            return false;

        }});

        cc.eventManager.addListener(touchListener, target);
}