namespace SpriteKind {
    export const Box = SpriteKind.create()
    export const FastEnemy = SpriteKind.create()
    export const Rock = SpriteKind.create()
    export const Swapper = SpriteKind.create()
    export const Helper = SpriteKind.create()
    export const Text = SpriteKind.create()
    export const Crown = SpriteKind.create()
    export const Goblin = SpriteKind.create()
    export const Ghost = SpriteKind.create()
    export const Shuriken = SpriteKind.create()
    export const ParachutingEnemy = SpriteKind.create()
    export const Parachute = SpriteKind.create()
    export const EndCrown = SpriteKind.create()
}
// class
class MusicController {
    static playMusic: boolean = true
    static title: music.Playable = music.createSong(assets.song`titleSong`)
    static theme1: music.Playable = music.createSong(assets.song`t1`)
    static theme2: music.Playable[] = [
        music.createSong(assets.song`t2p1`),
        music.createSong(assets.song`t2p2`),
        music.createSong(assets.song`t2p3`)
    ]
    static bossTheme: music.Playable = music.createSong(assets.song`bossTheme`)
    static tutTheme: music.Playable = music.createSong(assets.song`tutTheme`)

    static playTitle() {
        MusicController.endCurrentMusic()

        MusicController.playMusic = true
        music.play(MusicController.title, music.PlaybackMode.UntilDone)
    }

    static playTheme1() {
        MusicController.endCurrentMusic()

        timer.after(50, function () {
            MusicController.playMusic = true
            while (MusicController.playMusic) {
                music.play(MusicController.theme1, music.PlaybackMode.UntilDone)
                if (!MusicController.playMusic) {
                    break
                }
            }
        })
    }

    static playTheme2() {
        MusicController.endCurrentMusic()

        timer.after(50, function () {
            MusicController.playMusic = true
            while (MusicController.playMusic) {
                for (let i = 0; i < MusicController.theme2.length; i++) {
                    music.play(MusicController.theme2[i], music.PlaybackMode.UntilDone)
                    if (!MusicController.playMusic) break
                }
            }
        })
    }

    static playBossTheme() {
        MusicController.endCurrentMusic()

        timer.after(50, function () {
            MusicController.playMusic = true
            while (MusicController.playMusic) {
                music.play(MusicController.bossTheme, music.PlaybackMode.UntilDone)
                if (!MusicController.playMusic) {
                    break
                }
            }
        })
    }
    
    static playTutorialTheme() {
        MusicController.endCurrentMusic()

        timer.after(50, function () {
            MusicController.playMusic = true
            while (MusicController.playMusic) {
                music.play(MusicController.tutTheme, music.PlaybackMode.UntilDone)
                if (!MusicController.playMusic) {
                    break
                }
            }
        })
    }

    static endCurrentMusic() {
        MusicController.playMusic = false
        music.stopAllSounds()
    }

}
scene.onHitWall(SpriteKind.EndCrown, function (sprite: Sprite, location: tiles.Location) {
    sprite.vy *= -0.5
    if (Math.abs(sprite.vy) < 5) {
        sprite.vy = 0
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.EndCrown, function (sprite: Sprite, otherSprite: Sprite) {
    sprites.setDataString(otherSprite, "state", "attachedToNinja")
    ninja.setFlag(SpriteFlag.GhostThroughSprites, true)
    endingCrown.setFlag(SpriteFlag.GhostThroughSprites, true)
    endingCrown.setFlag(SpriteFlag.GhostThroughTiles, true)
    endingCrown.setFlag(SpriteFlag.GhostThroughWalls, true)
    music.play(music.createSoundEffect(WaveShape.Triangle, 4687, 4687, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    music.play(music.createSoundEffect(WaveShape.Triangle, 4687, 4687, 74, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
})
game.onUpdate(function () {
    if (endingCrown && sprites.readDataString(endingCrown, "state") == "attachedToNinja") {
        let crown_vertical_offset = 10
        endingCrown.setPosition(ninja.x, ninja.y - crown_vertical_offset)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`debug`, function (sprite: Sprite, location: tiles.Location) {
    tiles.placeOnTile(sprite, tiles.getTileLocation(164, 11))
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spawnParachutes`, function(sprite: Sprite, location: tiles.Location) {
    if (waveSpawned) return
    waveSpawned = true
    timer.background(function() {
        for (let i = 0; i < 6; i++) {
            spawnParachutingEnemy(8 + location.column * 8 + (i * 32) + randint(-6, 6), -10)
            pause(500 + Math.random() * 500)
        }
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`setupParachutes`, function (sprite: Sprite, location: tiles.Location) {
    if (!waveSpawned) return
    waveSpawned = false
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`setupParachutes1`, function (sprite: Sprite, location: tiles.Location) {
    if (!waveSpawned) return
    waveSpawned = false
})
function spawnSwapper () {
    invis = false
    while (newSwapperImage == prevImage) {
        newSwapperImage = swapperImages._pickRandom()
    }
    prevImage = newSwapperImage
    newSwapper = sprites.create(newSwapperImage, SpriteKind.Swapper)
    newSwapper.setPosition(ninja.x, ninja.y)
    newSwapper.setBounceOnWall(true)
    newSwapper.vy = -40
    newSwapper.ay = 100
    newSwapper.lifespan = 2500
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile80`, function (sprite, location) {
    resetPlayer(sprite)
})
function placeBox (col: number, row: number, offset: number) {
    newBox = sprites.create(assets.image`box`, SpriteKind.Box)
    newBox.z = 100
    tiles.placeOnTile(newBox, tiles.getTileLocation(col, row))
    newBox.x += offset
}
function spawnFastEnemy (col: number, row: number, direction: number) {
    newBadGuy = sprites.create(assets.image`goblinFast`, SpriteKind.FastEnemy)
    newBadGuy.z = 400
    tiles.placeOnTile(newBadGuy, tiles.getTileLocation(col, row))
    newBadGuy.setVelocity(100 * direction, 0)
    sprites.setDataString(newBadGuy, "state", "idle")
}
function spawnParachutingEnemy(x: number, y: number) {
    let fallDir = Math.pickRandom([-1, 1])
    let fallDirSpeed = randint(4, 8)
    let fallSpeed = randint(10,20)
    newBadGuy = sprites.create(assets.image`goblinSmile`, SpriteKind.ParachutingEnemy)
    newBadGuy.z = 900
    newBadGuy.setPosition(x, y)
    newBadGuy.setVelocity(fallDirSpeed * fallDir, fallSpeed)
    newBadGuy.lifespan = 15000
    newBadGuy.setFlag(SpriteFlag.GhostThroughWalls, true)
    let newParachute = sprites.create(assets.image`parachute`, SpriteKind.Parachute)
    newParachute.z = 899
    newParachute.setPosition(x, y-8)
    newParachute.setVelocity(fallDirSpeed * fallDir, fallSpeed)
    newParachute.lifespan = 15000
    newParachute.setFlag(SpriteFlag.GhostThroughWalls, true)

}
scene.onOverlapTile(SpriteKind.Player, assets.tile`checkpointInactive`, function (sprite, location) {
    curRespawn = location
    for (let value of tiles.getTilesByType(assets.tile`checkpointActive`)) {
        tiles.setTileAt(value, assets.tile`checkpointInactive`)
    }
    tiles.setTileAt(location, assets.tile`checkpointActive`)
    music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted && !(cutscene)) {
        const wallAbove = tiles.tileAtLocationIsWall(
            tiles.getTileLocation(ninja.tilemapLocation().column, ninja.tilemapLocation().row - 1)
        );

        const tileCheck =
            ninja.tileKindAt(TileDirection.Center, assets.tile`myTile16`) ||
            ninja.tileKindAt(TileDirection.Center, assets.tile`myTile22`) ||
            ninja.tileKindAt(TileDirection.Center, assets.tile`myTile88`) ||
            ninja.tileKindAt(TileDirection.Center, assets.tile`myTile89`);
        
        if (!wallAbove && tileCheck) {
            tiles.placeOnTile(ninja, ninja.tilemapLocation().getNeighboringLocation(CollisionDirection.Top))
            if (Math.percentChance(50)) {
                music.play(music.createSoundEffect(WaveShape.Triangle, 298, 737, 255, 246, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            } else {
                music.play(music.createSoundEffect(WaveShape.Triangle, 298, 518, 255, 255, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            }
        } else if (ninja.isHittingTile(CollisionDirection.Bottom)) {
            ninja.vy = -50
            if (Math.percentChance(50)) {
                music.play(music.createSoundEffect(WaveShape.Triangle, 474, 1088, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            } else {
                music.play(music.createSoundEffect(WaveShape.Triangle, 474, 1352, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            }
        }
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (ninja.isHittingTile(CollisionDirection.Bottom) && (ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile92`) && !(boss_cutscene))) {
        controller.moveSprite(ninja, 0, 0)
        cutscene = true
        MusicController.endCurrentMusic()
        sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
        boss_cutscene = 1
        ninja.vy = 0
        timer.after(1000, function () {
            crown_of_power = sprites.create(assets.image`crown`, SpriteKind.Crown)
            tiles.placeOnTile(crown_of_power, tiles.getTileLocation(16, 0))
            crown_of_power.setFlag(SpriteFlag.GhostThroughWalls, true)
            sprites.setDataString(crown_of_power, "state", "attachedToGoblin")
            sprites.setDataBoolean(crown_of_power, "moving", false)
            animation.runImageAnimation(
            crown_of_power,
            assets.animation`crownAnim`,
            50,
            true
            )
            finalboss = sprites.create(assets.image`goblin`, SpriteKind.Goblin)
            tiles.placeOnTile(finalboss, tiles.getTileLocation(16, 0))
            finalboss.vy = 200
            timer.after(1000, function () {
                ninja.sayText("uh oh", 1000, false)
                finalboss.vy = 0
                timer.after(1000, function () {
                    finalboss.setImage(assets.image`goblinSmile`)
                    timer.after(800, function () {
                        for (let index = 0; index < 10; index++) {
                            finalboss.scale += 0.1
                            tiles.placeOnTile(finalboss, tiles.getTileLocation(16, 13))
                            crown_vertical_offset += 0.5
                            pause(50)
                        }
                        finalboss.scale = 2
                        timer.after(1000, function () {
                            finalboss.setVelocity(80, -150)
                            finalboss.ay = 200
                            timer.after(700, function () {
                                platform = sprites.create(assets.image`bossPlatform3hp`, SpriteKind.Helper)
                                platform.setFlag(SpriteFlag.RelativeToCamera, true)
                                finalboss.setFlag(SpriteFlag.RelativeToCamera, true)
                                crown_of_power.setFlag(SpriteFlag.RelativeToCamera, true)
                                finalboss.ay = 0
                                finalboss.setPosition(184, 37)
                                finalboss.setVelocity(-20, 0)
                                platform.setPosition(186, 57)
                                platform.setVelocity(-20, 0)
                                finalboss.z = 999
                                platform.z = 999
                                crown_of_power.z = 999
                                timer.after(2000, function () {
                                    finalboss.setVelocity(0, 0)
                                    platform.setVelocity(0, 0)
                                    timer.after(1000, function () {
                                        bossTutorial()
                                        profilelife.setInvisible(false)
                                        finalBossStage = 1
                                        cutscene = false
                                        controller.moveSprite(ninja, 30, 0)
                                        cameraLock = sprites.create(assets.image`tmp`, SpriteKind.Helper)
                                        cameraLock.setPosition(95, 60)
                                        cameraLock.setVelocity(12, 0)
                                        cameraLock.setFlag(SpriteFlag.GhostThroughWalls, true)
                                        scene.cameraFollowSprite(cameraLock)
                                        ninja.setFlag(SpriteFlag.StayInScreen, false)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }
})
forever(function() {
    if (cameraLock && cameraLock.x >= 1364) {
        cameraLock.setVelocity(0, 0)
    }
    if (cameraLock && curLevel == 9) {
        // if player goes off left side of screen
        if (cameraLock.x - ninja.x > 100) {
            resetPlayer(ninja)
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ghost, function (sprite, otherSprite) {
    resetPlayer(sprite)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // DEBUG
    return;
    if (gameStarted && !(cutscene)) {
        curLevel += 1
        startLevel(curLevel)
    }
})
scene.onHitWall(SpriteKind.FastEnemy, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Right) || sprite.isHittingTile(CollisionDirection.Left)) {
        sprite.vx = 0 - sprite.vx
    } else if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        sprite.ay = 0
        sprite.setVelocity(70 * sprites.readDataNumber(sprite, "direction"), 0)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shuriken, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
    otherSprite.setKind(SpriteKind.Helper)
    otherSprite.setVelocity(130, 0)
    otherSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
    if (otherSprite.image.equals(assets.image`greenShuriken`)) {
        wallsToUnlock = tiles.getTilesByType(assets.tile`myTile118`)
    } else if (otherSprite.image.equals(assets.image`redShuriken`)) {
        wallsToUnlock = tiles.getTilesByType(assets.tile`myTile116`)
    } else if (otherSprite.image.equals(assets.image`yellowShuriken`)) {
        wallsToUnlock = tiles.getTilesByType(assets.tile`myTile120`)
    }
    timer.after(1000, function () {
        music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
        for (let value2 of wallsToUnlock) {
            tiles.setTileAt(value2, assets.tile`myTile15`)
            tiles.setWallAt(value2, false)
        }
        scene.cameraShake(4, 1000)
        if (finalBossStage == 1) {
            platform.setImage(assets.image`bossPlatform2hp`)
        } else if (finalBossStage == 2) {
            platform.setImage(assets.image`bossPlatform1hp`)
        } else if (finalBossStage == 3) {
            platform.setImage(assets.image`bossPlatform0hp`)
        }
        finalboss.setImage(assets.image`goblin`)
        timer.after(1000, function () {
            finalBossStage += 1
            // visual changes to boss every time he gets hit
            if (finalBossStage == 2) {
                finalboss.setImage(assets.image`goblinSmile`)
            } else if (finalBossStage == 3) {
            } else if (finalBossStage == 4) {
                // camera
                if (cameraLock)
                    sprites.destroy(cameraLock)
                scene.centerCameraAt(1376, 56)

                // ending animation
                finalboss.setImage(assets.image`goblinFast`)
                cutscene = true
                MusicController.endCurrentMusic()
                controller.moveSprite(ninja, 0, 0)
                profilelife.setInvisible(true)
                finalboss.setVelocity(0, 15)
                platform.setVelocity(0, 15)
                explosionOffset = 0
                for (let index = 0; index < 8; index++) {
                    scene.cameraShake(4, 1000)
                    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(5, ExtraEffectPresetShape.Explosion), 1425, 37 + explosionOffset, 100, 50, 20)
                    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Explosion), 1425, 37 + explosionOffset, 100, 25, 10)
                    explosionOffset += 7
                    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
                    timer.after(500, function () {
                        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(5, ExtraEffectPresetShape.Explosion), 1425, 37 + explosionOffset, 100, 50, 20)
                        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Explosion), 1425, 37 + explosionOffset, 100, 25, 10)
                        explosionOffset += 8
                        music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
                    })
                    pause(1000)
                }
                sprites.destroy(finalboss);
                sprites.destroy(platform);
                sprites.destroy(crown_of_power);
                pause(1000)
                // make crown of power pop up and ninja collects it then walks away into distance then the credits roll
                music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
                endingCrown = sprites.create(assets.image`crown`, SpriteKind.EndCrown)
                animation.runImageAnimation(endingCrown, assets.animation`crownAnim`, 50, true)
                tiles.placeOnTile(endingCrown, tiles.getTileLocation(175, 14))
                endingCrown.y += 16
                endingCrown.ay = 100
                endingCrown.vy = -100
                endingCrown.fx = 10
                endingCrown.vx = -10
                endingCrown.setFlag(SpriteFlag.GhostThroughWalls, true)
                pause(500)
                endingCrown.setFlag(SpriteFlag.GhostThroughWalls, false)
                pause(1500)
                ninja.vx = 30
                ninja.ay = 0
                ninja.setFlag(SpriteFlag.GhostThroughTiles, true)
                ninja.setFlag(SpriteFlag.GhostThroughWalls, true)
                pause(3500)
                color.startFadeFromCurrent(color.Black, 1000)
                timer.after(1000, function(){
                    // credits sequence
                    creditsOnScreenTime = game.runtime()
                    tiles.setCurrentTilemap(tilemap`level1`)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Box)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
                    sprites.destroyAllSpritesOfKind(SpriteKind.FastEnemy)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Swapper)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Helper)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Ghost)
                    scene.setBackgroundColor(15)
                    color.startFadeFromCurrent(color.originalPalette, 1000)
                    timer.after(1000, function() {
                        creditsActive = true
                    })
                    MusicController.playTheme1()
                    let credits1 = sprites.create(assets.image`credits1`, SpriteKind.Text)
                    credits1.setFlag(SpriteFlag.RelativeToCamera, true)
                    credits1.setPosition(80, 180)
                    credits1.setVelocity(0, -20)
                    let credits2 = sprites.create(assets.image`credits2`, SpriteKind.Text)
                    credits2.setFlag(SpriteFlag.RelativeToCamera, true)
                    credits2.setPosition(80, 300)
                    credits2.setVelocity(0, -20)
                    let credits3 = sprites.create(assets.image`credits3`, SpriteKind.Text)
                    credits3.setFlag(SpriteFlag.RelativeToCamera, true)
                    credits3.setPosition(80, 420)
                    credits3.setVelocity(0, -20)
                    pause(18700)
                    credits1.setVelocity(0,0)
                    credits2.setVelocity(0, 0)
                    credits3.setVelocity(0, 0)
                })
            }
        })
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile71`, function (sprite, location) {
    helperBird.sayText("My brain is huge", 100, false)
})
function makeGoblinAppear () {
    finalboss = sprites.create(assets.image`goblin`, SpriteKind.Goblin)
    tiles.placeOnTile(finalboss, tiles.getTileLocation(0, 11))
    finalboss.x += -60
    finalboss.setVelocity(30, 0)
}
function gameOverWin() {
    let curScore = info.score()
    if (curScore >= 11) {
        game.showLongText("Wow! You collected all 11 coins! Ask a sensei for a golden sticker on your folder.", DialogLayout.Full)
    } else {
        game.showLongText("Great job! You collected " + curScore + " of the 11 coins! If you collect them all, you get a special sticker for your folder!", DialogLayout.Full)
    }
    game.setGameOverMessage(true, "You won in " + convertToText(creditsOnScreenTime / 1000) + " seconds!")
    game.gameOver(true)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (titleActive) {
        doTitleSequence()
        titleActive = false;
        return;
    }

    if (creditsActive) {
        gameOverWin()
    }
    if (gameStarted) {
        if (!(cutscene)) {
            if (ammoReady) {
                throwRock()
                ammoReady = false
            } else {
                music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
                if (newRock) {
                    sprites.destroy(newRock)
                }
            }
        }
    } else {
        startGame()
    }
})
function startGame () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    scene.setBackgroundImage(assets.image`tmp`)
    color.setPalette(
    color.originalPalette
    )
    scene.setBackgroundColor(12)
    createNinja()
    setupEffects()
    gameStarted = true
    lastPressedLeft = false
    ammoReady = true
    curLevel = 1
    startLevel(curLevel)
}
function buildLevel8Boxes () {
    placeBox(13, 28, 0)
    placeBox(22, 23, 6)
    placeBox(23, 23, 6)
    placeBox(23, 22, 2)
    placeBox(18, 16, 0)
    placeBox(21, 10, 4)
    placeBox(6, 24, 4)
}
function buildLevel9Boxes() {
    placeBox(19, 13, 0)
    placeBox(50, 1, 0)
    placeBox(74, 8, 4)
    placeBox(103, 12, 0)
    placeBox(105, 12, 0)
    placeBox(114, 8, 0)
    placeBox(117, 8, 0)
    placeBox(148, 3, 0)
    placeBox(155, 1, 0)
    placeBox(157, 1, 0)
    placeBox(159, 1, 0)
    placeBox(162, 1, 0)
}
function spawnLevel4Enemies () {
    spawnFastEnemy(10, 5, 1)
    spawnEnemy(4, 13, 1)
}
function spawnLevel7Enemies () {
    spawnEnemy(24, 23, 1)
    spawnEnemy(26, 20, -1)
    spawnEnemy(15, 10, -1)
}
function setupEffects () {
    headbandTrail = extraEffects.createCustomSpreadEffectData(
    [1],
    false,
    [1],
    extraEffects.createPercentageRange(1, 1),
    extraEffects.createPercentageRange(1, 1),
    extraEffects.createTimeRange(350, 200),
    0,
    0,
    extraEffects.createPercentageRange(0, 0),
    0,
    0,
    0
    )
    headbandTrail.gravity = 100
    // sasha made this ice cream cone! swapper9
    // arthur made this pizza! swapper10
    // kendrick made this ammo and fries! swapper11, swapper15
    // tiger made this top hat! swapper12
    // brandon made this burger and banana! swapper13, swapper14
    // agyenim made this heart! swapper16
    swapperImages = [
    assets.image`swapper1`,
    assets.image`swapper2`,
    assets.image`swapper3`,
    assets.image`swapper4`,
    assets.image`swapper5`,
    assets.image`swapper6`,
    assets.image`swapper7`,
    assets.image`swapper8`,
    assets.image`swapper9`,
    assets.image`swapper10`,
    assets.image`swapper11`,
    assets.image`swapper12`,
    assets.image`swapper13`,
    assets.image`swapper14`,
    assets.image`swapper15`,
    assets.image`swapper16`
    ]
    prevImage = assets.image`swapper4`
    newSwapperImage = prevImage
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile33`, function (sprite, location) {
    scene.setBackgroundColor(9)
    scene.setBackgroundImage(assets.image`tmp`)
    curLevel = 7
    startLevel(curLevel)
    timer.after(1, function () {
        rockTutorialSkip()
    })    
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile25`, function (sprite, location) {
    curLevel += 1
    startLevel(curLevel)
})
function createNinja () {
    ninja = sprites.create(assets.image`ninja1`, SpriteKind.Player)
    controller.moveSprite(ninja, 30, 0)
    ninja.ay = 150
    ninja.z = 1
    ninja.setStayInScreen(true)
    scene.cameraFollowSprite(ninja)
    
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    lastPressedLeft = true
})
function spawnLevel3Enemies () {
    spawnFastEnemy(2, 13, 1)
    spawnEnemy(13, 6, 1)
}
function stopMoving (sprite: Sprite) {
    sprite.setVelocity(0, 0)
    sprites.setDataBoolean(sprite, "moving", false)
}
function buildLevel3Boxes () {
    placeBox(15, 11, 0)
    placeBox(5, 10, 0)
    placeBox(5, 9, 4)
    placeBox(6, 10, 0)
    placeBox(8, 5, 4)
    placeBox(13, 6, 0)
    placeBox(15, 6, 0)
}
scene.onHitWall(SpriteKind.Goblin, function (sprite, location) {
    if (sprites.readDataString(crown_of_power, "state") == "attachedToGoblin") {
        finalboss.ay = 0
    }
})
function buildLevel1Boxes () {
    placeBox(5, 13, 0)
    placeBox(6, 13, 0)
    placeBox(5, 12, 4)
    placeBox(14, 13, 0)
    placeBox(9, 9, 0)
    placeBox(10, 9, 0)
    placeBox(15, 5, 0)
}
function throwRock () {
    if (curLevel < 5) return;
    if (lastPressedLeft) {
        direction = -1
    } else {
        direction = 1
    }
    newRock = sprites.create(assets.image`rock`, SpriteKind.Rock)
    newRock.setPosition(ninja.x, ninja.y)
    newRock.setVelocity(50 * direction + ninja.vx, -40 + ninja.vy)
    newRock.z = 50
    newRock.fx = 50
    newRock.ay = 100
    newRock.fy = 1000
    newRock.setBounceOnWall(true)
    extraEffects.createSpreadEffectOnAnchor(newRock, extraEffects.createSingleColorSpreadEffectData(10, ExtraEffectPresetShape.Twinkle), 1000, 0, 100)
    if (Math.percentChance(50)) {
        music.play(music.createSoundEffect(WaveShape.Square, 166, 35, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    } else {
        music.play(music.createSoundEffect(WaveShape.Square, 342, 35, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    }
}
function jumpEnemy (sprite: Sprite) {
    if (sprite.vx > 0) {
        sprites.setDataNumber(sprite, "direction", 1)
    } else {
        sprites.setDataNumber(sprite, "direction", -1)
    }
    sprite.ay = 150
    sprite.setVelocity(0, -50)
    timer.after(randint(2500, 4500), function () {
        jumpEnemy(sprite)
    })
}
function buildLevel2Boxes () {
    placeBox(8, 12, 0)
    placeBox(7, 13, 4)
    placeBox(8, 13, 4)
    placeBox(5, 10, 4)
    placeBox(15, 10, 0)
    placeBox(17, 10, 0)
    placeBox(9, 4, 0)
    placeBox(10, 4, 0)
    placeBox(9, 3, 2)
    placeBox(9, 2, 4)
}
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Right) || sprite.isHittingTile(CollisionDirection.Left)) {
        sprite.vx = 0 - sprite.vx
    } else if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        sprite.ay = 0
        sprite.setVelocity(35 * sprites.readDataNumber(sprite, "direction"), 0)
    }
})
function rockLanded (sprite: Sprite) {
    sprite.setBounceOnWall(false)
    sprite.setVelocity(0, 0)
    sprite.ay = 0
    sprite.lifespan = 2000
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    lastPressedLeft = false
})
function replaceTilesWithSwords () {
    for (let value3 of tiles.getTilesByType(assets.tile`myTile119`)) {
        tiles.setTileAt(value3, assets.tile`myTile74`)
        shuriken1 = sprites.create(assets.image`greenShuriken`, SpriteKind.Shuriken)
        tiles.placeOnTile(shuriken1, value3)
    }
    for (let value4 of tiles.getTilesByType(assets.tile`myTile117`)) {
        tiles.setTileAt(value4, assets.tile`myTile74`)
        shuriken2 = sprites.create(assets.image`redShuriken`, SpriteKind.Shuriken)
        tiles.placeOnTile(shuriken2, value4)
    }
    for (let value5 of tiles.getTilesByType(assets.tile`myTile121`)) {
        tiles.setTileAt(value5, assets.tile`myTile74`)
        shuriken3 = sprites.create(assets.image`yellowShuriken`, SpriteKind.Shuriken)
        tiles.placeOnTile(shuriken3, value5)
    }
}
sprites.onDestroyed(SpriteKind.Rock, function (sprite) {
    ammoReady = true
    invincible = true
    if (!(cutscene)) {
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(1, ExtraEffectPresetShape.Spark), ninja.x, ninja.y, 200, 20, 20)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(10, ExtraEffectPresetShape.Spark), ninja.x, ninja.y, 200, 15, 5)
        spawnSwapper()
        tiles.placeOnTile(ninja, sprite.tilemapLocation())
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(1, ExtraEffectPresetShape.Spark), ninja.x, ninja.y, 200, 20, 20)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(10, ExtraEffectPresetShape.Spark), ninja.x, ninja.y, 200, 15, 5)
        music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.Goblin, SpriteKind.Crown, function (sprite, otherSprite) {
    sprites.setDataString(crown_of_power, "state", "attachedToGoblin")
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile91`, function (sprite, location) {
    if (!(fall)) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Box)
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.FastEnemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Food)
        sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
        sprites.destroyAllSpritesOfKind(SpriteKind.Swapper)
        sprites.destroyAllSpritesOfKind(SpriteKind.Helper)
        sprites.destroyAllSpritesOfKind(SpriteKind.Ghost)
        fall = 0
        ninja.fx = 0
        finalboss.setPosition(-100, -100)
        goblin_hand.setPosition(-100, -100)
        sprites.destroy(tmp)
    }
    if (fall == 0) {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level52`))
        tiles.placeOnTile(ninja, tiles.getTileLocation(31, 0))
        fall += 1
    } else if (fall == 1) {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level54`))
        tiles.placeOnTile(ninja, tiles.getTileLocation(28, 0))
        fall += 1
    } else if (fall == 2) {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level56`))
        tiles.placeOnTile(ninja, tiles.getTileLocation(22, 0))
        fall += 1
    } else {
        curLevel += 1
        startLevel(curLevel)
    }
    curRespawn = ninja.tilemapLocation()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ParachutingEnemy, function (sprite, otherSprite) {
    touchingABox = 0
    for (let value22 of sprites.allOfKind(SpriteKind.Box)) {
        if (sprite.overlapsWith(value22)) {
            touchingABox = 1
        }
    }
    if (!(touchingABox) && !(invincible)) {
        resetPlayer(sprite)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.FastEnemy, function (sprite, otherSprite) {
    touchingABox = 0
    for (let value22 of sprites.allOfKind(SpriteKind.Box)) {
        if (sprite.overlapsWith(value22)) {
            touchingABox = 1
        }
    }
    if (!(touchingABox) && !(invincible)) {
        resetPlayer(sprite)
    }
})
function spawnLevel8Enemies () {
    spawnEnemy(5, 15, -1)
    spawnFastEnemy(6, 24, 1)
}
function spawnLevel9Enemies () {
    spawnFastEnemy(64, 13, 1)
    spawnEnemy(77, 13, 1)
    spawnEnemy(83, 13, -1)
    spawnEnemy(106, 8, 1)
    spawnEnemy(116, 8, -1)
    //spawnEnemy(117, 4, 1)
    spawnFastEnemy(130, 13, 1)
    spawnFastEnemy(146, 13, -1)
}
function rockTutorial () {
    cutscene = true
    controller.moveSprite(ninja, 0, 0)
    MusicController.playTutorialTheme()
    BGoverlay = sprites.create(assets.image`BGOverlay`, SpriteKind.Helper)
    BGoverlay.z = 1000
    BGoverlay.setFlag(SpriteFlag.RelativeToCamera, true)
    pause(1000)
    rockThrowDemo = sprites.create(assets.image`rockThrowDemo`, SpriteKind.Helper)
    rockThrowDemo.z = 1001
    rockThrowDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockThrowDemo.setPosition(80, 40)
    introduceDemo(rockThrowDemo)
    game.showLongText("Press spacebar to throw a rock forwards!", DialogLayout.Bottom)
    sprites.destroy(rockThrowDemo)
    rockMomentumDemo = sprites.create(assets.image`rockMomentumDemo`, SpriteKind.Helper)
    rockMomentumDemo.z = 1001
    rockMomentumDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockMomentumDemo.setPosition(80, 40)
    introduceDemo(rockMomentumDemo)
    game.showLongText("Move while throwing the rock to give it momentum!", DialogLayout.Bottom)
    sprites.destroy(rockMomentumDemo)
    rockTeleportDemo = sprites.create(img`
        .............5555555555...............................
        .............5ffffffff5...............................
        .............5888888885...............................
        .............5888888885.............55................
        .............5dffddffd5............5ff5...............
        .............5d18dd81d5...........5fdaf5..............
        .............5ffffffff5..........5faaaaf5.............
        .............5ffffffff5...........5ffff5..............
        .............5ffffffff5............5555...............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        ......................................................
        ..................f...................................
        .................f7f..................................
        ..............aaaf7f.aa...........aaaaa..aa...........
        ............aaaafddf.aa1........aaaa11aa.aa1..........
        ..........11aaaaf7f1.a11......11aaaa1111.a11..........
        ..........1..11fddf1111.......1.55555555551...5..5....
        ...........a111f7f11111........a5ffffffff51...5..5....
        ...........a1111f...aaa........a5888888885a...........
        ..........aaa1111a..aaaa......aa5888888885aa.5....5...
        ..........aaa1111aa11aaa......aa5dffddffd5aa..5555....
        ................aa.11a111.......5d18dd81d5111.........
        ...........11aa.......111......15ffffffff5111.........
        ...........11aa11..aaa11.......15ffffffff511..........
        .........aaaaaa.1..aaa........aa5ffffffff5............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        .......77777777777777777777777777777777777777777......
        .......7fffffffffffffffffffffffffffffffffffffff7......
        .......7ffffff7777f7777fff777fff7777f77777fffff7......
        .......7fffff7fffff7fff7f7fff7f7fffff7fffffffff7......
        .......7ffffff777ff7777ff77777f7fffff777fffffff7......
        .......7fffffffff7f7fffff7fff7f7fffff7fffffffff7......
        .......7fffff7777ff7fffff7fff7ff7777f77777fffff7......
        .......7fffffffffffffffffffffffffffffffffffffff7......
        .......77777777777777777777777777777777777777777......
    `, SpriteKind.Helper)
    rockTeleportDemo.z = 1001
    rockTeleportDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockTeleportDemo.setPosition(80, 40)
    introduceDemo(rockTeleportDemo)
    game.showLongText("Press spacebar again to teleport to the rock!", DialogLayout.Bottom)
    sprites.destroy(rockTeleportDemo)
    rockTimerDemo = sprites.create(img`
        ..................................ffffff..............
        .................................f111aaaf.............
        ................................f1111aaaaf............
        ................................f1111aaaaf............
        ................................faa11aaaaf............
        ................................faaaaaaaaf............
        ................................faaaaaaaaf............
        ................................faaaaaaaaf............
        .............5555555555..........faaaaaaf.............
        .............5ffffffff5...........ffffff..............
        .............5888888885...............................
        .............5888888885.............55................
        .............5dffddffd5............5ff5...............
        .............5d18dd81d5...........5fdaf5..............
        .............5ffffffff5..........5faaaaf5.............
        .............5ffffffff5...........5ffff5..............
        .............5ffffffff5............5555...............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        ......................................................
        ..................f...................................
        .................f7f..................................
        ..............aaaf7f.aa...........aaaaa..aa...........
        ............aaaafddf.aa1........aaaa11aa.aa1..........
        ..........11aaaaf7f1.a11......11aaaa1111.a11..........
        ..........1..11fddf1111.......1.55555555551...5..5....
        ...........a111f7f11111........a5ffffffff51...5..5....
        ...........a1111f...aaa........a5888888885a...........
        ..........aaa1111a..aaaa......aa5888888885aa..5555....
        ..........aaa1111aa11aaa......aa5dffddffd5aa.5....5...
        ................aa.11a111.......5d18dd81d5111.........
        ...........11aa.......111......15ffffffff5111.........
        ...........11aa11..aaa11.......15ffffffff511..........
        .........aaaaaa.1..aaa........aa5ffffffff5............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
    `, SpriteKind.Helper)
    rockTimerDemo.z = 1001
    rockTimerDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockTimerDemo.setPosition(80, 40)
    introduceDemo(rockTimerDemo)
    game.showLongText("If the rock sits in place too long, you will teleport to it!", DialogLayout.Bottom)
    sprites.destroy(rockTimerDemo)
    sprites.destroy(BGoverlay)
    MusicController.playTheme1()
    cutscene = false
    controller.moveSprite(ninja, 30, 0)
}
function rockTutorialSkip() {
    cutscene = true
    controller.moveSprite(ninja, 0, 0)
    MusicController.playTutorialTheme()
    BGoverlay = sprites.create(assets.image`BGOverlay`, SpriteKind.Helper)
    BGoverlay.z = 1000
    BGoverlay.setFlag(SpriteFlag.RelativeToCamera, true)
    pause(1000)
    rockThrowDemo = sprites.create(assets.image`rockThrowDemo`, SpriteKind.Helper)
    rockThrowDemo.z = 1001
    rockThrowDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockThrowDemo.setPosition(80, 40)
    introduceDemo(rockThrowDemo)
    game.showLongText("Press spacebar to throw a rock forwards!", DialogLayout.Bottom)
    sprites.destroy(rockThrowDemo)
    rockMomentumDemo = sprites.create(assets.image`rockMomentumDemo`, SpriteKind.Helper)
    rockMomentumDemo.z = 1001
    rockMomentumDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockMomentumDemo.setPosition(80, 40)
    introduceDemo(rockMomentumDemo)
    game.showLongText("Move while throwing the rock to give it momentum!", DialogLayout.Bottom)
    sprites.destroy(rockMomentumDemo)
    rockTeleportDemo = sprites.create(img`
        .............5555555555...............................
        .............5ffffffff5...............................
        .............5888888885...............................
        .............5888888885.............55................
        .............5dffddffd5............5ff5...............
        .............5d18dd81d5...........5fdaf5..............
        .............5ffffffff5..........5faaaaf5.............
        .............5ffffffff5...........5ffff5..............
        .............5ffffffff5............5555...............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        ......................................................
        ..................f...................................
        .................f7f..................................
        ..............aaaf7f.aa...........aaaaa..aa...........
        ............aaaafddf.aa1........aaaa11aa.aa1..........
        ..........11aaaaf7f1.a11......11aaaa1111.a11..........
        ..........1..11fddf1111.......1.55555555551...5..5....
        ...........a111f7f11111........a5ffffffff51...5..5....
        ...........a1111f...aaa........a5888888885a...........
        ..........aaa1111a..aaaa......aa5888888885aa.5....5...
        ..........aaa1111aa11aaa......aa5dffddffd5aa..5555....
        ................aa.11a111.......5d18dd81d5111.........
        ...........11aa.......111......15ffffffff5111.........
        ...........11aa11..aaa11.......15ffffffff511..........
        .........aaaaaa.1..aaa........aa5ffffffff5............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        .......77777777777777777777777777777777777777777......
        .......7fffffffffffffffffffffffffffffffffffffff7......
        .......7ffffff7777f7777fff777fff7777f77777fffff7......
        .......7fffff7fffff7fff7f7fff7f7fffff7fffffffff7......
        .......7ffffff777ff7777ff77777f7fffff777fffffff7......
        .......7fffffffff7f7fffff7fff7f7fffff7fffffffff7......
        .......7fffff7777ff7fffff7fff7ff7777f77777fffff7......
        .......7fffffffffffffffffffffffffffffffffffffff7......
        .......77777777777777777777777777777777777777777......
    `, SpriteKind.Helper)
    rockTeleportDemo.z = 1001
    rockTeleportDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockTeleportDemo.setPosition(80, 40)
    introduceDemo(rockTeleportDemo)
    game.showLongText("Press spacebar again to teleport to the rock!", DialogLayout.Bottom)
    sprites.destroy(rockTeleportDemo)
    rockTimerDemo = sprites.create(img`
        ..................................ffffff..............
        .................................f111aaaf.............
        ................................f1111aaaaf............
        ................................f1111aaaaf............
        ................................faa11aaaaf............
        ................................faaaaaaaaf............
        ................................faaaaaaaaf............
        ................................faaaaaaaaf............
        .............5555555555..........faaaaaaf.............
        .............5ffffffff5...........ffffff..............
        .............5888888885...............................
        .............5888888885.............55................
        .............5dffddffd5............5ff5...............
        .............5d18dd81d5...........5fdaf5..............
        .............5ffffffff5..........5faaaaf5.............
        .............5ffffffff5...........5ffff5..............
        .............5ffffffff5............5555...............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
        ......................................................
        ......................................................
        ......................................................
        ..................f...................................
        .................f7f..................................
        ..............aaaf7f.aa...........aaaaa..aa...........
        ............aaaafddf.aa1........aaaa11aa.aa1..........
        ..........11aaaaf7f1.a11......11aaaa1111.a11..........
        ..........1..11fddf1111.......1.55555555551...5..5....
        ...........a111f7f11111........a5ffffffff51...5..5....
        ...........a1111f...aaa........a5888888885a...........
        ..........aaa1111a..aaaa......aa5888888885aa..5555....
        ..........aaa1111aa11aaa......aa5dffddffd5aa.5....5...
        ................aa.11a111.......5d18dd81d5111.........
        ...........11aa.......111......15ffffffff5111.........
        ...........11aa11..aaa11.......15ffffffff511..........
        .........aaaaaa.1..aaa........aa5ffffffff5............
        1..11...11111111111111111111111111111111111111...11..1
        ............111111111111111111111111111111............
    `, SpriteKind.Helper)
    rockTimerDemo.z = 1001
    rockTimerDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    rockTimerDemo.setPosition(80, 40)
    introduceDemo(rockTimerDemo)
    game.showLongText("If the rock sits in place too long, you will teleport to it!", DialogLayout.Bottom)
    sprites.destroy(rockTimerDemo)
    sprites.destroy(BGoverlay)
    MusicController.playTheme2()
    cutscene = false
    controller.moveSprite(ninja, 30, 0)
    Evil_Ghost = sprites.create(assets.image`ghost`, SpriteKind.Ghost)
    tiles.placeOnTile(Evil_Ghost, tiles.getTileLocation(4, 27))
    Evil_Ghost.follow(ninja, 15)
    Evil_Ghost.setFlag(SpriteFlag.GhostThroughWalls, true)
    Evil_Ghost.z = 999
}
function jumpAllEnemies () {
    for (let value32 of sprites.allOfKind(SpriteKind.Enemy)) {
        jumpEnemy(value32)
    }
    for (let value322 of sprites.allOfKind(SpriteKind.FastEnemy)) {
        jumpFastEnemy(value322)
    }
}
function spawnLevel6Enemies () {
    spawnEnemy(40, 6, -1)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted && !(cutscene)) {
        if (ninja.tileKindAt(TileDirection.Center, assets.tile`myTile16`) || (ninja.tileKindAt(TileDirection.Center, assets.tile`myTile22`) || (ninja.tileKindAt(TileDirection.Center, assets.tile`myTile88`) || ninja.tileKindAt(TileDirection.Center, assets.tile`myTile89`)))) {
            if (ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile16`) || ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile88`)) {
                tiles.setWallAt(ninja.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), false)
                tiles.placeOnTile(ninja, ninja.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom))
                tiles.setWallAt(ninja.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
                if (Math.percentChance(50)) {
                    music.play(music.createSoundEffect(WaveShape.Triangle, 342, 298, 255, 255, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                } else {
                    music.play(music.createSoundEffect(WaveShape.Triangle, 518, 298, 255, 255, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                }
            }
        }
    }
})
function buildLevel6Boxes () {
    placeBox(6, 13, 4)
    placeBox(8, 4, 0)
    placeBox(9, 4, 0)
    placeBox(8, 3, 4)
    placeBox(11, 13, 4)
    placeBox(40, 6, 0)
}
function spawnLevel5Enemies () {
    spawnFastEnemy(13, 13, 1)
    spawnEnemy(3, 13, -1)
    spawnFastEnemy(11, 5, 1)
}
info.onLifeZero(function () {
    game.setGameOverMessage(false, "You lost at level " + curLevel + ".")
    game.gameOver(false)
})
function startTutorial () {
    cutscene = true
    controller.moveSprite(ninja, 0, 0)
    MusicController.playTutorialTheme()
    BGoverlay = sprites.create(assets.image`BGOverlay`, SpriteKind.Helper)
    BGoverlay.z = 10000
    pause(1000)
    playerMoveDemo = sprites.create(assets.image`playerMoveDemo`, SpriteKind.Helper)
    playerMoveDemo.z = 10001
    playerMoveDemo.setPosition(80, 40)
    introduceDemo(playerMoveDemo)
    game.showLongText("Use the arrow keys or WASD to move and jump!", DialogLayout.Bottom)
    sprites.destroy(playerMoveDemo)
    playerHideDemo = sprites.create(assets.image`playerHideDemo`, SpriteKind.Helper)
    playerHideDemo.z = 10001
    playerHideDemo.setPosition(80, 40)
    introduceDemo(playerHideDemo)
    game.showLongText("Hide behind boxes to be safe from enemies!", DialogLayout.Bottom)
    sprites.destroy(playerHideDemo)
    sprites.destroy(BGoverlay)
    MusicController.playTheme1()
    cutscene = false
    controller.moveSprite(ninja, 30, 0)
}
function bossTutorial() {
    cutscene = true
    controller.moveSprite(ninja, 0, 0)
    MusicController.playTutorialTheme()
    BGoverlay = sprites.create(assets.image`BGOverlay`, SpriteKind.Helper)
    BGoverlay.z = 10000
    BGoverlay.setFlag(SpriteFlag.RelativeToCamera, true)
    pause(1000)
    let shurikenDemo = sprites.create(assets.image`shurikenDemo`, SpriteKind.Helper)
    shurikenDemo.z = 10001
    shurikenDemo.setPosition(80, 40)
    shurikenDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    introduceDemo(shurikenDemo)
    game.showLongText("Touch shurikens to damage the boss goblin!", DialogLayout.Bottom)
    sprites.destroy(shurikenDemo)
    let parachuteDemo = sprites.create(assets.image`parachuteDemo`, SpriteKind.Helper)
    parachuteDemo.z = 10001
    parachuteDemo.setPosition(80, 40)
    parachuteDemo.setFlag(SpriteFlag.RelativeToCamera, true)
    introduceDemo(parachuteDemo)
    game.showLongText("Dodge and hide from the parachuting goblins!", DialogLayout.Bottom)
    sprites.destroy(parachuteDemo)
    sprites.destroy(BGoverlay)
    MusicController.playBossTheme()
    cutscene = false
    controller.moveSprite(ninja, 30, 0)
}
function doTitleSequence () {
    scene.setBackgroundImage(assets.image`tmp`)
    game.setGameOverEffect(false, effects.slash)
    playerGrabbed = false
    gameStarted = false
    MusicController.playTheme2()
    text1 = sprites.create(assets.image`story1`, SpriteKind.Text)
    text1.setPosition(80, 180)
    text1.setVelocity(0, -20)
    text2 = sprites.create(assets.image`story2`, SpriteKind.Text)
    text2.setPosition(80, 300)
    text2.setVelocity(0, -20)
    text3 = sprites.create(assets.image`story3`, SpriteKind.Text)
    text3.setPosition(80, 420)
    text3.setVelocity(0, -20)
    timer.after(24500, function () {
        if (!(gameStarted)) {
            color.setPalette(
            color.Black
            )
        }
    })
    timer.after(25000, function () {
        if (!(gameStarted)) {
            color.startFadeFromCurrent(color.originalPalette, 1000)
            scene.setBackgroundImage(assets.image`story4`)
        }
    })
}
function replaceTileWithCrown () {
    for (let value6 of tiles.getTilesByType(assets.tile`myTile90`)) {
        tiles.setTileAt(value6, assets.tile`myTile74`)
        crown_of_power = sprites.create(assets.image`crown`, SpriteKind.Crown)
        tiles.placeOnTile(crown_of_power, value6)
        crown_of_power.setFlag(SpriteFlag.GhostThroughWalls, true)
        sprites.setDataString(crown_of_power, "state", "idle")
        sprites.setDataBoolean(crown_of_power, "moving", false)
        animation.runImageAnimation(
        crown_of_power,
        assets.animation`crownAnim`,
        50,
        true
        )
    }
}
function spawnLevel2Enemies () {
    spawnEnemy(3, 13, 1)
    spawnEnemy(14, 10, -1)
    spawnEnemy(9, 4, 1)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile87`, function (sprite, location) {
    helperBird.sayText("Those dastardly goblins wrecked the place!", 100, false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(1, ExtraEffectPresetShape.Twinkle), otherSprite.x, otherSprite.y, 100, 30, 30)
    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(9, ExtraEffectPresetShape.Twinkle), otherSprite.x, otherSprite.y, 100, 25, 30)
    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(5, ExtraEffectPresetShape.Spark), otherSprite.x, otherSprite.y, 100, 20, 30)
    sprites.destroy(otherSprite)
})
function introduceDemo (mySprite: Sprite) {
    mySprite.scale = 0.5
    music.play(music.createSoundEffect(WaveShape.Sine, 869, 3196, 255, 255, 500, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    for (let index = 0; index < 10; index++) {
        pause(40)
        mySprite.setPosition(80, 40)
        mySprite.scale += 0.05
    }
    mySprite.scale = 1
    pause(500)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile31`, function (sprite, location) {
    if (tileUtil.currentTilemap() == greenBeltTilemap) {
        tileUtil.loadConnectedMap(MapConnectionKind.Door1)
        scene.setBackgroundImage(assets.image`secretDungeonBG`)
        tiles.placeOnTile(ninja, tiles.getTileLocation(8, 13))
        sprites.destroyAllSpritesOfKind(SpriteKind.Box)
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.FastEnemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Food)
        sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
        sprites.destroyAllSpritesOfKind(SpriteKind.Swapper)
    } else {
        tileUtil.loadConnectedMap(MapConnectionKind.Door1)
        scene.setBackgroundImage(assets.image`tmp`)
        tiles.placeOnTile(ninja, tiles.getTileLocation(16, 13))
        buildLevel4Boxes()
        spawnLevel4Enemies()
        placeCoin(1, 6, 4, 4)
        jumpAllEnemies()
    }
})
function buildLevel4Boxes () {
    placeBox(9, 13, 4)
    placeBox(10, 12, 0)
    placeBox(10, 13, 4)
    placeBox(5, 13, 0)
    placeBox(8, 5, 0)
    placeBox(10, 5, 0)
}
function resetPlayer (sprite: Sprite) {
    timer.throttle("action", 50, function () {
        sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
        sprites.destroyAllSpritesOfKind(SpriteKind.Swapper)
        sprites.destroyAllSpritesOfKind(SpriteKind.Parachute)
        sprites.destroyAllSpritesOfKind(SpriteKind.ParachutingEnemy)
        music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
        info.changeLifeBy(-1)
        tiles.placeOnTile(sprite, curRespawn)
        waveSpawned = false
        if (cameraLock) {
            cameraLock.x = sprite.x
        }
        if (Evil_Ghost) {
            tiles.placeOnTile(Evil_Ghost, tiles.getTileLocation(4, 27))
        }
    })
}
scene.onHitWall(SpriteKind.Rock, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        if (sprite.vy < 10) {
            rockLanded(sprite)
        }
        sprite.vy = -0.6 * newRock.vy
    }
    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(10, ExtraEffectPresetShape.Twinkle), sprite.x, sprite.y, 100, 5, 1)
    extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(1, ExtraEffectPresetShape.Twinkle), sprite.x, sprite.y, 100, 5, 3)
    music.play(music.melodyPlayable(music.footstep), music.PlaybackMode.InBackground)
})
function buildLevel5Boxes () {
    placeBox(10, 13, 4)
    placeBox(14, 13, 4)
    placeBox(1, 13, 4)
    placeBox(3, 13, 4)
    placeBox(3, 13, 4)
    placeBox(16, 5, 6)
    placeBox(17, 5, 6)
    placeBox(17, 4, 4)
}
function spawnEnemy (col: number, row: number, direction: number) {
    newBadGuy = sprites.create(assets.image`goblin`, SpriteKind.Enemy)
    newBadGuy.z = 300
    tiles.placeOnTile(newBadGuy, tiles.getTileLocation(col, row))
    newBadGuy.setVelocity(50 * direction, 0)
}
function buildLevel7Boxes () {
    placeBox(25, 20, 0)
    placeBox(25, 4, 0)
}
function startLevel (level: number) {
    sprites.destroyAllSpritesOfKind(SpriteKind.Box)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.FastEnemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
    sprites.destroyAllSpritesOfKind(SpriteKind.Swapper)
    sprites.destroyAllSpritesOfKind(SpriteKind.Helper)
    sprites.destroyAllSpritesOfKind(SpriteKind.Ghost)
    ammoReady = true
    profilelife.setMaxLife(5)
    info.setLife(5)
    profilelife.setEmptyLifeImage(assets.image`life0`)
    profilelife.setBackgroundBorder(0, 0)
    if (level == 1) {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level4`))
        profilelife.setFilledLifeImage(assets.image`life1`)
        headbandTrail.setSpreadEffectDataColorLookupTable([1])
        tiles.placeOnTile(ninja, tiles.getTileLocation(2, 13))
        startTutorial()
        buildLevel1Boxes()
        spawnLevel1Enemies()
        placeCoin(5, 5, 4, 0)
    } else if (level == 2) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level8`))
        profilelife.setFilledLifeImage(assets.image`life2`)
        ninja.setImage(assets.image`ninja2`)
        headbandTrail.setSpreadEffectDataColorLookupTable([5])
        tiles.placeOnTile(ninja, tiles.getTileLocation(18, 13))
        buildLevel2Boxes()
        spawnLevel2Enemies()
        placeCoin(2, 3, 4, 0)
    } else if (level == 3) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level12`))
        profilelife.setFilledLifeImage(assets.image`life3`)
        ninja.setImage(assets.image`ninja3`)
        headbandTrail.setSpreadEffectDataColorLookupTable([14])
        tiles.placeOnTile(ninja, tiles.getTileLocation(6, 13))
        buildLevel3Boxes()
        spawnLevel3Enemies()
        placeCoin(2, 3, 0, 0)
    } else if (level == 4) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        greenBeltTilemap = tileUtil.createSmallMap(tilemap`level18`)
        secretDungeonTilemap = tileUtil.createSmallMap(tilemap`level22`)
        tileUtil.connectMaps(greenBeltTilemap, secretDungeonTilemap, MapConnectionKind.Door1)
        tiles.setCurrentTilemap(greenBeltTilemap)
        profilelife.setFilledLifeImage(assets.image`life4`)
        ninja.setImage(assets.image`ninja4`)
        headbandTrail.setSpreadEffectDataColorLookupTable([7])
        tiles.placeOnTile(ninja, tiles.getTileLocation(9, 13))
        buildLevel4Boxes()
        spawnLevel4Enemies()
        placeCoin(1, 6, 4, 4)
    } else if (level == 5) {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level35`))
        profilelife.setFilledLifeImage(assets.image`life5`)
        ninja.setImage(assets.image`ninja5`)
        headbandTrail.setSpreadEffectDataColorLookupTable([8])
        tiles.placeOnTile(ninja, tiles.getTileLocation(2, 23))
        helperBird = sprites.create(assets.image`bird1`, SpriteKind.Helper)
        tiles.placeOnTile(helperBird, tiles.getTileLocation(6, 19))
        helperBird.sayText("Hi")
        buildLevel5Boxes()
        spawnLevel5Enemies()
        placeCoin(7, 7, 0, 0)
        timer.after(1, function () {
            rockTutorial()
        })
    } else if (level == 6) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        MusicController.playTheme2()
        scene.setBackgroundColor(9)
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`purplebelt`))
        profilelife.setFilledLifeImage(assets.image`life6`)
        ninja.setImage(assets.image`ninja6`)
        headbandTrail.setSpreadEffectDataColorLookupTable([6])
        tiles.placeOnTile(ninja, tiles.getTileLocation(3, 13))
        helperBird = sprites.create(assets.image`bird2`, SpriteKind.Helper)
        tiles.placeOnTile(helperBird, tiles.getTileLocation(23, 8))
        helperBird.sayText(":(")
        buildLevel6Boxes()
        spawnLevel6Enemies()
        placeCoin(21, 1, 0, 4)
    } else if (level == 7) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`brownbelt`))
        profilelife.setFilledLifeImage(assets.image`life7`)
        ninja.setImage(assets.image`ninja7`)
        headbandTrail.setSpreadEffectDataColorLookupTable([4])
        tiles.placeOnTile(ninja, tiles.getTileLocation(15, 28))
        buildLevel7Boxes()
        spawnLevel7Enemies()
        placeCoin(7, 6, 0, 0)
        placeCoin(27, 14, 0, 0)
    } else if (level == 8) {
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level42`))
        profilelife.setFilledLifeImage(assets.image`life8`)
        ninja.setImage(assets.image`ninja8`)
        headbandTrail.setSpreadEffectDataColorLookupTable([2])
        tiles.placeOnTile(ninja, tiles.getTileLocation(14, 28))
        buildLevel8Boxes()
        spawnLevel8Enemies()
        placeCoin(10, 25, 4, 0)
        replaceTileWithCrown()
    } else if (level == 9) {
        scene.setBackgroundColor(9)
        profilelife.setMaxLife(10)
        info.setLife(10)
        profilelife.setInvisible(true)
        controller.moveSprite(ninja, 0, 0)
        cutscene = true
        sprites.destroyAllSpritesOfKind(SpriteKind.Crown)
        blackBeltTilemap = tileUtil.createSmallMap(tilemap`level60`)
        tiles.setCurrentTilemap(blackBeltTilemap)
        profilelife.setFilledLifeImage(assets.image`life9`)
        ninja.setImage(assets.image`ninja9`)
        headbandTrail.setSpreadEffectDataColorLookupTable([15])
        tiles.placeOnTile(ninja, tiles.getTileLocation(11, 0))
        buildLevel9Boxes()
        spawnLevel9Enemies()
        placeCoin(79, 4, 4, 4)
        placeCoin(142, 9, 0, 4)
        replaceTilesWithSwords()
    } else {
        creditsOnScreenTime = game.runtime()
        gameOverWin()
    }
    curRespawn = ninja.tilemapLocation()
    jumpAllEnemies()
}
function placeCoin (col: number, row: number, offsetX: number, offsetY: number) {
    newCoin = sprites.create(assets.image`coin`, SpriteKind.Food)
    newCoin.z = 200
    tiles.placeOnTile(newCoin, tiles.getTileLocation(col, row))
    newCoin.x += offsetX
    newCoin.y += offsetY
    animation.runImageAnimation(
    newCoin,
    assets.animation`coinAnim`,
    100,
    true
    )
}
function jumpFastEnemy (sprite: Sprite) {
    if (sprite.vx > 0) {
        sprites.setDataNumber(sprite, "direction", 1)
    } else {
        sprites.setDataNumber(sprite, "direction", -1)
    }
    sprite.ay = 150
    sprite.setVelocity(0, -80)
    timer.after(randint(1500, 4500), function () {
        jumpFastEnemy(sprite)
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Crown, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(crown_of_power, "moving"))) {
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
        sprites.setDataBoolean(crown_of_power, "moving", true)
        if (sprites.readDataString(crown_of_power, "state") == "idle") {
            crown_of_power.setVelocity(50, 0)
            timer.after(500, function () {
                stopMoving(crown_of_power)
                sprites.setDataString(crown_of_power, "state", "moved1")
            })
        } else if (sprites.readDataString(crown_of_power, "state") == "moved1") {
            crown_of_power.setVelocity(-30, -30)
            timer.after(500, function () {
                stopMoving(crown_of_power)
                sprites.setDataString(crown_of_power, "state", "moved2")
            })
        } else if (sprites.readDataString(crown_of_power, "state") == "moved2") {
            crown_of_power.setVelocity(20, 40)
            timer.after(500, function () {
                stopMoving(crown_of_power)
                sprites.setDataString(crown_of_power, "state", "moved3")
            })
        } else if (sprites.readDataString(crown_of_power, "state") == "moved3") {
            crown_of_power.setVelocity(40, 10)
            timer.after(500, function () {
                stopMoving(crown_of_power)
                sprites.setDataString(crown_of_power, "state", "moved4")
            })
        } else if (sprites.readDataString(crown_of_power, "state") == "moved4") {
            crown_of_power.setVelocity(-80, -20)
            timer.after(500, function () {
                stopMoving(crown_of_power)
                sprites.setDataString(crown_of_power, "state", "moved5")
            })
        } else if (sprites.readDataString(crown_of_power, "state") == "moved5") {
            profilelife.setInvisible(true)
            tiles.placeOnTile(crown_of_power, tiles.getTileLocation(9, 9))
            controller.moveSprite(ninja, 0, 0)
            cutscene = true
            MusicController.endCurrentMusic()
            sprites.destroyAllSpritesOfKind(SpriteKind.Rock)
            makeGoblinAppear()
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    touchingABox = 0
    for (let value222 of sprites.allOfKind(SpriteKind.Box)) {
        if (sprite.overlapsWith(value222)) {
            touchingABox = 1
        }
    }
    if (!(touchingABox) && !(invincible)) {
        resetPlayer(sprite)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile70`, function (sprite, location) {
    helperBird.sayText("Jump and press A to throw. Then press again to teleport!!!", 100, false)
})
function spawnLevel1Enemies () {
    spawnEnemy(7, 9, 1)
    spawnEnemy(9, 5, -1)
}
let distToNinja = 0
let newCoin: Sprite = null
let secretDungeonTilemap: tiles.TileMapData = null
let greenBeltTilemap: tiles.TileMapData = null
let blackBeltTilemap: tiles.TileMapData = null
let text3: Sprite = null
let text2: Sprite = null
let text1: Sprite = null
let playerGrabbed = false
let playerHideDemo: Sprite = null
let playerMoveDemo: Sprite = null
let rockTimerDemo: Sprite = null
let rockTeleportDemo: Sprite = null
let rockMomentumDemo: Sprite = null
let rockThrowDemo: Sprite = null
let BGoverlay: Sprite = null
let touchingABox = 0
let tmp: Sprite = null
let goblin_hand: Sprite = null
let fall = 0
let invincible = false
let shuriken3: Sprite = null
let shuriken2: Sprite = null
let shuriken1: Sprite = null
let direction = 0
let Evil_Ghost: Sprite = null
let headbandTrail: SpreadEffectData = null
let lastPressedLeft = false
let newRock: Sprite = null
let ammoReady = false
let helperBird: Sprite = null
let explosionOffset = 0
let wallsToUnlock: tiles.Location[] = []
let curLevel = 0
let cameraLock: Sprite = null
let finalBossStage = 0
let platform: Sprite = null
let crown_vertical_offset = 0
let finalboss: Sprite = null
let crown_of_power: Sprite = null
let boss_cutscene = 0
let cutscene = false
let gameStarted = false
let curRespawn: tiles.Location = null
let newBadGuy: Sprite = null
let newBox: Sprite = null
let ninja: Sprite = null
let newSwapper: Sprite = null
let swapperImages: Image[] = []
let prevImage: Image = null
let newSwapperImage: Image = null
let invis = false
let waveSpawned = false
let endingCrown: Sprite = null
let creditsActive: boolean = false
let creditsOnScreenTime: number = 0
let titleActive: boolean = true;
scene.setBackgroundImage(assets.image`titleScreen`)
MusicController.playTitle()
game.onUpdateInterval(30, function () {
    if (gameStarted) {
        extraEffects.createSpreadEffectAt(headbandTrail, ninja.x - 1, ninja.y - 3, 30, 0, 20)
    }
})
forever(function () {
    if (gameStarted && (!(cutscene) && (newRock && newRock.lifespan > 0))) {
        newRock.sayText(newRock.lifespan)
    }
})
forever(function () {
    if (scene.backgroundColor() == 12) {
        for (let value52 of tiles.getTilesByType(assets.tile`myTile23`)) {
            distToNinja = Math.sqrt((ninja.x - value52.x) ** 2 + (ninja.y - value52.y) ** 2)
            if (distToNinja <= 40) {
                tiles.setTileAt(value52, assets.tile`myTile26`)
            }
        }
        for (let value522 of tiles.getTilesByType(assets.tile`myTile26`)) {
            distToNinja = Math.sqrt((ninja.x - value522.x) ** 2 + (ninja.y - value522.y) ** 2)
            if (distToNinja <= 35) {
                tiles.setTileAt(value522, assets.tile`myTile28`)
            } else {
                tiles.setTileAt(value522, assets.tile`myTile23`)
            }
        }
        for (let value53 of tiles.getTilesByType(assets.tile`myTile28`)) {
            distToNinja = Math.sqrt((ninja.x - value53.x) ** 2 + (ninja.y - value53.y) ** 2)
            if (distToNinja <= 30) {
                tiles.setTileAt(value53, assets.tile`myTile29`)
            } else {
                tiles.setTileAt(value53, assets.tile`myTile26`)
            }
        }
        for (let value54 of tiles.getTilesByType(assets.tile`myTile29`)) {
            distToNinja = Math.sqrt((ninja.x - value54.x) ** 2 + (ninja.y - value54.y) ** 2)
            if (distToNinja <= 25) {
                tiles.setTileAt(value54, assets.tile`myTile30`)
            } else {
                tiles.setTileAt(value54, assets.tile`myTile28`)
            }
        }
        for (let value55 of tiles.getTilesByType(assets.tile`myTile30`)) {
            distToNinja = Math.sqrt((ninja.x - value55.x) ** 2 + (ninja.y - value55.y) ** 2)
            if (distToNinja >= 20) {
                tiles.setTileAt(value55, assets.tile`myTile29`)
            }
        }
    } else if (scene.backgroundColor() == 9) {
        for (let value56 of tiles.getTilesByType(assets.tile`myTile82`)) {
            distToNinja = Math.sqrt((ninja.x - value56.x) ** 2 + (ninja.y - value56.y) ** 2)
            if (distToNinja <= 40) {
                tiles.setTileAt(value56, assets.tile`myTile83`)
            }
        }
        for (let value5222 of tiles.getTilesByType(assets.tile`myTile83`)) {
            distToNinja = Math.sqrt((ninja.x - value5222.x) ** 2 + (ninja.y - value5222.y) ** 2)
            if (distToNinja <= 35) {
                tiles.setTileAt(value5222, assets.tile`myTile84`)
            } else {
                tiles.setTileAt(value5222, assets.tile`myTile82`)
            }
        }
        for (let value532 of tiles.getTilesByType(assets.tile`myTile84`)) {
            distToNinja = Math.sqrt((ninja.x - value532.x) ** 2 + (ninja.y - value532.y) ** 2)
            if (distToNinja <= 30) {
                tiles.setTileAt(value532, assets.tile`myTile85`)
            } else {
                tiles.setTileAt(value532, assets.tile`myTile83`)
            }
        }
        for (let value542 of tiles.getTilesByType(assets.tile`myTile85`)) {
            distToNinja = Math.sqrt((ninja.x - value542.x) ** 2 + (ninja.y - value542.y) ** 2)
            if (distToNinja <= 25) {
                tiles.setTileAt(value542, assets.tile`myTile86`)
            } else {
                tiles.setTileAt(value542, assets.tile`myTile84`)
            }
        }
        for (let value552 of tiles.getTilesByType(assets.tile`myTile86`)) {
            distToNinja = Math.sqrt((ninja.x - value552.x) ** 2 + (ninja.y - value552.y) ** 2)
            if (distToNinja >= 20) {
                tiles.setTileAt(value552, assets.tile`myTile85`)
            }
        }
    }
})
forever(function () {
    if (gameStarted && (!(cutscene) && (ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile16`) || (ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile22`) || (ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile88`) || ninja.tileKindAt(TileDirection.Bottom, assets.tile`myTile89`)))))) {
        // place walls beneath player on ladder tiles
        tiles.setWallAt(tiles.getTileLocation(ninja.tilemapLocation().column, ninja.tilemapLocation().row + 1), true)
    } else {
        // if player is not above them then they don't act as walls
        for (let value3222 of tiles.getTilesByType(assets.tile`myTile16`)) {
            tiles.setWallAt(value3222, false)
        }
        for (let value42 of tiles.getTilesByType(assets.tile`myTile22`)) {
            tiles.setWallAt(value42, false)
        }
        for (let value422 of tiles.getTilesByType(assets.tile`myTile88`)) {
            tiles.setWallAt(value422, false)
        }
        for (let value43 of tiles.getTilesByType(assets.tile`myTile89`)) {
            tiles.setWallAt(value43, false)
        }
    }
})
forever(function () {
    for (let value62 of sprites.allOfKind(SpriteKind.Swapper)) {
        if (value62.lifespan < 400) {
            timer.throttle("action", 50, function () {
                value62.setFlag(SpriteFlag.Invisible, !(invis))
                invis = !(invis)
            })
        } else if (value62.lifespan < 1000) {
            timer.throttle("action", 150, function () {
                value62.setFlag(SpriteFlag.Invisible, !(invis))
                invis = !(invis)
            })
        }
    }
})
forever(function () {
    if (gameStarted && invincible) {
        invincible = false
    }
})
forever(function () {
    for (let value7 of sprites.allOfKind(SpriteKind.Box)) {
        if (ninja.overlapsWith(value7)) {
            value7.setImage(assets.image`boxTouch`)
        } else {
            value7.setImage(assets.image`box`)
        }
    }
})
function unstuckPlayerIfStuck() {
    if (tileUtil.currentTilemap() != blackBeltTilemap) {
        startLevel(9)
    }
}
forever(function () {
    if (crown_of_power && (sprites.readDataString(crown_of_power, "state") == "moved5" && (finalboss && finalboss.x >= crown_of_power.x))) {
        finalboss.setVelocity(0, 0)
        finalboss.ay = 100
        sprites.setDataString(crown_of_power, "state", "aboutToBeAttached")
        timer.after(500, function () {
            finalboss.setVelocity(0, -50)
            timer.after(1500, function () {
                goblin_hand = sprites.create(assets.image`goblinHand`, SpriteKind.Helper)
                goblin_hand.setPosition(finalboss.x - 18, finalboss.y - 6)
                extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(7, ExtraEffectPresetShape.Twinkle), goblin_hand.x, goblin_hand.y, 100)
                tmp = sprites.create(assets.image`tmp`, SpriteKind.Helper)
                tmp.setPosition(ninja.x + 5, ninja.y - 10)
                timer.after(500, function () {
                    goblin_hand.follow(tmp, 20)
                    timer.after(2000, function () {
                        tiles.placeOnTile(tmp, tiles.getTileLocation(20, 4))
                        goblin_hand.follow(tmp, 200)
                        playerGrabbed = true
                        ninja.ay = 0
                        timer.after(700, function () {
                            playerGrabbed = false
                            ninja.ay = 150
                            ninja.fx = 230
                            ninja.setVelocity(200, -70)
                            timer.after(4000, function() {
                                unstuckPlayerIfStuck()
                            })
                        })
                    })
                })
            })
        })
    }
})
forever(function () {
    if (crown_of_power && sprites.readDataString(crown_of_power, "state") == "attachedToGoblin") {
        if (!(crown_vertical_offset)) {
            crown_vertical_offset = 10
        }
        crown_of_power.setPosition(finalboss.x, finalboss.y - crown_vertical_offset)
    }
})
forever(function () {
    if (playerGrabbed) {
        ninja.setPosition(goblin_hand.x - 5, goblin_hand.y + 10)
    }
})
game.onUpdateInterval(2250, function () {
    for (let value8 of tiles.getTilesByType(assets.tile`checkpointInactive`)) {
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Twinkle), value8.x - 3, value8.y + 3, 30, 3)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Twinkle), value8.x, value8.y + 3, 30, 3)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Twinkle), value8.x + 3, value8.y + 3, 30, 3)
    }
    for (let value9 of tiles.getTilesByType(assets.tile`checkpointActive`)) {
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(7, ExtraEffectPresetShape.Twinkle), value9.x - 3, value9.y + 3, 30, 3)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(7, ExtraEffectPresetShape.Twinkle), value9.x, value9.y + 3, 30, 3)
        extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(7, ExtraEffectPresetShape.Twinkle), value9.x + 3, value9.y + 3, 30, 3)
    }
})
