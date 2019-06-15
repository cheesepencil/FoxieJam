import { Physics } from "phaser";

export class GameScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.BitmapText;
    private score: number;
    private bestScoreText: Phaser.GameObjects.BitmapText;
    private bestScore: number = 0;
    private bg1: Phaser.GameObjects.Sprite;
    private bg2: Phaser.GameObjects.Sprite;
    private bg3: Phaser.GameObjects.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private scrollSpeed: number;
    private fox: Phaser.GameObjects.Sprite;
    private framesJump: number;
    private hedgie1: Phaser.GameObjects.Sprite;
    private hedgie2: Phaser.GameObjects.Sprite;
    private ouch: boolean;
    private floorCollider: Phaser.Physics.Arcade.Collider;
    private hedgieReset: boolean = true;

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

        // add bg
        this.bg1 = this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
        this.bg2 = this.add.sprite(200, 0, 'bg').setOrigin(0, 0);
        this.bg3 = this.add.sprite(400, 0, 'bg').setOrigin(0, 0);

        // add floor
        const floor = this.add.rectangle(0, 160, 200, 22)
            .setOrigin(0, 1);

        // add fox
        this.fox = this.add.sprite(32, 0, 'fox01')
            .setOrigin(0.5, 0.75);
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

        // add hedgies
        this.hedgie1 = this.add.sprite(200, 130, 'hedgie01');
        this.hedgie2 = this.add.sprite(300, 130, 'hedgie01');

        this.physics.add.existing(this.fox);
        (this.fox.body as Phaser.Physics.Arcade.Body).width = 16;
        (this.fox.body as Phaser.Physics.Arcade.Body).offset = new Phaser.Math.Vector2(8, 0);
        this.physics.add.existing(floor, true);
        this.floorCollider = this.physics.add.collider(this.fox, floor);
        this.physics.add.existing(this.hedgie1);
        this.physics.add.existing(this.hedgie2);
        this.physics.add.overlap(this.fox, [this.hedgie1, this.hedgie2]);
        (this.hedgie1.body as Phaser.Physics.Arcade.Body)
            .setAllowGravity(false)
            .width = 8;
        (this.hedgie1.body as Phaser.Physics.Arcade.Body).offset = new Phaser.Math.Vector2(4, 0);
        (this.hedgie2.body as Phaser.Physics.Arcade.Body)
            .setAllowGravity(false)
            .width = 8;
        (this.hedgie2.body as Phaser.Physics.Arcade.Body).offset = new Phaser.Math.Vector2(4, 0);

        // add score UI
        this.add.bitmapText(4, 4, 'PressStart2P-White', 'SCORE:')
            .setOrigin(0, 0);
        this.scoreText = this.add.bitmapText(194, 4, 'PressStart2P-White', '0')
            .setOrigin(1, 0);
        this.add.bitmapText(4, 16, 'PressStart2P-White', 'BEST:')
            .setOrigin(0, 0);
        this.bestScoreText = this.add.bitmapText(194, 16, 'PressStart2P-White', this.bestScore.toString())
            .setOrigin(1, 0);

        // setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(): void {
        this.scrollSpeed = 1 + ((Math.floor(this.score / 1000)) * 0.25);
        console.log(this.scrollSpeed);
        const foxBody = this.fox.body as Physics.Arcade.Body;
        const hedgie1Body = this.hedgie1.body as Physics.Arcade.Body;
        const hedgie2Body = this.hedgie2.body as Physics.Arcade.Body;
        const hedgieFlingVelocity: number = 500;
        const hedgieFlingRotVelocity: number = 1280;
        const foxFlingVelocity: number = -250;
        const foxFlingRotVelocity: number = -5000;

        if (this.ouch === false) {
            if (this.physics.world.collide(this.fox, this.hedgie1)) {
                this.sound.play('oof');
                this.ouch = true;
                foxBody.setVelocityY(foxFlingVelocity);
                foxBody.setAngularVelocity(foxFlingRotVelocity);
                hedgie1Body.setVelocityY(-hedgieFlingVelocity);
                hedgie1Body.setVelocityX(hedgieFlingVelocity);
                hedgie1Body.setAngularVelocity(hedgieFlingRotVelocity);
                this.bestScore = this.bestScore > this.score ? this.bestScore : this.score;
                this.bestScoreText.setText(this.bestScore.toString());
                this.floorCollider.destroy();
            } else if (this.physics.world.collide(this.fox, this.hedgie2)) {
                this.sound.play('oof');
                this.ouch = true;
                foxBody.setVelocityY(foxFlingVelocity);
                foxBody.setAngularVelocity(foxFlingRotVelocity);
                hedgie2Body.setVelocityY(-hedgieFlingVelocity);
                hedgie2Body.setVelocityX(hedgieFlingVelocity);
                hedgie2Body.setAngularVelocity(hedgieFlingRotVelocity);
                this.bestScore = this.bestScore > this.score ? this.bestScore : this.score;
                this.bestScoreText.setText(this.bestScore.toString());
                this.floorCollider.destroy();
            }
            else {
                this.scrollBg();
                if (foxBody.touching.down) {
                    this.framesJump = 0;
                } else if (this.cursors.space.isUp) {
                    this.framesJump = Infinity;
                }
                if (this.cursors.space.isDown && this.framesJump < 30) {
                    if (this.framesJump === 0){
                        this.sound.play('boing');
                    }
                    this.framesJump++;
                    foxBody.setVelocityY(-150);
                }
                this.score += 2;
                this.scoreText.setText(this.score.toString());
            }
        } else {
            if (this.fox.y > 160 && this.cursors.space.isDown) {
                this.scene.restart();
            }
        }
    }

    private scrollBg() {
        if (this.bg1.x < -200) {
            this.bg1.setX(this.bg3.x + 200 - this.scrollSpeed);
        }
        else {
            this.bg1.setX(this.bg1.x - this.scrollSpeed);
        }
        if (this.bg2.x < -200) {
            this.bg2.setX(this.bg1.x + 200 - this.scrollSpeed);
        }
        else {
            this.bg2.setX(this.bg2.x - this.scrollSpeed);
        }
        if (this.bg3.x < -200) {
            this.bg3.setX(this.bg2.x + 200 - this.scrollSpeed);
        }
        else {
            this.bg3.setX(this.bg3.x - this.scrollSpeed);
        }
        if (this.hedgie1.x < -16) {
            console.log('hedgie1 reset!');
            this.hedgie1.setX(208);
        } else {
            this.hedgie1.setX(this.hedgie1.x - this.scrollSpeed);
        }
        if (this.hedgie2.x < -16) {
            if (this.hedgieReset === true) {
                this.time.delayedCall(Phaser.Math.Between(0, 1500), () => {
                    console.log('hedgie2 reset!');
                    this.hedgie2.setX(208);
                    this.hedgieReset = true;
                }, null, this);
                this.hedgieReset = false;
            }
        } else {
            this.hedgie2.setX(this.hedgie2.x - this.scrollSpeed);
        }
    }
}