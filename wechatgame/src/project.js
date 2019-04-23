__require = function e(t, n, a) {
    function i(r, c) {
        if (!n[r]) {
            if (!t[r]) {
                var s = r.split("/");
                if (s = s[s.length - 1], !t[s]) {
                    var l = "function" == typeof __require && __require;
                    if (!c && l) return l(s, !0);
                    if (o) return o(s, !0);
                    throw new Error("Cannot find module '" + r + "'")
                }
            }
            var u = n[r] = {exports: {}};
            t[r][0].call(u.exports, function (e) {
                return i(t[r][1][e] || e)
            }, u, u.exports, e, t, n, a)
        }
        return n[r].exports
    }

    for (var o = "function" == typeof __require && __require, r = 0; r < a.length; r++) i(a[r]);
    return i
}({
    Bomb: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "29d96F42z1IcrTiuxCfJKtn", "Bomb"), cc.Class({
            extends: cc.Component,
            properties: {ani: cc.Animation},
            init: function (e, t) {
                var n = this;
                n.type = e, t > 0 ? n.node.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(n._play, n))) : n._play()
            },
            _play: function () {
                this.ani.play("bomb")
            },
            onBombFinished: function () {
                this.node.destroy()
            }
        }), cc._RF.pop()
    }, {}],
    CurRound: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "ab821RbK19C/rmz+TKdTN0S", "CurRound");
        var a = e("Global");
        t.exports = {
            reset: function () {
                var e = this;
                e.gold = 0, e.kill = 0, e.gone = 0, e.life = 1e3 + 50 * a.skill.base, e.lifeCur = e.life, e.monsterBatch = 7, e.totalNum = 0, e.monsterNum = [];
                for (var t = 0; t < e.monsterBatch; t++) {
                    var n = e._monsterCount(t);
                    e.monsterNum.push(n), e.totalNum += n
                }
                var i = Math.ceil(e.totalNum / 7);
                e.singleNum = [];
                for (var o = 0; o < e.monsterBatch + 1; o++) {
                    var r = Math.random() * Math.min(14, i) | 1;
                    e.singleNum.push(r), e.totalNum += r
                }
                cc.log("totalNum = " + e.totalNum), a.stage % 10 == 0 && e.totalNum++
            }, _monsterCount: function (e) {
                if (e > 6) return Math.ceil((5 + a.stage) / 6) + 2;
                switch (e) {
                    case 0:
                        return (3 + a.stage) / 7 + 1 | 0;
                    case 1:
                        return (1 + a.stage) / 6 + 1 | 0;
                    case 2:
                        return (2 + a.stage) / 6 + 2 | 0;
                    case 3:
                        return (6 + a.stage) / 8 + 1 | 0;
                    case 4:
                        return (5 + a.stage) / 7 + 1 | 0;
                    case 5:
                        return (4 + a.stage) / 6 + 1 | 0;
                    case 6:
                        return (5 + a.stage) / 6 + 2 | 0
                }
                return 0
            }
        }, cc._RF.pop()
    }, {Global: "Global"}],
    EnemySprite: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "3880ceHuuZGV4XUBgoKG3wu", "EnemySprite");
        var a = e("TypeDefine"), i = e("Global"), o = e("CurRound");
        cc.Class({
            extends: cc.Component,
            properties: {barbg: cc.Node, bloodbar: cc.ProgressBar, critical: cc.Node, ani: cc.Animation},
            ctor: function () {
                this.state = "run"
            },
            init: function (e) {
                var t = this;
                switch (t.type = e, t.esi = a.enemyInfo[e], e) {
                    case"normal":
                        t.blood = 220 * (1 + i.stage / 25) * 1.15 | 0, t.hurt = 30;
                        break;
                    case"frag":
                        t.blood = 350 * (1 + i.stage / 25) * 1.15 | 0, t.hurt = 20;
                        break;
                    case"bomber":
                        t.blood = 180 * (1 + i.stage / 25) * 1.15 | 0, t.hurt = 40;
                        break;
                    case"shield":
                        t.blood = 500 * (1 + i.stage / 25) * 1.15 | 0, t.hurt = 15;
                        break;
                    case"tank":
                        t.blood = 7e3 * (1 + i.stage / 25) * 1.15 | 0, t.hurt = 60
                }
                t.curBlood = t.blood, t.barbg.active = !1, t.reset()
            },
            update: function (e) {
                if (!i.paused) {
                    var t = this;
                    if ("run" == t.state) {
                        var n = t.node.y;
                        n -= t.esi.speed * e, t.node.y = n, n <= t.esi.maxRun - 640 && (n = t.esi.maxRun - 640, t.attack())
                    }
                }
            },
            reset: function () {
                var e = this;
                e.criticalShow = !1, e.critical.active = !1, e.barbg.active = !1, e.bloodbar.progress = 1, e.curBlood = e.blood, e.state = "run"
            },
            run: function () {
                this.state = "run", this.ani.stop(), this.ani.play(this.type + "_run")
            },
            attack: function () {
                this.state = "atk", this.ani.stop(), this.ani.play(this.type + "_atk", 0)
            },
            death: function () {
                var e = this;
                e.state = "dying", e.barbg.active = !1, e.critical.active = !1, e.ani.stop(), e.node.stopAllActions(), e.ani.play(e.type + "_die")
            },
            onAtkFinished: function () {
                var e = this;
                switch (e.type) {
                    case"frag":
                        i.playEffect("e1"), onfire.fire("oncmd", {
                            cmd: "enemybullet",
                            data: {type: e.type, pos: cc.p(e.node.x + 20, e.node.y), hurt: e.hurt}
                        }), e.node.runAction(cc.sequence(cc.delayTime(e.esi.rate), cc.callFunc(e.attack, e)));
                        break;
                    case"tank":
                        i.playEffect("e4"), onfire.fire("oncmd", {
                            cmd: "enemybullet",
                            data: {type: e.type, pos: cc.p(e.node.x - 5, e.node.y - 50), hurt: e.hurt}
                        }), e.node.runAction(cc.sequence(cc.delayTime(e.esi.rate), cc.callFunc(e.attack, e)));
                        break;
                    case"shield":
                        i.playEffect("e3"), o.lifeCur > e.hurt && e.node.runAction(cc.sequence(cc.delayTime(e.esi.rate), cc.callFunc(e.attack, e))), onfire.fire("oncmd", {
                            cmd: "hurtbase",
                            data: e.hurt
                        });
                        break;
                    case"normal":
                        i.playEffect("e0"), o.lifeCur > e.hurt && e.node.runAction(cc.sequence(cc.delayTime(e.esi.rate), cc.callFunc(e.attack, e))), onfire.fire("oncmd", {
                            cmd: "hurtbase",
                            data: e.hurt
                        });
                        break;
                    case"bomber":
                        i.playEffect("e2"), e.state = "dead", e.node.parent = null, onfire.fire("oncmd", {
                            cmd: "enemygone",
                            data: e.hurt
                        })
                }
            },
            onDieFinished: function () {
                this.state = "dead", onfire.fire("oncmd", {cmd: "enemygone"}), this.node.parent = null
            },
            onCritical: function () {
                this.critical.active = !1, this.criticalShow = !1
            },
            fallBlood: function (e, t, n) {
                var a = this;
                a.node.y > 820 || (a.barbg.active = !0, a.barbg.opacity = 255, a.barbg.stopAllActions(), a.barbg.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.5))), a.node.runAction(cc.sequence(cc.tintTo(.1, 255, 0, 0), cc.tintTo(.1, 255, 255, 255))), n && !a.criticalShow && (a.criticalShow = !0, a.critical.stopAllActions(), a.critical.active = !0, a.critical.position = cc.p(15, 20), a.critical.opacity = 255, a.critical.runAction(cc.sequence(cc.moveBy(.3, cc.p(0, 10)).easing(cc.easeBounceOut()), cc.fadeOut(.5), cc.callFunc(a.onCritical, a))), t *= 1.5), a.curBlood -= t, a.curBlood <= 0 && (a.curBlood = 0, o.gold += a.esi.gold, o.kill++, a.death()), a.bloodbar.progress = a.curBlood / a.blood)
            },
            converNowRect: function () {
                var e = this, t = e.node.getBoundingBox();
                return t.x += e.esi.range.x, t.y += e.esi.range.y, t.width = e.esi.range.w, t.height = e.esi.range.h, t
            }
        }), cc._RF.pop()
    }, {CurRound: "CurRound", Global: "Global", TypeDefine: "TypeDefine"}],
    Facebook: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "e9f27+uJo9Em56WlJ11cFhz", "Facebook"), t.exports = {
            name: "", head: null, id: 0, supportedAPIs: [], init: function (e) {
                // var t = this, n = FBInstant, a = e.cb;
                // return e.flag ? n.initializeAsync().then(function () {
                //     n.startGameAsync().then(function () {
                //         t.id = n.player.getID(), t.name = n.player.getName(), t.head = n.player.getPhoto(), t.supportedAPIs = n.getSupportedAPIs(), a && a({
                //             result: 0,
                //             id: t.id,
                //             name: t.name,
                //             head: t.head
                //         })
                //     }).catch(function (e) {
                //         a && a({result: 2})
                //     })
                // }).catch(function (e) {
                //     a && a({result: 1})
                // }) : (t.id = n.player.getID(), t.name = n.player.getName(), t.head = n.player.getPhoto(), t.supportedAPIs = n.getSupportedAPIs(), a && a({
                //     result: 0,
                //     id: t.id,
                //     name: t.name,
                //     head: t.head
                // })), !0
                var a = e.cb;
                a && a({
                    result: 0,
                    id: "",
                    name: "",
                    head: "",

                });
                return true;
            }, createShortcut: function () {
                // FBInstant.createShortcutAsync()
            }, getData: function (e) {
                // try {
                //     var t = e.cb;
                //     FBInstant.player.getDataAsync(e.keys).then(function (e) {
                //         t && t({result: 0, data: e})
                //     }).catch(function (e) {
                //         t && t({result: 1})
                //     })
                //
                // } catch (e) {
                //     this.logEvent("FBSDK_try_Err", {fun: "getData", code: e.code, msg: e.message})
                // }
                var t = e.cb;
                var data = wxHelper.getLocalData(e.keys);
                t && t({result: 0, data: data})
            }, setData: function (e) {
                // try {
                //     var t = FBInstant, n = e.cb;
                //     e.flag ? t.player.setDataAsync(e.data).then(t.player.flushDataAsync).then(function () {
                //         n && n({result: 0})
                //     }).catch(function (e) {
                //         n && n({result: 1})
                //     }) : t.player.setDataAsync(e.data).then(function () {
                //         n && n({result: 0})
                //     }).catch(function (e) {
                //         n && n({result: 1})
                //     })
                // } catch (e) {
                //     this.logEvent("FBSDK_try_Err", {fun: "setData", code: e.code, msg: e.message})
                // }
                wxHelper.saveLocalData(e.data);
                var n = e.cb;
                n && n({result: 0})
            }, invite: function (e) {
                this.shareData("INVITE", e)
            }, share: function (e) {
                this.shareData("SHARE", e)
            }, shareData: function (e, t) {
                // try {
                //     var n = t.cb;
                //     FBInstant.shareAsync({intent: e, image: t.image, text: t.text, data: t.data}).then(function () {
                //         n && n({result: 0})
                //     }).catch(function (e) {
                //         n && n({result: 1})
                //     })
                // } catch (e) {
                //     this.logEvent("FBSDK_try_Err", {fun: "shareData", code: e.code, msg: e.message})
                // }
                wxHelper.shareMessage();
            }, switchGame: function (e) {
                FBInstant.switchGameAsync(e.id).catch(function (e) {
                })
            }, logEvent: function (e, t) {
                // FBInstant.logEvent(e, 1, t)
            }, setLeaderboardScore: function (e) {
                // try {
                //     var t = e.cb;
                //     e.flag && (e.name = e.name + "." + FBInstant.context.getID()), FBInstant.getLeaderboardAsync(e.name).then(function (t) {
                //         return t.setScoreAsync(e.score, e.extData)
                //     }).then(function (e) {
                //         if (t) {
                //             var n = {};
                //             null != e && (n.rank = e.getRank(), n.score = e.getScore(), n.name = e.getPlayer().getName(), n.id = e.getPlayer().getID(), n.extData = e.getExtraData()), t({
                //                 result: 0,
                //                 rank: n
                //             })
                //         }
                //     }).catch(function (e) {
                //         t && t({result: 1})
                //     })
                // } catch (e) {
                //     this.logEvent("FBSDK_try_Err", {fun: "setLeaderboardScore", code: e.code, msg: e.message})
                // }
            }, getLeaderboardData: function (e) {
                // try {
                //     var t = e.cb;
                //     e.flag && (e.name = e.name + "." + FBInstant.context.getID()), FBInstant.getLeaderboardAsync(e.name).then(function (e) {
                //         return e.getPlayerEntryAsync()
                //     }).then(function (e) {
                //         if (t) {
                //             var n = null;
                //             null != e && ((n = {}).rank = e.getRank(), n.score = e.getScore(), n.name = e.getPlayer().getName(), n.id = e.getPlayer().getID(), n.extData = e.getExtraData()), t({
                //                 result: 0,
                //                 rank: n
                //             })
                //         }
                //     }).catch(function (e) {
                //         t && t({result: 1})
                //     })
                // } catch (e) {
                //     this.logEvent("FBSDK_try_Err", {fun: "getLeaderboardData", code: e.code, msg: e.message})
                // }
            }, getLeaderboardDatas: function (e) {
                try {
                    var t = e.cb;
                    e.flag && (e.name = e.name + "." + FBInstant.context.getID()), FBInstant.getLeaderboardAsync(e.name).then(function (t) {
                        return t.getEntriesAsync(e.count, e.offset)
                    }).then(function (e) {
                        if (t) {
                            var n = [];
                            if (null != e) for (var a = 0; a < e.length; a++) {
                                var i = {};
                                i.rank = e[a].getRank(), i.score = e[a].getScore(), i.name = e[a].getPlayer().getName(), i.id = e[a].getPlayer().getID(), i.extData = e[a].getExtraData(), n.push(i)
                            }
                            t({result: 0, rankList: n})
                        }
                    }).catch(function (e) {
                        t && t({result: 1})
                    })
                } catch (e) {
                    this.logEvent("FBSDK_try_Err", {fun: "getLeaderboardDatas", code: e.code, msg: e.message})
                }
            }, showInter: function (e) {
                // try {
                //     FBAD.getInstance().showAd("inter", e)
                // } catch (t) {
                //     e && e(!1)
                // }
                e && e(!1)
            }, showVideo: function (e) {
                // try {
                //     FBAD.getInstance().showAd("video", e)
                // } catch (t) {
                //     e && e(!1)
                // }
                wxHelper.showVideoAd(function () {
                    e && e(!0)
                }, function () {
                    e && e(!1)
                });
            }
        }, cc._RF.pop()
    }, {}],
    FragBullet: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "23dc6SCEQ5DZZovMKDLCyh8", "FragBullet");
        var a = e("Global");
        cc.Class({
            extends: cc.Component, ctor: function () {
                this.willRemove = !1, this.type = "frag", this.hurt = 0
            }, onLoad: function () {
                console.log("111",this.node)
                this.ani = this.node.getComponent(cc.Animation)
            }, init: function (e, t) {
                var n = this;
                n.type = e, n.hurt = t, cc.loader.loadRes("img/com/bullet/eb_" + n.type + "1", function (e, t) {
                    n.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t)
                })
            }, fire: function () {
                var e = this, t = "frag" == e.type ? -550 : -620;
                e.node.runAction(cc.sequence(cc.moveBy(1, cc.p(0, t)), cc.callFunc(e._moveDone, e))), e.ani.play(e.type + "b_run")
            }, reset: function () {
                this.node.stopAllActions(), this.node.opacity = 255, this.willRemove = !1
            }, _moveDone: function () {
                this.ani.stop(), this.ani.play(this.type + "b_bomb"), a.playEffect("tank"), onfire.fire("oncmd", {
                    cmd: "hurtbase",
                    data: this.hurt
                })
            }, onEnemyBomb: function () {
                this.node.parent = null, this.willRemove = !0
            }
        }), cc._RF.pop()
    }, {Global: "Global"}],
    GameMain: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "280c3rsZJJKnZ9RqbALVwtK", "GameMain");
        var a = e("TypeDefine"), i = e("Global"), o = e("CurRound"), r = e("Sdk"), c = e("Img");
        cc.Class({
            extends: cc.Component,
            properties: {
                enemyLayer: cc.Node,
                gun: cc.Node,
                cityblood: cc.ProgressBar,
                citybloodValue: cc.Label,
                monsterCount: cc.Label,
                gold: cc.Label,
                stageTip: cc.Label,
                fragProgress: cc.ProgressBar,
                bombProgress: cc.ProgressBar,
                fragCount: cc.Label,
                bombCount: cc.Label,
                btnFrag: cc.Button,
                btnBomb: cc.Button,
                bombPrefab: cc.Prefab,
                resultLayer: cc.Node,
                tips: cc.Node,
                pauseLayer: cc.Node,
                maskLayer: cc.Node,
                btnShare: cc.Button,
                aTip: cc.Label
            },
            ctor: function () {
                this.finished = !1
            },
            onLoad: function () {
                uiManager.seekNodeWithName("tip", this.node).active = false;
                var MergePlace1= uiManager.seekNodeWithName("Canvas", this.node);
                MergePlace1.scaleY = 0.75;
                console.log("222",this.node)
                var e = this;
                e.node.on(cc.Node.EventType.TOUCH_START, e.onTouchStart, e), e.node.on(cc.Node.EventType.TOUCH_MOVE, e.onTouchMove, e), e.node.on(cc.Node.EventType.TOUCH_END, e.onTouchEnd, e), e.node.on(cc.Node.EventType.TOUCH_CANCEL, e.onTouchCancel, e), o.reset(), e.pauseLayer.getChildByName("skill").getComponent("SkillScene").setInGame(), e.batchNow = 0, e.singleNow = 0, e.finished = !1, i.isFire = !1, i.paused = !1, i.setGameScene(e), e.cityblood.progress = 1, e.citybloodValue.string = o.lifeCur, e.monsterCount.string = o.totalNum, e.gold.string = o.gold, e.stageTip.string = "关卡 " + i.stage, e.fragProgress.progress = 1, e.bombProgress.progress = 1, e.fragCount.string = i.frag, e.bombCount.string = i.bomb, e.btnFrag.interactable = !1, e.btnBomb.interactable = !1, e.fragTime = 0, e.bombTime = 0, e.fragCDTime = 2.5, e.bombCDTime = 10 - i.skill.bomb + .5, e.fireevent = onfire.on("oncmd", e.onCmd.bind(e)), e.schedule(e._addSingleEnemy, 3 + i.stage / 25, cc.macro.REPEAT_FOREVER, 2), e.schedule(e._releaseMonster, 4 + i.stage / 25, cc.macro.REPEAT_FOREVER, 4);
            },
            onDestroy: function () {

                onfire.un(this.fireevent)
            },
            update: function (e) {
                var t = this;
                t.gold.string = o.gold, t.finished || i.paused || (i.updateBullet(), i.updateEnemy(), t.btnFrag.interactable || (t.fragTime += e, t.fragTime >= t.fragCDTime && (t.fragTime = t.fragCDTime, t.btnFrag.interactable = !0), t.fragProgress.progress = 1 - t.fragTime / t.fragCDTime), t.btnBomb.interactable || (t.bombTime += e, t.bombTime >= t.bombCDTime && (t.bombTime = t.bombCDTime, t.btnBomb.interactable = !0, t.bombCDTime = 10 - i.skill.bomb + .5), t.bombProgress.progress = 1 - t.bombTime / t.bombCDTime))
            },
            onCmd: function (e) {
                var t = this;
                switch (e.cmd) {
                    case"hurtbase":
                        o.lifeCur = Math.max(0, o.lifeCur - e.data), t.cityblood.progress = o.lifeCur / o.life, t.citybloodValue.string = o.lifeCur + "", o.lifeCur <= 0 && t._gameOver();
                        break;
                    case"fire":
                        i.fireRoleBullet(t.enemyLayer, e.data);
                        break;
                    case"enemybullet":
                        i.fireEnemyBullet(t.enemyLayer, e.data.type, e.data.pos, e.data.hurt);
                        break;
                    case"enemygone":
                        if (o.gone++, i.score++, t.monsterCount.string = o.totalNum - o.gone, e.data && (o.lifeCur = Math.max(0, o.lifeCur - e.data), t.cityblood.progress = o.lifeCur / o.life, t.citybloodValue.string = o.lifeCur + "", o.lifeCur <= 0)) {
                            t._gameOver();
                            break
                        }
                        o.totalNum <= o.gone && t._success();
                        break;
                    case"closeSkill":
                        t.onStart()
                }
            },
            setGunPos: function (e) {
                var t = e.getTouches()[0].getLocation(), n = this.node.convertToNodeSpaceAR(t);
                this.gun.x = n.x
            },
            onTouchStart: function (e) {
                i.isFire = !0, this.aTip.node.opacity > 10 && this.aTip.node.runAction(cc.fadeOut(2)), this.setGunPos(e)
            },
            onTouchMove: function (e) {
                this.finished || this.setGunPos(e)
            },
            onTouchCancel: function (e) {
                i.isFire = !1
            },
            onTouchEnd: function (e) {
                i.isFire = !1
            },
            _getRandomType: function () {
                var e = "normal", t = Math.random();
                if (i.stage < 10) 0 == (2 * t | 0) && (e = "bomber"); else if (i.stage < 15) 0 == (2 * t | 0) && (e = Math.random() >= .5 ? "bomber" : "shield"); else if (i.stage < 20) {
                    if (0 == (2 * Math.random() | 0)) {
                        var n = Math.random();
                        e = n < .33 ? "frag" : n < .67 ? "bomber" : "shield"
                    }
                } else {
                    var a = Math.random();
                    e = a < .25 ? "frag" : a < .5 ? "bomber" : a < .75 ? "shield" : "normal"
                }
                return e
            },
            _releaseMonster: function () {
                var e = this;
                e.batchNow < o.monsterBatch ? (2 == e.batchNow && i.stage % 10 == 0 && i.addMonster(e.enemyLayer, 0, "tank", 1), i.addMonster(e.enemyLayer, 0, e._getRandomType(), o.monsterNum[e.batchNow]), e.batchNow++) : e.unschedule(e._releaseMonster)
            },
            _addSingleEnemy: function () {
                var e = this, t = o.singleNum[e.singleNow];
                e.singleNow++, e.singleNow >= o.singleNum.length && e.unschedule(e._addSingleEnemy), i.addMonster(e.enemyLayer, 1, e._getRandomType(), t)
            },
            onFrag: function () {
                var e = this;
                e.btnFrag.interactable = !1, e.fragTime = 0, e.fragProgress.progress = 1, i.frag--, e.fragCount.string = i.frag, i.playEffect("tank");
                for (var t = 0; t < 3; t++) {
                    var n = cc.instantiate(e.bombPrefab);
                    n.position = a.bombPosition[t], n.getComponent("Bomb").init(0, 0), e.enemyLayer.addChild(n)
                }
                e.node.runAction(cc.sequence(cc.delayTime(.8), cc.callFunc(e._onFragFinished, e)))
            },
            onBomb: function () {
                var e = this;
                e.btnBomb.interactable = !1, e.bombTime = 0, e.bombProgress.progress = 1, i.bomb--, e.bombCount.string = i.bomb, i.playEffect("bomb");
                for (var t = 0; t < 15; t++) {
                    var n = cc.instantiate(e.bombPrefab);
                    n.position = a.bombPosition[t], n.getComponent("Bomb").init(1, .1 * (t / 3 | 0)), e.enemyLayer.addChild(n)
                }
                e.node.runAction(cc.sequence(cc.delayTime(.8), cc.callFunc(e._onBombFinished, e)))
            },
            _onFragFinished: function () {
                for (var e = 0; e < i.runMonsters.length; e++) {
                    var t = i.runMonsters[e];
                    "dying" != t.state && "dead" != t.state && t.node.y <= -200 && t.fallBlood(t, 50 * i.skill.frag + 500, !1)
                }
            },
            _onBombFinished: function () {
                for (var e = 0; e < i.runMonsters.length; e++) {
                    var t = i.runMonsters[e];
                    "dying" != t.state && "dead" != t.state && t.node.y <= 400 && t.fallBlood(t, 8e3, !1)
                }
            },
            _success: function () {
                var e = this;
                1 == i.curTimes && r.getInstance().createShortcut(), i.curTimes++, i.score > i.best && i.id && i.name && r.getInstance().setLeaderboardScore({
                    name: "world",
                    flag: !1,
                    score: i.score,
                    extData: ""
                }), e.unscheduleAllCallbacks(), e.finished = !0, i.isFire = !1, i.stage++;
                var t = o.kill + 50 + 9 * i.stage;
                i.gold += t;
                var n = i.stage % 4 == 0 ? 1 : 0;
                i.frag += n;
                var a = i.stage % 10 == 0 ? 1 : 0;
                i.bomb += a, e._updateStage(), e.tips.runAction(cc.sequence(cc.fadeOut(.5), cc.fadeIn(.5)).repeatForever()), e.btnShare.node.active = i.id, e.resultLayer.active = !0, e.resultLayer.getChildByName("failedbg").active = !1, e.resultLayer.getChildByName("failed").active = !1, e.resultLayer.getChildByName("victorybg").active = !0, e.resultLayer.getChildByName("victory").active = !0, e.resultLayer.getChildByName("victory").runAction(cc.moveTo(1, cc.p(0, 360)).easing(cc.easeIn(20)));
                var c = e.resultLayer.getChildByName("bg");
                c.getChildByName("kill").getComponent(cc.Label).string = o.kill + "", c.getChildByName("life").getComponent(cc.Label).string = (100 * o.lifeCur / o.life | 0) + "%", c.getChildByName("frag").getComponent(cc.Label).string = "+" + n, c.getChildByName("bomb").getComponent(cc.Label).string = "+" + a, c.getChildByName("reward").getComponent(cc.Label).string = "+" + t
            },
            _gameOver: function () {
                var e = this;
                i.id && i.name && i.score > i.best && r.getInstance().setLeaderboardScore({
                    name: "world",
                    flag: !1,
                    score: i.score,
                    extData: ""
                });
                for (var t = 0; t < i.runMonsters.length; t++) {
                    var n = i.runMonsters[t];
                    n.node.active = !1, n.ani.stop(), n.node.stopAllActions()
                }
                e.unscheduleAllCallbacks(), e.finished = !0, i.isFire = !1;
                var a = 2 * o.kill;
                i.gold += a;
                var c = 0 == (3 * Math.random() | 0) ? 1 : 0;
                e._updateStage(), e.tips.runAction(cc.sequence(cc.fadeOut(.5), cc.fadeIn(.5)).repeatForever()), e.resultLayer.active = !0, e.btnShare.node.active = i.id, e.resultLayer.getChildByName("failedbg").active = !0, e.resultLayer.getChildByName("failed").active = !0, e.resultLayer.getChildByName("victorybg").active = !1, e.resultLayer.getChildByName("victory").active = !1, e.resultLayer.getChildByName("failed").opacity = 0, e.resultLayer.getChildByName("failed").runAction(cc.fadeIn(1));
                var s = e.resultLayer.getChildByName("bg");
                s.getChildByName("kill").getComponent(cc.Label).string = o.kill + "", s.getChildByName("life").getComponent(cc.Label).string = "0", s.getChildByName("frag").getComponent(cc.Label).string = "+" + c, s.getChildByName("bomb").getComponent(cc.Label).string = "+0", s.getChildByName("reward").getComponent(cc.Label).string = "+" + a
            },
            onPause: function () {
                i.playEffect("click"), i.paused = !0, cc.director.getScheduler().pauseTarget(this), this.pauseLayer.active = !0
            },
            onSound: function () {
                i.sound = !i.sound;
                var e = "btn_sound_" + (i.sound ? "on" : "off");
                this.btnSound.getComponent(cc.Sprite).spriteFrame = i.uiAtlas.getSpriteFrame(e)
            },
            onBack: function () {
                i.playEffect("click");
                r.getInstance().showInter(function () {
                    cc.director.resume(), i.clearBulletAndEnemy(), cc.director.loadScene("skill")
                })
            },
            onStart: function () {
                var e = this;
                i.playEffect("click"), e.pauseLayer.active = !1;
                var t = 1e3 + 50 * i.skill.base;
                t > o.life && (o.lifeCur += t - o.life, o.life = t, e.cityblood.progress = o.lifeCur / o.life, e.citybloodValue.string = o.lifeCur);
                var n = i.skill.burst > 0 ? 3 : i.skill.dual > 0 ? 2 : 1, a = e.gun.getComponent("gun");
                n != a.gun && a.reset(), i.paused = !1, cc.director.getScheduler().resumeTarget(e)
            },
            onShare: function () {
                i.playEffect("click"), r.getInstance().share({
                    image: c.share,
                    imageUrl: c.shareUrl,
                    text: "Hey I'm stuck on this The Beach Hero! Can you help me?",
                    data: {},
                    callback: function (e) {
                    }
                })
            },
            _updateStage: function () {
                var e = {
                    gold: i.gold,
                    bomb: i.bomb,
                    frag: i.frag,
                    stage: i.stage,
                    best: i.best,
                    score: i.score,
                    skillPower: i.skill.power,
                    skillSpeed: i.skill.speed,
                    skillBase: i.skill.base,
                    skillDual: i.skill.dual,
                    skillPierce: i.skill.pierce,
                    skillCritical: i.skill.critical,
                    skillFrag: i.skill.frag,
                    skillBurst: i.skill.burst,
                    skillBomb: i.skill.bomb,
                    skillFinal: i.skill.final
                };
                r.getInstance().setData({data: e, flag: !1})
            }
        }), cc._RF.pop()
    }, {CurRound: "CurRound", Global: "Global", Img: "Img", Sdk: "Sdk", TypeDefine: "TypeDefine"}],
    Global: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "6bd25xBwq5FLKKOPUTP7BIl", "Global"), window.onfire = e("onfire"), Array.prototype.contains = function (e) {
            for (var t = this.length; t--;) if (this[t] === e) return !0;
            return !1
        }, t.exports = {
            curTimes: 0,
            uiAtlas: null,
            snd: {},
            id: null,
            name: null,
            pic: null,
            sound: !0,
            stage: 1,
            gold: 0,
            skill: {power: 1, speed: 0, base: 0, dual: 0, pierce: 0, critical: 0, frag: 0, burst: 0, bomb: 0, final: 0},
            bomb: 1,
            frag: 3,
            score: 0,
            best: 0,
            getCoinsTime: 0,
            paused: !1,
            isFire: !1,
            inited: !1,
            prefab: {},
            runRoleBullets: [],
            idleRoleBullets: [],
            runEnemyBullets: [],
            idleEnemyBullets: [],
            idleMonsters: [],
            runMonsters: [],
            init: function () {
                if (!this.inited) {
                    var e = this;
                    e.inited = !0;
                    cc.loader.loadResArray(["prefab/bullet", "prefab/fragb", "prefab/enemy"], cc.Prefab, function (t, n) {
                        var a = 0;
                        e.prefab.bullet = n[a++], e.prefab.frag = n[a++], e.prefab.enemy = n[a++], e.resLoaded++
                    })
                }
            },
            setGameScene: function (e) {
                this.gameScene = e
            },
            clearBulletAndEnemy: function () {
                var e = this;
                e.runRoleBullets = [], e.idleRoleBullets = [], e.idleEnemyBullets = [], e.runEnemyBullets = [], e.runMonsters = [], e.idleMonsters = []
            },
            updateBullet: function () {
                for (var e = this, t = 0; t < e.runRoleBullets.length;) {
                    var n = e.runRoleBullets[t];
                    n.willRemove ? (n.node.parent = null, e.runRoleBullets.splice(t, 1), e.idleRoleBullets.push(n)) : (n.targets.length < n.hitMax && e.collisionDetect(n), t++)
                }
                for (var a = 0; a < e.runEnemyBullets.length;) {
                    var i = e.runEnemyBullets[a];
                    i.willRemove ? (i.reset(), e.runEnemyBullets.splice(a, 1), e.idleEnemyBullets.push(i)) : a++
                }
            },
            fireRoleBullet: function (e, t) {
                var n = null;
                this.idleRoleBullets.length > 0 && (n = this.idleRoleBullets.pop()), null === n && (n = cc.instantiate(this.prefab.bullet).getComponent("RoleBullet")), n.reset(), n.node.position = t, e.addChild(n.node), this.runRoleBullets.push(n)
            },
            fireEnemyBullet: function (e, t, n, a) {
                for (var i = this, o = null, r = 0; r < i.idleEnemyBullets.length; r++) if (i.idleEnemyBullets[r].enemyType == t) {
                    o = i.idleEnemyBullets[r], i.idleEnemyBullets.splice(r, 1);
                    break
                }
                null === o && (o = cc.instantiate(i.prefab.frag).getComponent("FragBullet")).init(t, a), o.node.position = n, e.addChild(o.node), i.runEnemyBullets.push(o), o.fire()
            },
            updateEnemy: function () {
                for (var e = 0; e < this.runMonsters.length;) {
                    var t = this.runMonsters[e];
                    "dead" == t.state ? (this.runMonsters.splice(e, 1), this.idleMonsters.push(t)) : e++
                }
            },
            collisionDetect: function (e) {
                for (var t = 0; t < this.runMonsters.length; t++) {
                    var n = this.runMonsters[t];
                    if ("dying" != n.state && "dead" != n.state && e.hitEnemy(n)) break
                }
            },
            addMonster: function (e, t, n, a) {
                var i = this, o = [];
                "tank" == n && (a = 1);
                for (var r = 0, c = 0; c < i.idleMonsters.length;) {
                    var s = i.idleMonsters[c];
                    if (s.type == n) {
                        if (i.idleMonsters.splice(c, 1), s.reset(), o.push(s), ++r == a) break
                    } else c++
                }
                for (var l = r; l < a; l++) {
                    var u = cc.instantiate(i.prefab.enemy).getComponent("EnemySprite");
                    u.init(n), o.push(u)
                }
                if ("tank" == n) {
                    var d = 3 * Math.random() | 1;
                    switch (d) {
                        case 1:
                            i._addBossLeft(o, 120);
                            break;
                        case 2:
                            i._addBossMid(o, 120);
                            break;
                        case 3:
                            i._addBossRight(o, 120)
                    }
                } else if (1 == t) i._addEnemyRandom(o); else {
                    switch (3 * Math.random() | 1) {
                        case 1:
                            i._addEnemyHori(o, 50);
                            break;
                        case 2:
                            i._addEnemyArrow(o, 50);
                            break;
                        case 3:
                            i._addEnemyCross(o, 50);
                            break;
                        case 4:
                            i._addEnemyVert(o, 50)
                    }
                }
                for (var g = 0; g < o.length; g++) {
                    var f = o[g];
                    f.node.x -= 350, f.node.y -= 640, e.addChild(f.node), f.run(), i.runMonsters.push(f)
                }
            },
            _addEnemyRandom: function (e) {
                for (var t = this.gRandomPos(13), n = 0; n < e.length; n++) {
                    var a = e[n];
                    t[n] > 5 ? a.node.position = cc.p(50 + 100 * (t[n] - 6), 1395) : a.node.position = cc.p(100 + 100 * t[n], 1330)
                }
            },
            _addEnemyVert: function (e, t) {
                for (var n = 100 * Math.random() + 30, a = parseInt(e.length / 5), i = 0; i < e.length; i++) e[i].node.position = cc.p(n, 13300 + 60 * (0 == a ? i : i % a)), 0 != a && i % a == 0 && 0 != i && (n += 60)
            },
            _addEnemyHori: function (e, t) {
                for (var n = 60, a = 350, i = 0, o = 0; o < e.length; o++) o % 7 == 0 && 0 != o && (a = 350, n = 60, i++), e[o].node.setPosition(a += (n *= -1) * (o % 7), 1330 + 50 * i)
            },
            _addEnemyArrow: function (e, t) {
                for (var n = 60, a = 350, i = 0; i < e.length; i++) i % 7 == 0 && 0 != i && (n = 60, a = 350, 0), e[i].node.setPosition(a += (n *= -1) * (i % 7), 1330 + 11 * i)
            },
            _addEnemyCross: function (e, t) {
                for (var n = 60, a = 350, i = 0, o = 13, r = 0; r < e.length; r++) r % 13 == 7 ? (n = 60, a = 320, i++, o = r) : r % 13 == 0 && 0 != r && (n = 60, a = 350, i++, o = r), e[r].node.setPosition(a += (n *= -1) * (r % o), 1330 + 60 * i)
            },
            _addBossMid: function (e, t) {
                for (var n = 350, a = 0; a < e.length; a++) e[a].node.setPosition(n += (t *= -1) * a, 1360)
            },
            _addBossLeft: function (e, t) {
                for (var n = 0; n < e.length; n++) e[n].node.setPosition(175 + t * n, 1360)
            },
            _addBossRight: function (e, t) {
                for (var n = 0; n < e.length; n++) e[n].node.setPosition(525 - t * n, 1360)
            },
            gRandomPos: function (e) {
                for (var t = [], n = 0; n < e; n++) t.push(n);
                return t.sort(function () {
                    return .5 - Math.random()
                }), t
            },
            loadGlobalPrefab: function (e, t) {
                var n = this;
                n.prefab[e] ? t && t(n.prefab[e]) : cc.loader.loadRes("prefab/" + e, function (a, i) {
                    a || (n.prefab[e] = i, t && t(n.prefab[e]))
                })
            },
            playEffect: function (e) {
                var t = this;
                t.sound && (t.snd[e] ? cc.audioEngine.play(t.snd[e], !1, 1) : cc.loader.loadRes("sound/" + e, function (n, a) {
                    n || (t.snd[e] = a, cc.audioEngine.play(a, !1, 1))
                }))
            }
        }, cc._RF.pop()
    }, {onfire: "onfire"}],
    Img: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "22a93g+HGlLUpWPHb+fmxxC", "Img"), t.exports = {
            shareUrl: "",
            share: "data:image/jpeg;base64,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"
        }, cc._RF.pop()
    }, {}],
    Item: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "144c4lG5RNIXJVxrERChH8g", "Item"), cc.Class({
            extends: cc.Component,
            properties: {labelRank: cc.Label, labelName: cc.Label, labelScore: cc.Label, spriteBg: cc.Sprite},
            start: function () {
                var e = this;
                e.labelRank.string = e.rank.rank, e.labelScore.string = e.rank.score, e.labelName.string = e.rank.name
            },
            init: function (e, t) {
                this.rank = e, this.isSelf = t
            }
        }), cc._RF.pop()
    }, {}],
    Leadboard: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "93127Rn5S9ONYpkPHvubywo", "Leadboard");
        var a = e("Global"), i = e("Sdk");
        cc.Class({
            extends: cc.Component,
            properties: {labelRank: cc.Label, labelName: cc.Label, labelScore: cc.Label, scrollview: cc.ScrollView},
            start: function () {
                null != a.playerName && (this.labelName.string = a.playerName), this._onUpdatebLeadboard()
            },
            onBtnClose: function () {
                this.node.destroy()
            },
            _onUpdatebLeadboard: function () {
                var e = this;
                e.scrollview.content.removeAllChildren(), i.getInstance().getLeaderboardDatas({
                    name: "world",
                    flag: !1,
                    count: 50,
                    offset: 0,
                    cb: function (t) {
                        0 == t.result && null != t.rankList && e._updateRankList(t.rankList)
                    }
                }), i.getInstance().getLeaderboardData({
                    name: "world", flag: !1, cb: function (t) {
                        0 == t.result && null != t.rank && e._updateUser(t.rank)
                    }
                })
            },
            _updateRankList: function (e) {
                if (null != e) {
                    var t = this;
                    a.loadGlobalPrefab("item", function (n) {
                        for (var i = 0; i < e.length; i++) {
                            var o = e[i], r = cc.instantiate(n), c = !1;
                            o.id == a.id && (c = !0, o.rank <= 500 ? t.labelRank.string = o.rank : t.labelRank.string = "500+"), r.getComponent("Item").init(o, c), t.scrollview.content.addChild(r)
                        }
                    })
                }
            },
            _updateUser: function (e) {
                e.rank && (this.labelRank.string = e.rank), e.score && (this.labelScore.string = e.score)
            }
        }), cc._RF.pop()
    }, {Global: "Global", Sdk: "Sdk"}],
    Logo: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "56d58qMhE5Ev6ypSF/9v4N/", "Logo");
        var a = e("Global"), i = e("Sdk"), o = e("Img");
        cc.Class({
            extends: cc.Component,
            properties: {
                btnStart: cc.Button,
                btnRank: cc.Button,
                mask: cc.Node,
                acClick: {type: cc.AudioClip, default: null},
                atlas: cc.SpriteAtlas
            },
            onLoad: function () {
                console.log("333",this.node)
                sceneManager.addMoreBtn();
                // sceneManager.showDirect()
                // sceneManager.showMoreGameList(this.node);
                wxHelper.showBannerAd();
                console.log("===========",this.node);
                uiManager.seekNodeWithName("rank", this.node).active = false;
                uiManager.seekNodeWithName("logo", this.node).active = false;
                var more1 = uiManager.seekNodeWithName("more", this.node);
                var widget = more1.addComponent(cc.Widget);
                widget.target = cc.find("Canvas");
                widget.isAlignTop = true;
                widget.top =920;
                widget.isAlignBottomn=false;
                widget.isAlignLeft = true;
                widget.left=110;
                widget.isAlignRight=false;
                widget.updateAlignment();
                var share1 = uiManager.seekNodeWithName("share", this.node);
                var widget2 = share1.addComponent(cc.Widget);
                widget2.target = cc.find("Canvas");
                widget2.isAlignTop = true;
                widget2.top =920;
                widget2.isAlignBottomn=false;
                widget2.isAlignRight = true;
                widget2.right=110;
                widget2.isAlignLeft=false;
                widget2.updateAlignment();
                var start1 = uiManager.seekNodeWithName("start", this.node);
                var widget1 = start1.addComponent(cc.Widget);
                widget1.target = cc.find("Canvas");
                widget1.isAlignTop = true;
                widget1.top =700;
                widget1.isAlignBottomn=false;
                widget1.isAlignLeft = true;
                widget1.left=200;
                widget1.isAlignRight=false;
                widget1.updateAlignment();

                var e = this;
                a.uiAtlas = e.atlas, a.init(), i.getInstance().init({
                    flag: !1, cb: function (t) {
                        if (0 == t.result) {
                            a.id = t.id, a.name = t.name, a.pic = t.head, i.getInstance().getLeaderboardData({
                                name: "world",
                                flag: !1,
                                cb: function (t) {
                                    a.best = t.rank ? t.rank.score : 0, e.btnRank.interactable = !0
                                }
                            }), e.btnStart.interactable = !0;
                            i.getInstance().getData({
                                keys: ["gold", "stage", "bomb", "frag", "best", "score", "skillPower", "skillSpeed", "skillBase", "skillDual", "skillPierce", "skillCritical", "skillFrag", "skillBurst", "skillBomb", "skillFinal"],
                                cb: function (e) {
                                    if (0 == e.result) {
                                        var t = e.data;
                                        t.gold && (a.gold = t.gold), t.stage && (a.stage = t.stage), t.bomb && (a.bomb = t.bomb), t.frag && (a.frag = t.frag), t.best && (a.best = t.best), t.score && (a.score = t.score), t.skillPower && (a.skill.power = t.skillPower), t.skillSpeed && (a.skill.speed = t.skillSpeed), t.skillBase && (a.skill.base = t.skillBase), t.skillDual && (a.skill.dual = t.skillDual), t.skillPierce && (a.skill.pierce = t.skillPierce), t.skillCritical && (a.skill.critical = t.skillCritical), t.skillFrag && (a.skill.frag = t.skillFrag), t.skillBurst && (a.skill.burst = t.skillBurst), t.skillBomb && (a.skill.bomb = t.skillBomb), t.skillFinal && (a.skill.final = t.skillFinal)
                                    }
                                }
                            })
                        }
                    }
                }), cc.director.preloadScene("game"), cc.director.preloadScene("skill")
            },
            onDestroy : function(){
                wxHelper.hideBannerAd();
            },
            onBtnSound: function () {
                a.sound = !a.sound, a.playEffect("click");
                var e = "btn_sound_" + (a.sound ? "on" : "off");
                this.node.getChildByName("sound").getComponent(cc.Sprite).spriteFrame = a.uiAtlas.getSpriteFrame(e)
            },
            onBtnStart: function () {
                a.playEffect("click"), cc.director.loadScene(a.stage > 1 ? "skill" : "game")
            },
            onBtnRank: function () {
                a.playEffect("click");
                var e = this;
                a.id && a.name && a.loadGlobalPrefab("leadboard", function (t) {
                    var n = cc.instantiate(t);
                    e.node.addChild(n)
                })
            },
            onBtnMore: function () {
                a.playEffect("click"), i.getInstance().showInter()
            },
            onBtnShare: function () {
                a.playEffect("click"), i.getInstance().share({
                    image: o.share,
                    imageUrl: o.shareUrl,
                    text: "Hey! Can you pass level 20 in this game?",
                    data: {}
                })
            }
        }), cc._RF.pop()
    }, {Global: "Global", Img: "Img", Sdk: "Sdk"}],
    Log: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "a28b16l/JdIgqRHXq47f5Rz", "Log"), t.exports = {
            error: function (e, t) {
                this._log("[ERROR] " + e + ": " + t)
            }, warning: function (e, t) {
                this._log("[WARNING] " + e + ": " + t)
            }, debug: function (e, t) {
            }, info: function (e, t) {
                this._log("[INFO] " + e + ": " + t)
            }, _log: function (e) {
                console.log(e)
            }
        }, cc._RF.pop()
    }, {}],
    RoleBullet: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "27dbcWrTdpONbWfs+uf0pxJ", "RoleBullet");
        var a = e("Global");
        cc.Class({
            extends: cc.Component, ctor: function () {
                this.hurt = 0, this.targets = [], this.hitMax = 0, this.willRemove = !1
            }, update: function (e) {
                a.paused || (this.node.y += 1e3 * e, this.node.y >= 1380 && (this.willRemove = !0))
            }, reset: function () {
                var e = this;
                e.hitMax = 1, (100 * Math.random() | 0) < 5 * a.skill.pierce && (e.hitMax = 2), e.willRemove = !1, e.targets = [], e.hurt = 100 + 10 * a.skill.power, a.skill.burst > 0 ? e.hurt = .5 * e.hurt : a.skill.dual > 0 && (e.hurt = .6 * e.hurt)
            }, hitEnemy: function (e) {
                var t = this;
                if (t.targets.contains(e)) return !1;
                if (t.node.getBoundingBox().intersects(e.converNowRect())) {
                    "shield" == e.type && a.playEffect("shield"), t.targets.push(e);
                    var n = (100 * Math.random() | 0) < 5 * a.skill.critical;
                    return e.fallBlood(e, t.hurt, n), t.targets.length >= t.hitMax && (t.willRemove = !0), !0
                }
                return !1
            }
        }), cc._RF.pop()
    }, {Global: "Global"}],
    Sdk: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "132a3immUtCzL/XQTMXjIF4", "Sdk"), t.exports = {
            getInstance: function () {
                return e("Facebook")
            }
        }, cc._RF.pop()
    }, {Facebook: "Facebook"}],
    SkillScene: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "abec5vVXOBAwKinFYrQ+q/V", "SkillScene");
        var a = e("TypeDefine"), i = e("Global"), o = e("Sdk");
        cc.Class({
            extends: cc.Component,
            properties: {
                selectRect: cc.Node,
                explain: cc.Label,
                curLevel: cc.Label,
                nextLevel: cc.Label,
                needMoney: cc.Label,
                upgrade: cc.Button,
                upgradeString: cc.Label,
                fragCount: cc.Label,
                fragPrice: cc.Label,
                bombCount: cc.Label,
                bombPrice: cc.Label,
                btnSound: cc.Node,
                maskLayer: cc.Node,
                shopTitle: cc.Label,
                timeLast: cc.Label,
                btnGetCoin: cc.Button,
                mask: cc.Node
            },
            ctor: function () {
                this.isInGame = !1
            },
            setInGame: function () {
                var e = this;
                e.isInGame = !0, e.btnStart && cc.loader.loadRes("img/en/btn_continue", function (t, n) {
                    e.btnStart.spriteFrame = new cc.SpriteFrame(n)
                })
            },
            onLoad: function () {
                console.log("444",this.node)
                var e = this;
                e.shopLayer = e.node.getChildByName("shop");
                var t = e.node.getChildByName("totalscore").getComponent(cc.Label),
                    n = i.score < 1e4 ? i.score : i.score < 1e6 ? (i.score / 1e3).toFixed(1) + "k" : (i.score / 1e6).toFixed(1) + "m";
                t.string = "分数: " + n, e.node.getChildByName("stage").getComponent(cc.Label).string = "阶段: " + i.stage;
                var o = e.node.getChildByName("totalcoin");
                e.coinLabel = o.getChildByName("label").getComponent(cc.Label), e.coinLabel.string = i.gold;
                var r = e.node.getChildByName("skills");
                e.skillBtn = {};
                for (var c in a.skill) e.skillBtn[c] = r.getChildByName(c);
                e.addCoinP = 2e3 + Math.min(2e4, 500 * i.stage), e.bombP = 500 + 1e3 * i.stage, e.fragP = 200 + 200 * i.stage, e.fragCount.string = i.frag + "", e.fragPrice.string = e.fragP, e.bombCount.string = i.bomb + "", e.bombPrice.string = e.bombP, e.changeStage = 0;
                var s = "btn_sound_" + (i.sound ? "on" : "off");
                e.btnSound.getComponent(cc.Sprite).spriteFrame = i.uiAtlas.getSpriteFrame(s), e.btnStart = e.node.getChildByName("btnStart").getComponent(cc.Sprite), e.isInGame && cc.loader.loadRes("img/en/btn_continue", function (t, n) {
                    e.btnStart.spriteFrame = new cc.SpriteFrame(n)
                }), e._updateItem(), e._selectItem("power")
            },
            onStart: function () {
                i.playEffect("click"), this.changeStage = 1, this.isInGame ? onfire.fire("oncmd", {cmd: "closeSkill"}) : (this.mask.active = !0, cc.director.loadScene("game"))
            },
            onBtnSound: function () {
                i.sound = !i.sound, i.playEffect("click");
                var e = "btn_sound_" + (i.sound ? "on" : "off");
                this.btnSound.getComponent(cc.Sprite).spriteFrame = i.uiAtlas.getSpriteFrame(e)
            },
            onBtnAddCoin: function () {
                var e = this;
                o.getInstance().showVideo(function (t) {
                    if (t) {
                        var n = e.addCoinP;
                        e._giveReward(n)
                    } /*else o.getInstance().showInter(function (t) {
                        if (t) {
                            var n = e.addCoinP;
                            e._giveReward(n)
                        } else e._showToast("No ads now.")
                    })*/
                })
            },
            _giveReward: function (e) {
                i.gold += e, i.getCoinsTime = (new Date).getTime(), this.coinLabel.string = i.gold, this.shopLayer.active = !1, this._updateGlodDatas(), this._showToast("得到 " + e + " 金币.")
            },
            _showToast: function (e) {
                var t = this;
                i.loadGlobalPrefab("toast", function (n) {
                    var a = cc.instantiate(n);
                    a.getComponent("Toast").init({hint: e}), t.node.addChild(a)
                })
            },
            _rand: function (e, t) {
                if (e > t) {
                    var n = t;
                    t = e, e = n
                }
                return parseInt(Math.round(Math.random() * (t - 1) + e))
            },
            onBtnSkill: function (e) {
                i.playEffect("click"), this._selectItem(e.target.name)
            },
            onShop: function () {
                i.playEffect("click"), this.shopTitle.string = "+ " + this.addCoinP + " Coins", this.shopLayer.active = !0
            },
            update: function () {
                var e = this;
                if (e.shopLayer.active) {
                    var t = (new Date).getTime();
                    if (t - i.getCoinsTime > 3e4) e.timeLast.string = "", e.btnGetCoin.interactable = !0; else {
                        var n = parseInt((3e4 - (t - i.getCoinsTime)) / 1e3);
                        e.timeLast.string = "00:" + (n > 9 ? n : "0" + n), e.btnGetCoin.interactable = !1
                    }
                }
            },
            onUpgrade: function () {
                var e = this, t = a.skill[e.curSkill], n = i.skill[e.curSkill];
                i.gold >= t.price[n] ? n < t.max && (i.playEffect("buy"), i.gold -= t.price[n], i.skill[e.curSkill]++, "final" == e.curSkill && (i.skill.dual = 5, i.skill.burst = 1, i.skill.base = Math.max(40, i.skill.base), i.skill.power = Math.max(40, i.skill.power), i.skill.speed = Math.max(20, i.skill.speed), i.skill.pierce = Math.max(15, i.skill.pierce), i.skill.critical = Math.max(15, i.skill.critical), i.skill.frag = Math.max(20, i.skill.frag), i.skill.bomb = Math.max(5, i.skill.bomb)), e._updateSkillDatas()) : (i.playEffect("nomoney"), e.shopTitle.string = "+ " + this.addCoinP + " 金币", e.shopLayer.active = !0), e.coinLabel.string = i.gold, e._updateItem(), e._selectItem(e.curSkill)
            },
            _checkCanOpen: function (e) {
                switch (e) {
                    case"dual":
                        return i.skill.power >= 10;
                    case"speed":
                        return i.skill.power >= 5;
                    case"frag":
                        return i.skill.power >= 10 && i.skill.base >= 5;
                    case"critical":
                        return i.skill.dual >= 5;
                    case"bomb":
                        return i.skill.frag >= 5;
                    case"pierce":
                        return i.skill.speed >= 10;
                    case"burst":
                        return i.skill.pierce >= 10 && i.skill.critical >= 10;
                    default:
                        return !0
                }
            },
            onAddBomb: function () {
                var e = this;
                i.gold >= e.bombP ? (i.playEffect("buy"), i.gold -= e.bombP, e.coinLabel.string = i.gold, i.bomb++, e.bombCount.string = i.bomb + "", e._updateBombDatas()) : (i.playEffect("nomoney"), e.shopTitle.string = "+ " + this.addCoinP + " Coins", e.shopLayer.active = !0)
            },
            onAddFrag: function () {
                var e = this;
                i.gold >= e.fragP ? (i.playEffect("buy"), i.gold -= e.fragP, e.coinLabel.string = i.gold, i.frag++, e.fragCount.string = i.frag + "", e._updateFragDatas()) : (i.playEffect("nomoney"), e.shopTitle.string = "+ " + this.addCoinP + " Coins", e.shopLayer.active = !0)
            },
            _updateItem: function () {
                for (var e in this.skillBtn) {
                    var t = this.skillBtn[e];
                    t.color = this._checkCanOpen(e) ? cc.Color.WHITE : cc.Color.GRAY, t.getChildByName("level").getComponent(cc.Label).string = i.skill[e]
                }
            },
            _selectItem: function (e) {
                var t = this;
                t.curSkill = e;
                var n = a.skill[e], o = i.skill[e];
                t.selectRect.position = t.skillBtn[e].position, t.explain.string = n.d, o == n.max ? (t.curLevel.string = "当前: " + (n.start + n.each * o) + (n.percent ? "%" : ""), t.nextLevel.string = "MAX", t.needMoney.string = "NO", t.upgradeString.string = "MAX", t.upgrade.node.color = cc.Color.GRAY, t.upgrade.interactable = !1) : (t.needMoney.string = n.price[o] + "", t.upgradeString.string = "升级", t._checkCanOpen(e) ? (t.curLevel.node.color = cc.Color.YELLOW, t.curLevel.string = "当前: " + (n.start + n.each * o) + (n.percent ? "%" : ""), t.nextLevel.string = "下一级: " + (n.start + n.each * (o + 1)) + (n.percent ? "%d" : ""), t.nextLevel.node.active = !0, t.upgrade.node.color = cc.Color.WHITE, t.upgrade.interactable = !0) : (t.curLevel.node.color = cc.Color.RED, t.curLevel.string = "需要: " + n.n1 + "," + n.n2, t.nextLevel.node.active = !1, t.upgrade.node.color = cc.Color.GRAY, t.upgrade.interactable = !1))
            },
            onClose: function () {
                this.dataSending || (i.playEffect("click"), this.shopLayer.active = !1)
            },
            _updateSkillDatas: function () {
                var e = {
                    gold: i.gold,
                    skillBase: i.skill.base,
                    skillPower: i.skill.power,
                    skillSpeed: i.skill.speed,
                    skillDual: i.skill.dual,
                    skillPierce: i.skill.pierce,
                    skillCritical: i.skill.critical,
                    skillFrag: i.skill.frag,
                    skillBurst: i.skill.burst,
                    skillBomb: i.skill.bomb,
                    skillFinal: i.skill.final
                };
                o.getInstance().setData({data: e, flag: !1})
            },
            _updateGlodDatas: function () {
                var e = {gold: i.gold};
                o.getInstance().setData({data: e, flag: !1})
            },
            _updateBombDatas: function () {
                var e = {gold: i.gold, bomb: i.bomb};
                o.getInstance().setData({data: e, flag: !1})
            },
            _updateFragDatas: function () {
                var e = {gold: i.gold, frag: i.frag};
                o.getInstance().setData({data: e, flag: !1})
            }
        }), cc._RF.pop()
    }, {Global: "Global", Sdk: "Sdk", TypeDefine: "TypeDefine"}],
    Toast: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "fcd30/tsNxH8L4zWCOqkeT6", "Toast"), cc.Class({
            extends: cc.Component,
            properties: {labelHint: cc.Label},
            hint: "",
            start: function () {
                this.labelHint.string = this.hint, this.node.active = !0, this._show()
            },
            init: function (e) {
                e.hint && (this.hint = e.hint)
            },
            _show: function () {
                var e = this, t = e.node.getPosition();
                t.y = 300, e.node.stopAllActions();
                var n = cc.moveTo(1.8, t);
                n.easing(cc.easeElasticOut(5)), e.node.runAction(cc.sequence(n, cc.callFunc(function () {
                    e.node.destroy()
                }, e)))
            }
        }), cc._RF.pop()
    }, {}],
    TypeDefine: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "cd6d4kuf4tA0bvzAJZLsriB", "TypeDefine"), t.exports = {
            skill: {
                power: {
                    id: 0,
                    max: 100,
                    start: 100,
                    each: 10,
                    pos: {x: 0, y: 305},
                    percent: !1,
                    price: [50, 65, 80, 95, 110, 130, 150, 170, 190, 215, 240, 265, 290, 320, 350, 380, 410, 445, 480, 515, 550, 590, 630, 670, 710, 755, 800, 845, 890, 940, 1e3, 1200, 1400, 1600, 1800, 2e3, 2200, 2400, 2600, 2800, 3e3, 3200, 3400, 3600, 3800, 4e3, 4200, 4400, 4600, 4800, 5e3, 5500, 6e3, 6500, 7e3, 7500, 8e3, 8500, 9e3, 9500, 1e4, 10500, 11e3, 11500, 12e3, 12500, 13e3, 13500, 14e3, 14500, 15e3, 15500, 16e3, 16500, 17e3, 17500, 18e3, 18500, 19e3, 19500, 2e4, 21500, 23e3, 24500, 26e3, 27500, 29e3, 30500, 32e3, 33500, 35e3, 36500, 38e3, 39500, 41e3, 42500, 44e3, 45500, 47e3, 48500],
                    n1: "",
                    n2: "",
                    d: "增加枪的伤害."
                },
                speed: {
                    id: 1,
                    max: 30,
                    start: 50,
                    each: 20,
                    pos: {x: -142, y: 248},
                    percent: !1,
                    price: [100, 120, 140, 165, 190, 220, 250, 285, 320, 360, 400, 445, 490, 540, 590, 645, 700, 760, 820, 1e3, 1500, 2e3, 3e3, 4e3, 5e3, 6500, 8e3, 9500, 12e3, 15e3],
                    n1: "能量 Lv.5",
                    n2: "",
                    d: "提高射击速度."
                },
                base: {
                    id: 2,
                    max: 100,
                    start: 1e3,
                    each: 50,
                    pos: {x: 142, y: 305},
                    percent: !1,
                    price: [800, 880, 960, 1040, 1120, 1200, 1360, 1520, 1600, 1760, 1920, 2080, 2240, 2400, 2640, 2800, 3040, 3200, 3440, 3600, 3840, 4080, 4320, 4560, 4720, 5040, 5280, 5520, 5760, 6e3, 6320, 6560, 6800, 7120, 7360, 7680, 8e3, 8240, 8560, 8880, 9200, 9440, 9760, 10080, 10400, 10720, 11040, 11440, 11760, 12080, 12400, 12720, 13120, 13440, 13840, 14160, 14560, 14880, 15280, 15600, 16e3, 16400, 16800, 17120, 17520, 17920, 18320, 18720, 19120, 19520, 19920, 20320, 20720, 21120, 21520, 22e3, 22400, 22800, 23200, 23680, 24080, 24560, 24960, 25360, 25840, 26320, 26720, 27200, 27600, 28080, 28560, 28960, 29440, 29920, 30400, 30880, 31360, 31840, 32320, 32720],
                    n1: "",
                    n2: "",
                    d: "增加基地生命."
                },
                dual: {
                    id: 3,
                    max: 10,
                    start: 55,
                    each: 5,
                    pos: {x: 0, y: 190},
                    percent: !0,
                    price: [3e3, 4e3, 5500, 7500, 1e4, 13e3, 16500, 20500, 25e3, 3e4],
                    n1: "能量 Lv.10",
                    n2: "",
                    d: "枪能射出2发子弹，每发有60%的伤害."
                },
                pierce: {
                    id: 4,
                    max: 20,
                    start: 0,
                    each: 5,
                    pos: {x: -142, y: 132},
                    percent: !0,
                    price: [250, 400, 550, 700, 850, 1e3, 1250, 1500, 1750, 2e3, 2500, 3e3, 3500, 4e3, 4500, 5e3, 6e3, 7e3, 8e3, 1e4],
                    n1: "加速 Lv.10",
                    n2: "",
                    d: "枪有机会刺穿一个敌人."
                },
                critical: {
                    id: 5,
                    max: 20,
                    start: 0,
                    each: 5,
                    pos: {x: 0, y: 70},
                    percent: !0,
                    price: [1e3, 1250, 1500, 1750, 2e3, 2500, 3e3, 3500, 4e3, 4500, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4, 11500, 13e3, 14500, 16e3],
                    n1: "双倍 Lv.5",
                    n2: "",
                    d: "枪有可能造成150%的伤害."
                },
                frag: {
                    id: 6,
                    max: 30,
                    start: 500,
                    each: 50,
                    pos: {x: 142, y: 132},
                    percent: !1,
                    price: [500, 750, 1e3, 1250, 1500, 1750, 2e3, 2250, 2500, 2750, 3e3, 3500, 4e3, 4500, 5e3, 5500, 6e3, 6500, 7e3, 7500, 8e3, 8500, 9e3, 9500, 1e4, 11e3, 12e3, 13e3, 14e3, 15e3],
                    n1: "能量 Lv.10",
                    n2: "占垒 Lv.5",
                    d: "增加碎片伤害 ."
                },
                burst: {
                    id: 7,
                    max: 10,
                    start: 65,
                    each: 5,
                    pos: {x: -142, y: 0},
                    percent: !0,
                    price: [35e3, 37e3, 39500, 42500, 46500, 51500, 57500, 64e3, 71e3, 8e4],
                    n1: "穿孔 Lv.10",
                    n2: "瞄准 Lv.10",
                    d: "枪能射出3发子弹，每发有50%的伤害."
                },
                bomb: {
                    id: 8,
                    max: 10,
                    start: 1e4,
                    each: -1e3,
                    pos: {x: 142, y: 0},
                    percent: !1,
                    price: [2e3, 2250, 2500, 2750, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3],
                    n1: "手雷 Lv.5",
                    n2: "",
                    d: "减少炸弹倒数时间."
                },
                final: {
                    id: 9,
                    max: 1,
                    start: 0,
                    each: 1,
                    pos: {x: 0, y: -55},
                    percent: !1,
                    price: [3e5],
                    n1: "",
                    n2: "",
                    d: "最终武器，使技能值50万硬币."
                }
            },
            enemyInfo: {
                normal: {
                    speed: 100,
                    defend: 1,
                    rate: 1,
                    maxRun: 245,
                    gold: 1,
                    range: {x: 40, y: 50, w: 51, h: 70}
                },
                frag: {speed: 70, defend: 1, rate: 2, maxRun: 750, gold: 1, range: {x: 50, y: 48, w: 73, h: 93}},
                bomber: {speed: 130, defend: 1, rate: .8, maxRun: 240, gold: 1, range: {x: 40, y: 55, w: 62, h: 70}},
                shield: {speed: 50, defend: 1, rate: 1, maxRun: 250, gold: 1, range: {x: 52, y: 16, w: 61, h: 76}},
                tank: {speed: 100, defend: 3, rate: 7, maxRun: 830, gold: 10, range: {x: 70, y: 75, w: 100, h: 85}}
            },
            bombPosition: [{x: -240, y: -300}, {x: 0, y: -300}, {x: 240, y: -300}, {x: -240, y: -105}, {
                x: 0,
                y: -105
            }, {x: 240, y: -105}, {x: -240, y: 90}, {x: 0, y: 90}, {x: 240, y: 90}, {x: -240, y: 285}, {
                x: 0,
                y: 285
            }, {x: 240, y: 285}, {x: -240, y: 390}, {x: 0, y: 390}, {x: 240, y: 390}]
        }, cc._RF.pop()
    }, {}],
    gun: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "81c52tfzGBPFI7nvJEPerEZ", "gun");
        var a = e("Global");
        cc.Class({
            extends: cc.Component, properties: {gunFire: cc.Node, gunShell: cc.Node}, onLoad: function () {
                wxHelper.showBannerAd();
                console.log("555",this.node)
                this.gunFire.active = !1, this.gunShell.active = !1, this.playing = !1, this.reset()
            }, reset: function () {
                var e = this, t = "img/com/gun/gun_";
                e.gun = a.skill.burst > 0 ? 3 : a.skill.dual > 0 ? 2 : 1, 1 == e.gun ? t += "1" : 2 == e.gun ? t += "2" : t += "3_1", cc.loader.loadRes(t, function (t, n) {
                    e.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n)
                });
                var n = Math.max(.05, (500 - 15 * a.skill.speed) / 1e3);
                e.unschedule(e._fire), e.schedule(e._fire, n)
            },
            onDestroy : function(){
                wxHelper.hideBannerAd();
            },
            _fire: function () {
                if (!a.paused) {
                    var e = this;
                    if (a.isFire) {
                        for (var t = 0; t < e.gun; t++) {
                            var n = e.node.x;
                            2 == e.gun ? n += 12 * (0 === t ? 1 : -1) : 3 == e.gun && (n += 20 * t - 20), onfire.fire("oncmd", {
                                cmd: "fire",
                                data: cc.p(n, -470)
                            })
                        }
                        a.playEffect("shoot"), e.playing || (3 == e.gun && e.getComponent(cc.Animation).play("gunrun"), e.gunFire.active = !0, e.gunFire.getComponent(cc.Animation).play("gunfire"), e.gunShell.active = !0, e.gunShell.getComponent(cc.Animation).play("gunshell"))
                    } else e.getComponent(cc.Animation).stop("gunrun"), e.gunFire.active = !1, e.gunFire.getComponent(cc.Animation).stop("gunfire"), e.gunShell.active = !1, e.gunShell.getComponent(cc.Animation).stop("gunshell")
                }
            }
        }), cc._RF.pop()
    }, {Global: "Global"}],
    onfire: [function (e, t, n) {
        "use strict";
        cc._RF.push(t, "d7cd3E1qrJCZ5wRqJgHMR8a", "onfire");
        var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        !function (e, n) {
            "object" === (void 0 === t ? "undefined" : a(t)) && t.exports ? t.exports = n() : e.onfire = n()
        }("undefined" != typeof window ? window : void 0, function () {
            var e = {}, t = 0, n = "string", i = "function", o = Function.call.bind(Object.hasOwnProperty),
                r = Function.call.bind(Array.prototype.slice);

            function c(r, c, s, l) {
                if ((void 0 === r ? "undefined" : a(r)) !== n || (void 0 === c ? "undefined" : a(c)) !== i) throw new Error("args: " + n + ", " + i);
                return o(e, r) || (e[r] = {}), e[r][++t] = [c, s, l], [r, t]
            }

            function s(e, t) {
                for (var n in e) o(e, n) && t(n, e[n])
            }

            function l(t, n) {
                o(e, t) && s(e[t], function (a, i) {
                    i[0].apply(i[2], n), i[1] && delete e[t][a]
                })
            }

            return {
                on: function (e, t, n) {
                    return c(e, t, 0, n)
                }, one: function (e, t, n) {
                    return c(e, t, 1, n)
                }, un: function (t) {
                    var r, c, l = !1, u = void 0 === t ? "undefined" : a(t);
                    return u === n ? !!o(e, t) && (delete e[t], !0) : "object" === u ? (r = t[0], c = t[1], !(!o(e, r) || !o(e[r], c) || (delete e[r][c], 0))) : u !== i || (s(e, function (n, a) {
                        s(a, function (a, i) {
                            i[0] === t && (delete e[n][a], l = !0)
                        })
                    }), l)
                }, fire: function (e) {
                    var t = r(arguments, 1);
                    setTimeout(function () {
                        l(e, t)
                    })
                }, fireSync: function (e) {
                    l(e, r(arguments, 1))
                }, clear: function () {
                    e = {}
                }
            }
        }), cc._RF.pop()
    }, {}]
}, {}, ["Bomb", "CurRound", "EnemySprite", "FragBullet", "GameMain", "Global", "Item", "Leadboard", "Logo", "RoleBullet", "SkillScene", "Toast", "TypeDefine", "Facebook", "Img", "Log", "Sdk", "onfire", "gun"]);