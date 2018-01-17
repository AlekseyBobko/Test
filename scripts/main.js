const DRUMS_COUNT = 5;
const MAIN_CONTAINER_WIDTH = 1025;
const MAIN_CONTAINER_HEIGHT = 790;
const FRAME_BORDER_BOTTOM_WIDTH = 150;
const SLOT_IMG_WIDTH = 156;
const SLOT_IMG_HEIGHT = 142;

class Controller{
    constructor(){
        this.width = MAIN_CONTAINER_WIDTH;
        this.height = MAIN_CONTAINER_HEIGHT;
        this.stopCount = 0;
        this.drumsCount = DRUMS_COUNT;

        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {backgroundColor : 0xffffff});
        this.stage = new PIXI.Container();

        this._loadSounds();

        new Loader(this.init.bind(this));
    }

    init(){
        document.body.appendChild(this.renderer.view);
        this.renderer.render(this.stage);

        this.createBackgroundRepeat();
        this.createBackground();
        this.createDrums();
        this.createButton();
        this.animate()
    }

    stageAdd(item){
        this.stage.addChild(item);
        this.renderer.render(this.stage);
    }

    createBackground(){
        var bg = new PIXI.Sprite(PIXI.loader.resources["BG"].texture);
        bg.width = MAIN_CONTAINER_WIDTH;
        bg.height = MAIN_CONTAINER_HEIGHT - FRAME_BORDER_BOTTOM_WIDTH;
        this.stageAdd(bg);
    }

    createBackgroundRepeat(){
        var texture = PIXI.Texture.fromImage('images/winningFrameBackground.jpg');
        var sprite = new PIXI.extras.TilingSprite(texture, 950, 590);
        sprite.position.x = 32;
        sprite.position.y = 38;
        this.stageAdd(sprite);
    }

    createDrums(){
        this.drums = new Drums(this.stageAdd.bind(this));
        this.stageAdd(this.drums.container);
    }

    createButton(){
        this.button = new Button(this.onSpin.bind(this), this.buttonClickSoundId);
        this.stageAdd(this.button.container);
    }

    onSpin(){
        this.stopCount = 0;
        this.drums.rotate(this.onEndAnimation.bind(this));
        this.reelSpeenSoundInstance = createjs.Sound.play(this.reelSpinSoundId, {loop: -1});
    }
    onEndAnimation(){
        this.stopCount++;
        this.SpinStopkSoundId = createjs.Sound.play(this.buttonClickSoundId);
        if(this.stopCount === this.drumsCount){
            this.button.activate();
            this.reelSpeenSoundInstance.stop();
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.stage);
    }


    _loadSounds() {
        this.reelSpinSoundId = "reelSpinSound";
        this.buttonClickSoundId = "buttonClickSound";
        this.SpinStopkSoundId = "buttonClickSound";
        createjs.Sound.registerSound("sounds/Reel_Spin.mp3", this.reelSpinSoundId);
        createjs.Sound.registerSound("sounds/Landing_1.mp3", this.buttonClickSoundId);
        createjs.Sound.registerSound("sounds/slot.mp3", this.SpinStopkSoundId);
    }
}



class Drums{

    constructor(addToStage){
        this.addToStage = addToStage;
        this.x = 58; //left padding
        this.y = 40; //top padding
        this.columnPadding = 30;
        this.globalResult = null;

        this.drums=[new DrumsItem(),
            new DrumsItem(),
            new DrumsItem(),
            new DrumsItem(),
            new DrumsItem()];

        this.container = new PIXI.Container();
        this.container.x = this.x;
        this.container.y = this.y;

        this.addDrums();
        this.createMask();
    }

    addDrums(){
        for(let i=0; i<this.drums.length; i++){
            let drumItem = this.drums[i];
            drumItem.delayStop = 500*i;
            drumItem.container.position.x = (drumItem.width + this.columnPadding) * i;
            this.container.addChild(drumItem.container);
        }
    }

    rotate(fn){
        this.globalResult = [];
        for(let i=0; i<this.drums.length; i++){
            let drumItem = this.drums[i];
            let random = Math.floor(Math.random() * 13);
            drumItem.rotate(random, fn);
            this.globalResult.push(drumItem.result)
        }
    }

    createMask(){
        let thing = new PIXI.Graphics();
        thing.clear();
        thing.drawRect(this.x, this.y, 1130, 580);
        this.container.mask = thing;
        this.addToStage(thing);
    }


}

class DrumsItem{
    constructor( ){
        this.width = SLOT_IMG_WIDTH;
        this.height = SLOT_IMG_HEIGHT;
        this.stesh ={};
        this.animation = true;
        this.position = {x:0,y:0};
        this.delayStop = 0;
        this.selected = null;
        this.blocks=[
            {id:0, texture:PIXI.loader.resources["SLOT_IMG1"].texture},
            {id:1, texture:PIXI.loader.resources["SLOT_IMG2"].texture},
            {id:2, texture:PIXI.loader.resources["SLOT_IMG3"].texture},
            {id:3, texture:PIXI.loader.resources["SLOT_IMG4"].texture},
            {id:4, texture:PIXI.loader.resources["SLOT_IMG5"].texture},
            {id:5, texture:PIXI.loader.resources["SLOT_IMG6"].texture},
            {id:6, texture:PIXI.loader.resources["SLOT_IMG7"].texture},
            {id:7, texture:PIXI.loader.resources["SLOT_IMG8"].texture},
            {id:8, texture:PIXI.loader.resources["SLOT_IMG9"].texture},
            {id:9, texture:PIXI.loader.resources["SLOT_IMG10"].texture},
            {id:10, texture:PIXI.loader.resources["SLOT_IMG11"].texture},
            {id:11, texture:PIXI.loader.resources["SLOT_IMG12"].texture},
            {id:12, texture:PIXI.loader.resources["SLOT_IMG13"].texture}
        ];

        this.container = new PIXI.Container();
        this.container.position.x = this.position.x;
        this.container.position.y = this.position.y;

        this.shuffleBlocks();
        this.createBlocks();
    }

    shuffleBlocks(){
        this.blocks = this._shuffleArray(this.blocks);
    }

    _shuffleArray(array){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    createBlocks(){
        for(let i=0; i<this.blocks.length; i++){
            let item = new PIXI.Sprite(this.blocks[i].texture);
            item.width = this.width;
            item.height = this.height;
            item.position.y = i * this.height;
            this.stesh['b_'+this.blocks[i].id] = item;
            this.container.addChild(item);
        }
    }
    rotate(selected = 0, fn){
        this.animation = true;
        this.selected = selected;
        this.stop();
        this.animate(selected,fn);
    }

    animate(selectedBlock, fn) {
        let _selectedSpritePosition = this.stesh['b_'+selectedBlock].position.y,
            func = fn;

        if(!this.animation &&  _selectedSpritePosition % this.height == 0 )
        {
            func();
            return false;
        }


        for(let i=0; i<this.blocks.length; i++){
            let current = this.stesh['b_'+i];
            current.position.y -= this.height / 4;
            if(current.position.y <= -this.height) current.position.y = (this.blocks.length-1)*this.height;
        }

        requestAnimationFrame(this.animate.bind(this, selectedBlock, func));
    }
    stop(){
        let delay = 4000+this.delayStop;
        setTimeout(()=>{this.animation = false; }, delay );
    }


}
class Button{
    constructor(onSpin, onClickSoundId){
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
    bindEvents(){
        this.button
            .on('mouseover', this.onHover.bind(this))
            .on('pointerdown', this.onPress.bind(this))
            .on('mouseout', this.onOut.bind(this))
            .on('click', this.onClick.bind(this));
    }
    onPress() {
        if(!this.active) return;
        this.button.texture =  this.pressTexture;
        this.buttonClickSoundId = createjs.Sound.play(this.onClickSoundId);
    }
    onHover()
    {
        if(!this.active) return;
        this.button.texture =  this.hoverTexture;
    }
    onOut()
    {
        if(!this.active) return;
        this.button.texture = this.activeTexture;
    }
    onClick(){
        if(!this.active)return;
        this.deactivate();
        this.onSpin();
    }
    deactivate(){
        this.active = false;
        this.button.texture = this.inactiveTexture;
    }
    activate(){
        this.active = true;
        this.button.texture = this.activeTexture;
    }
}

class Loader{
    constructor(fn){
        let loader = PIXI.loader;
        loader.add([
            {name: 'BTN_norm', url:"images/btn_spin_normal.png" },
            {name: 'BTN_disable', url:"images/btn_spin_disable.png" },
            {name: 'BTN_hover', url:"images/btn_spin_hover.png" },
            {name: 'BTN_pressed', url:"images/btn_spin_pressed.png" },
            {name: 'BG', url:"images/slotOverlay.png" },
            {name: 'SLOT_IMG1', url:"images/01.png" },
            {name: 'SLOT_IMG2', url:"images/02.png" },
            {name: 'SLOT_IMG3', url:"images/03.png" },
            {name: 'SLOT_IMG4', url:"images/04.png" },
            {name: 'SLOT_IMG5', url:"images/05.png" },
            {name: 'SLOT_IMG6', url:"images/06.png" },
            {name: 'SLOT_IMG7', url:"images/07.png" },
            {name: 'SLOT_IMG8', url:"images/08.png" },
            {name: 'SLOT_IMG9', url:"images/09.png" },
            {name: 'SLOT_IMG10', url:"images/10.png" },
            {name: 'SLOT_IMG11', url:"images/11.png" },
            {name: 'SLOT_IMG12', url:"images/12.png" },
            {name: 'SLOT_IMG13', url:"images/13.png" }
        ]);

        loader.once('complete',fn);

        loader.load();
    }

}

new Controller();


