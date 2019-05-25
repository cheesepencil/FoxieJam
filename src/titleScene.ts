export class TitleScene extends Phaser.Scene {
    private ready: boolean = false;
    private space: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'TitleScene' })
    }

    create(): void {
        this.bg = this.add.container(0,0).setAlpha(0);
        this.bg.add(this.add.image(0,0,'bg').setOrigin(0,0));
        this.bg.add(this.add.image(200,0,'bg').setOrigin(0,0));
        this.bg.add(this.add.image(400,0,'bg').setOrigin(0,0));

        this.add.bitmapText(100, 80, 'PressStart2P-White', 'FOREST SCAMPER')
            .setOrigin(0.5, 0.5);

        let pressSpace = this.add.bitmapText(100, 154, 'PressStart2P-White', 'press space...')
            .setOrigin(0.5, 1);

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true);

        this.tweens.add({
            targets: this.bg,
            duration: 10000,
            x: -400,
            repeat: -1
        });

        this.tweens.add({
            targets: this.bg,
            duration: 2500,
            alpha: 1,
            repeat: 0
        });

        this.tweens.add({
            targets: pressSpace,
            duration: 1000,
            alpha: 0,
            repeat: -1,
            yoyo: true
        });

        this.cameras.main.fadeIn(2000, 0, 0, 0, this.fadeCheck, this);
    }

    update(): void {
        if (this.ready === true && this.space.isDown) {
            this.scene.start('GameScene');
        }
    }

    private fadeCheck(camera: any, progress: number): void {
        if (progress === 1) {
            this.ready = true;
        }
    }
}