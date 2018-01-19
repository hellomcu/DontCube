
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //var layer = new HelloWorldLayer();
        var layer = createGameLayer();
        this.addChild(layer);
    }
});

function createGameLayer() {
    var GameLayer = cc.Layer.extend({
        isStart:false,
        space: null,
        timeRemain: 0,
        stepTime: 1 / 60.0,
        ctor:function () {
            //////////////////////////////
            // 1. super init first
            this._super();

            this.initPhysics();



            this.addNewSpriteAtPosition(cc.p(100, 400));
            this.addNewSpriteAtPosition(cc.p(130, 100));
            this.addNewSpriteAtPosition(cc.p(200, 100));
            this.addNewSpriteAtPosition(cc.p(220, 110));


            this.addMyBox();


        },

        initPhysics: function () {
            var winSize = cc.director.getWinSize();
            this.space = new cp.Space();

            this.space.addCollisionHandler(1, 1, this.collisionBegin.bind(this), this.collisionPre.bind(this), this.collisionPost.bind(this), this.collisionSeparate.bind(this));


            this.setupDebugNode();

            this.space.gravity = cp.v(0, 0);
            var staticBody = this.space.staticBody;

            var walls = [new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(winSize.width, 0), 10),
                new cp.SegmentShape(staticBody, cp.v(0,winSize.height), cp.v(winSize.width, winSize.height), 10),
                new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0, winSize.height), 10),
                new cp.SegmentShape(staticBody, cp.v(winSize.width,0), cp.v(winSize.width, winSize.height), 10)

            ];
            for (var i=0; i<walls.length; i++) {
                var shape = walls[i];
                shape.setElasticity(1);
                shape.setFriction(0);
                shape.group = 1;
                shape.setCollisionType(1)
                this.space.addStaticShape(shape)
            }
        },

        setupDebugNode: function () {
            this._debugNode = new cc.PhysicsDebugNode(this.space);
            this._debugNode.visible = true;
            this.addChild(this._debugNode);
        },

        onEnter: function () {
            this._super();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this.onTouchBegan
            }, this);
        },

        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = touch.getLocation();
            //target.addNewSpriteAtPosition(location);

            return false;
        },

        onExit: function () {
            this._super();
            cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
        },

        collisionBegin : function (arbiter, space) {
            cc.log("collisionBegin...");
            this.isStart = false;
            this.unscheduleAllCallbacks();
            var menu = this.createGameoverMenu();
            this.addChild(menu);
            return true;
        },

        collisionPre : function (arbiter, space) {
           // cc.log("collisionPre...");
            return true;
        },

        collisionPost : function (arbiter, space) {
           // cc.log("collisionPost...");
            return true;
        },

        collisionSeparate : function (arbiter, space) {
            //cc.log("collisionSeparate...");
            return true;
        },

        addMyBox: function () {
            var winSize = cc.director.getWinSize();
            var position = cc.p(winSize.width / 2, winSize.height / 2);
            var body = new cp.Body(100, cp.momentForBox(100, 48, 48));
            body.setPos(position);
            this.space.addBody(body);

            var shape = new cp.BoxShape(body, 48, 48);
            shape.setElasticity(0);
            shape.setFriction(0);

            shape.setCollisionType(1);
            shape.group = 2;

            this.space.addShape(shape);

            var sprite = new cc.PhysicsSprite(res.my_box);
            sprite.setBody(body);
            sprite.setPosition(cc.p(position.x, position.y));

            this.addMoveEvent(sprite);
            this.addChild(sprite);
        },

        addNewSpriteAtPosition: function (p) {
            var box = this.createBox(1, p);
            this.addChild(box);
            box.body.applyImpulse(cp.v(15000, 11500), cp.v(0, 0));

        },

        createBox: function (group, position) {
            var body = new cp.Body(100, cp.momentForBox(100, 72, 72));
            body.setPos(position);
            this.space.addBody(body);

            var shape = new cp.BoxShape(body, 72, 72);
            shape.setElasticity(1);
            shape.setFriction(0);

            shape.setCollisionType(1);
            shape.group = group;

            this.space.addShape(shape);

            var sprite = new cc.PhysicsSprite(res.logo_png);
            sprite.setBody(body);
            sprite.setPosition(cc.p(position.x, position.y));


            return sprite;
        },

        addMoveEvent : function (target){
            var _this = this;
            var touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
                swallowTouches: true,

                onTouchBegan: function (touch, event) {
                    var pos = touch.getLocation();
                    var target = event.getCurrentTarget();
                    if ( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {

                        if (!this.isStart) {
                            _this.scheduleUpdate();
                        }
                        return true;
                    }
                    return false;

                },
                onTouchMoved: function (touch, event) {
                    var pos = touch.getLocation();
                    var target = event.getCurrentTarget();
                    if ( cc.rectContainsPoint(target.getBoundingBox(), pos) ) {

                        target.setPosition(pos);

                        return true;
                    }
                    return false;

                }
            });

            cc.eventManager.addListener(touchListener, target);
        },

        createGameoverMenu: function () {
            cc.MenuItemFont.setFontName("Times New Roman");
            cc.MenuItemFont.setFontSize(32);
            var item1 = new cc.MenuItemFont("测试", this.menuClickCallback, this);
            var menu = new cc.Menu(item1);
            return menu;
        },
        menuClickCallback: function (render) {

        },
        update: function (dt) {
            this.timeRemain += dt;
            while (this.timeRemain - this.stepTime >= 0) {
                this.space.step(this.stepTime);
                this.timeRemain -= this.stepTime;
            }
            //this.space.step(timeStep);
        }
    });

    return new GameLayer();
}

