import { Physics } from "phaser";

export class GameScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.BitmapText;
    private score: number;
    private bestScoreText: Phaser.GameObjects.BitmapText;
    private bestScore: number;
    private bg1: Phaser.GameObjects.Sprite;
    private bg2: Phaser.GameObjects.Sprite;
    private bg3: Phaser.GameObjects.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private scrollSpeed: number;
    private alive: boolean;
    private fox: Phaser.GameObjects.Sprite;
    private framesJump: number;
    private hedgie: Phaser.GameObjects.Sprite;
    private ouch: boolean;

    constructor() {
        super({ key: 'GameScene' })
    }

    init() {
        this.score = 0;
        this.scrollSpeed = 1;
        this.framesJump = 0;
        this.ouch = false;
    }

    create(): void {
        // score init
        this.score = 0;
        this.bestScore = 0;

        // add bg
        this.bg1 = this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
        this.bg2 = this.add.sprite(200, 0, 'bg').setOrigin(0, 0);
        this.bg3 = this.add.sprite(400, 0, 'bg').setOrigin(0, 0);

        // add floor
        const floor = this.add.rectangle(0, 160, 200, 22)
            .setOrigin(0, 1);

        // add fox
        this.fox = this.add.sprite(12, 0, 'fox01')
            .setOrigin(0, 0);
        this.anims.create({
            key: 'foxRun',
            frames: [
                { frame: 'fox01', key: 'fox01' },
                { frame: 'fox02', key: 'fox02' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.fox.play('foxRun');

        // add hedgie
        this.hedgie = this.add.sprite(200, 138, 'hedgie01')
            .setOrigin(0, 1);

        this.physics.add.existing(this.fox);
        this.physics.add.existing(floor, true);
        this.physics.add.collider(this.fox, floor);
        this.physics.add.existing(this.hedgie);
        this.physics.add.overlap(this.fox, this.hedgie);
        (this.hedgie.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        // add score UI
        this.add.bitmapText(4, 4, 'PressStart2P-White', 'SCORE:')
            .setOrigin(0, 0);
        this.scoreText = this.add.bitmapText(194, 4, 'PressStart2P-White', '0')
            .setOrigin(1, 0);
        this.add.bitmapText(4, 16, 'PressStart2P-White', 'BEST:')
            .setOrigin(0, 0);
        this.bestScoreText = this.add.bitmapText(194, 16, 'PressStart2P-White', '0')
            .setOrigin(1, 0);

        // setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(): void {
        const foxBody = this.fox.body as Physics.Arcade.Body;

        if (this.ouch === false) {
            if (this.physics.world.collide(this.fox, this.hedgie)) {
                this.ouch = true;
            }
            else {
                this.scrollBg();
                if (foxBody.touching.down) {
                    this.framesJump = 0;
                } else if (this.cursors.space.isUp) {
                    this.framesJump = Infinity;
                }
                if (this.cursors.space.isDown && this.framesJump < 30) {
                    this.framesJump++;
                    foxBody.setVelocityY(-75);
                }
                this.score += 2;
                this.scoreText.setText(this.score.toString());
            }
        }
    }

    private scrollBg() {
        if (this.bg1.x < -200) {
            this.bg1.setX(200);
        }
        else {
            this.bg1.setX(this.bg1.x - this.scrollSpeed);
        }
        if (this.bg2.x < -200) {
            this.bg2.setX(200);
        }
        else {
            this.bg2.setX(this.bg2.x - this.scrollSpeed);
        }
        if (this.bg3.x < -200) {
            this.bg3.setX(200);
        }
        else {
            this.bg3.setX(this.bg3.x - this.scrollSpeed);
        }
        if (this.hedgie.x < -16) {
            this.hedgie.setX(200);
        } else {
            this.hedgie.setX(this.hedgie.x - this.scrollSpeed);
        }
    }
}