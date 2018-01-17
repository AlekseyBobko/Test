"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DRUMS_COUNT = 5;
var MAIN_CONTAINER_WIDTH = 1025;
var MAIN_CONTAINER_HEIGHT = 790;
var FRAME_BORDER_BOTTOM_WIDTH = 150;
var SLOT_IMG_WIDTH = 156;
var SLOT_IMG_HEIGHT = 142;

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);

        this.width = MAIN_CONTAINER_WIDTH;
        this.height = MAIN_CONTAINER_HEIGHT;
        this.stopCount = 0;
        this.drumsCount = DRUMS_COUNT;

        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { backgroundColor: 0xffffff });
        this.stage = new PIXI.Container();

        this._loadSounds();

        new Loader(this.init.bind(this));
    }

    _createClass(Controller, [{
        key: "init",
        value: function init() {
            document.body.appendChild(this.renderer.view);
            this.renderer.render(this.stage);

            this.createBackgroundRepeat();
            this.createBackground();
            this.createDrums();
            this.createButton();
            this.animate();
        }
    }, {
        key: "stageAdd",
        value: function stageAdd(item) {
            this.stage.addChild(item);
            this.renderer.render(this.stage);
        }
    }, {
        key: "createBackground",
        value: function createBackground() {
            var bg = new PIXI.Sprite(PIXI.loader.resources["BG"].texture);
            bg.width = MAIN_CONTAINER_WIDTH;
            bg.height = MAIN_CONTAINER_HEIGHT - FRAME_BORDER_BOTTOM_WIDTH;
            this.stageAdd(bg);
        }
    }, {
        key: "createBackgroundRepeat",
        value: function createBackgroundRepeat() {
            var texture = PIXI.Texture.fromImage('images/winningFrameBackground.jpg');
            var sprite = new PIXI.extras.TilingSprite(texture, 950, 590);
            sprite.position.x = 32;
            sprite.position.y = 38;
            this.stageAdd(sprite);
        }
    }, {
        key: "createDrums",
        value: function createDrums() {
            this.drums = new Drums(this.stageAdd.bind(this));
            this.stageAdd(this.drums.container);
        }
    }, {
        key: "createButton",
        value: function createButton() {
            this.button = new Button(this.onSpin.bind(this), this.buttonClickSoundId);
            this.stageAdd(this.button.container);
        }
    }, {
        key: "onSpin",
        value: function onSpin() {
            this.stopCount = 0;
            this.drums.rotate(this.onEndAnimation.bind(this));
            this.reelSpeenSoundInstance = createjs.Sound.play(this.reelSpinSoundId, { loop: -1 });
        }
    }, {
        key: "onEndAnimation",
        value: function onEndAnimation() {
            this.stopCount++;
            this.SpinStopkSoundId = createjs.Sound.play(this.buttonClickSoundId);
            if (this.stopCount === this.drumsCount) {
                this.button.activate();
                this.reelSpeenSoundInstance.stop();
            }
        }
    }, {
        key: "animate",
        value: function animate() {
            requestAnimationFrame(this.animate.bind(this));
            this.renderer.render(this.stage);
        }
    }, {
        key: "_loadSounds",
        value: function _loadSounds() {
            this.reelSpinSoundId = "reelSpinSound";
            this.buttonClickSoundId = "buttonClickSound";
            this.SpinStopkSoundId = "buttonClickSound";
            createjs.Sound.registerSound("sounds/Reel_Spin.mp3", this.reelSpinSoundId);
            createjs.Sound.registerSound("sounds/Landing_1.mp3", this.buttonClickSoundId);
            createjs.Sound.registerSound("sounds/slot.mp3", this.SpinStopkSoundId);
        }
    }]);

    return Controller;
}();

var Drums = function () {
    function Drums(addToStage) {
        _classCallCheck(this, Drums);

        this.addToStage = addToStage;
        this.x = 58; //left padding
        this.y = 40; //top padding
        this.columnPadding = 30;
        this.globalResult = null;

        this.drums = [new DrumsItem(), new DrumsItem(), new DrumsItem(), new DrumsItem(), new DrumsItem()];

        this.container = new PIXI.Container();
        this.container.x = this.x;
        this.container.y = this.y;

        this.addDrums();
        this.createMask();
    }

    _createClass(Drums, [{
        key: "addDrums",
        value: function addDrums() {
            for (var i = 0; i < this.drums.length; i++) {
                var drumItem = this.drums[i];
                drumItem.delayStop = 500 * i;
                drumItem.container.position.x = (drumItem.width + this.columnPadding) * i;
                this.container.addChild(drumItem.container);
            }
        }
    }, {
        key: "rotate",
        value: function rotate(fn) {
            this.globalResult = [];
            for (var i = 0; i < this.drums.length; i++) {
                var drumItem = this.drums[i];
                var random = Math.floor(Math.random() * 13);
                drumItem.rotate(random, fn);
                this.globalResult.push(drumItem.result);
            }
        }
    }, {
        key: "createMask",
        value: function createMask() {
            var thing = new PIXI.Graphics();
            thing.clear();
            thing.drawRect(this.x, this.y, 1130, 580);
            this.container.mask = thing;
            this.addToStage(thing);
        }
    }]);

    return Drums;
}();

var DrumsItem = function () {
    function DrumsItem() {
        _classCallCheck(this, DrumsItem);

        this.width = SLOT_IMG_WIDTH;
        this.height = SLOT_IMG_HEIGHT;
        this.stesh = {};
        this.animation = true;
        this.position = { x: 0, y: 0 };
        this.delayStop = 0;
        this.selected = null;
        this.blocks = [{ id: 0, texture: PIXI.loader.resources["SLOT_IMG1"].texture }, { id: 1, texture: PIXI.loader.resources["SLOT_IMG2"].texture }, { id: 2, texture: PIXI.loader.resources["SLOT_IMG3"].texture }, { id: 3, texture: PIXI.loader.resources["SLOT_IMG4"].texture }, { id: 4, texture: PIXI.loader.resources["SLOT_IMG5"].texture }, { id: 5, texture: PIXI.loader.resources["SLOT_IMG6"].texture }, { id: 6, texture: PIXI.loader.resources["SLOT_IMG7"].texture }, { id: 7, texture: PIXI.loader.resources["SLOT_IMG8"].texture }, { id: 8, texture: PIXI.loader.resources["SLOT_IMG9"].texture }, { id: 9, texture: PIXI.loader.resources["SLOT_IMG10"].texture }, { id: 10, texture: PIXI.loader.resources["SLOT_IMG11"].texture }, { id: 11, texture: PIXI.loader.resources["SLOT_IMG12"].texture }, { id: 12, texture: PIXI.loader.resources["SLOT_IMG13"].texture }];

        this.container = new PIXI.Container();
        this.container.position.x = this.position.x;
        this.container.position.y = this.position.y;

        this.shuffleBlocks();
        this.createBlocks();
    }

    _createClass(DrumsItem, [{
        key: "shuffleBlocks",
        value: function shuffleBlocks() {
            this.blocks = this._shuffleArray(this.blocks);
        }
    }, {
        key: "_shuffleArray",
        value: function _shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var _ref = [array[j], array[i]];
                array[i] = _ref[0];
                array[j] = _ref[1];
            }
            return array;
        }
    }, {
        key: "createBlocks",
        value: function createBlocks() {
            for (var i = 0; i < this.blocks.length; i++) {
                var item = new PIXI.Sprite(this.blocks[i].texture);
                item.width = this.width;
                item.height = this.height;
                item.position.y = i * this.height;
                this.stesh['b_' + this.blocks[i].id] = item;
                this.container.addChild(item);
            }
        }
    }, {
        key: "rotate",
        value: function rotate() {
            var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var fn = arguments[1];

            this.animation = true;
            this.selected = selected;
            this.stop();
            this.animate(selected, fn);
        }
    }, {
        key: "animate",
        value: function animate(selectedBlock, fn) {
            var _selectedSpritePosition = this.stesh['b_' + selectedBlock].position.y,
                func = fn;

            if (!this.animation && _selectedSpritePosition % this.height == 0) {
                func();
                return false;
            }

            for (var i = 0; i < this.blocks.length; i++) {
                var current = this.stesh['b_' + i];
                current.position.y -= this.height / 4;
                if (current.position.y <= -this.height) current.position.y = (this.blocks.length - 1) * this.height;
            }

            requestAnimationFrame(this.animate.bind(this, selectedBlock, func));
        }
    }, {
        key: "stop",
        value: function stop() {
            var _this = this;

            var delay = 4000 + this.delayStop;
            setTimeout(function () {
                _this.animation = false;
            }, delay);
        }
    }]);

    return DrumsItem;
}();

var Button = function () {
    function Button(onSpin, onClickSoundId) {
        _classCallCheck(this, Button);

        this.onClickSoundId = onClickSoundId;
        this.onSpin = onSpin;
        this.active = true;

        this.activeTexture = PIXI.loader.resources["BTN_norm"].texture;
        this.inactiveTexture = PIXI.loader.resources["BTN_disable"].texture;
        this.hoverTexture = PIXI.loader.resources["BTN_hover"].texture;
        this.pressTexture = PIXI.loader.resources["BTN_pressed"].texture;

        this.container = new PIXI.Container();
        this.container.position.x = 895;
        this.container.position.y = 700;

        this.button = new PIXI.Sprite(this.activeTexture);
        this.button.buttonMode = true;
        this.button.interactive = true;

        this.button.anchor.set(0.5);
        this.button.width = 140;
        this.button.height = 140;

        this.container.addChild(this.button);
        this.bindEvents();
    }

    _createClass(Button, [{
        key: "bindEvents",
        value: function bindEvents() {
            this.button.on('mouseover', this.onHover.bind(this)).on('pointerdown', this.onPress.bind(this)).on('mouseout', this.onOut.bind(this)).on('click', this.onClick.bind(this));
        }
    }, {
        key: "onPress",
        value: function onPress() {
            if (!this.active) return;
            this.button.texture = this.pressTexture;
            this.buttonClickSoundId = createjs.Sound.play(this.onClickSoundId);
        }
    }, {
        key: "onHover",
        value: function onHover() {
            if (!this.active) return;
            this.button.texture = this.hoverTexture;
        }
    }, {
        key: "onOut",
        value: function onOut() {
            if (!this.active) return;
            this.button.texture = this.activeTexture;
        }
    }, {
        key: "onClick",
        value: function onClick() {
            if (!this.active) return;
            this.deactivate();
            this.onSpin();
        }
    }, {
        key: "deactivate",
        value: function deactivate() {
            this.active = false;
            this.button.texture = this.inactiveTexture;
        }
    }, {
        key: "activate",
        value: function activate() {
            this.active = true;
            this.button.texture = this.activeTexture;
        }
    }]);

    return Button;
}();

var Loader = function Loader(fn) {
    _classCallCheck(this, Loader);

    var loader = PIXI.loader;
    loader.add([{ name: 'BTN_norm', url: "images/btn_spin_normal.png" }, { name: 'BTN_disable', url: "images/btn_spin_disable.png" }, { name: 'BTN_hover', url: "images/btn_spin_hover.png" }, { name: 'BTN_pressed', url: "images/btn_spin_pressed.png" }, { name: 'BG', url: "images/slotOverlay.png" }, { name: 'SLOT_IMG1', url: "images/01.png" }, { name: 'SLOT_IMG2', url: "images/02.png" }, { name: 'SLOT_IMG3', url: "images/03.png" }, { name: 'SLOT_IMG4', url: "images/04.png" }, { name: 'SLOT_IMG5', url: "images/05.png" }, { name: 'SLOT_IMG6', url: "images/06.png" }, { name: 'SLOT_IMG7', url: "images/07.png" }, { name: 'SLOT_IMG8', url: "images/08.png" }, { name: 'SLOT_IMG9', url: "images/09.png" }, { name: 'SLOT_IMG10', url: "images/10.png" }, { name: 'SLOT_IMG11', url: "images/11.png" }, { name: 'SLOT_IMG12', url: "images/12.png" }, { name: 'SLOT_IMG13', url: "images/13.png" }]);

    loader.once('complete', fn);

    loader.load();
};

new Controller();