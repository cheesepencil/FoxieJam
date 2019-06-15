const bg = require('./images/bg.png');
const fox01 = require('./images/fox01.png');
const fox02 = require('./images/fox02.png');
const hedgie01 = require('./images/hedgie01.png');
const oof: string = require('./audio/oof.wav');
const boing: string = require('./audio/boing.wav');

export class PreloadScene extends Phaser.Scene {
    private bmtLoading: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload(): void {
        // bitmap text resource already loaded, safe to use
        this.bmtLoading = this.add.bitmapText(100, 80, 'PressStart2P-White', 'Loading...')
            .setOrigin(0.5, 0.5);

        // load all resources here
        this.load.image('bg', bg);
        this.load.image('fox01', fox01);
        this.load.image('fox02', fox02);
        this.load.image('hedgie01', hedgie01);
        this.load.audio('oof', oof);
        this.load.audio('boing', boing);
    }

    create(): void {
        this.scene.start('TitleScene');
    }
}