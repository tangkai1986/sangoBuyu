import Global from './../Global'
import ButtonSimpleStype from './../Util/ButtonSimpleStyle'
import Define from './../Define'

// window.io = require('src/assets/Script/Lib/socket.io.7e6f9.js');
// com.xgame.happer

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
        messageLabel: {
            type: cc.Label,
            default: null,
        },
    },

    _showInfo () {
        const visibleSize = cc.view.getVisibleSize();
        const frameSize = cc.view.getFrameSize();
        const designSize = cc.view.getDesignResolutionSize();
        const canvasSize = cc.view.getCanvasSize();
        const windowSize = cc.winSize;
        console.log('cc.sys.platform = ' + cc.sys.platform);
        console.log('cc.sys.isBrowser = ' + cc.sys.isBrowser);
        if(cc.sys.platform === cc.sys.ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "print", "(Ljava/lang/String;II)V", "visibleSize", visibleSize.width, visibleSize.height);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "print", "(Ljava/lang/String;II)V", "frameSize", frameSize.width, frameSize.height);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "print", "(Ljava/lang/String;II)V", "designSize", designSize.width, designSize.height);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "print", "(Ljava/lang/String;II)V", "canvasSize", canvasSize.width, canvasSize.height);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "print", "(Ljava/lang/String;II)V", "windowSize", windowSize.width, windowSize.height);
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){

        } else {
            console.log("visibleSize:" + visibleSize.width + ' - ' + visibleSize.height);
            console.log("frameSize:" + frameSize.width + ' - ' + frameSize.height);
            console.log("designSize:" + designSize.width + ' - ' + designSize.height);
            console.log("canvasSize:" + canvasSize.width + ' - ' + canvasSize.height);
            console.log("windowSize:" + windowSize.width + ' - ' + windowSize.height);
        }


    },

    onLoad () {
        console.log('asdasdsfdsfsdfsddf');
        this._showInfo();
        this.sx = 1;
        this.sy = 1;
        let visibleSize;
        if(cc.sys.platform === cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            visibleSize = cc.view.getCanvasSize();
        } else if(cc.sys.isBrowser){
            visibleSize = cc.view.getCanvasSize();
        } else {
            visibleSize = cc.view.getVisibleSize();
        }
        let designSize = cc.view.getDesignResolutionSize();
        let p1 = designSize.width / designSize.height;
        let p2 = visibleSize.width / visibleSize.height;
        // console.log('visibleSize = ' + visibleSize);
        // console.log('designSize = ' + designSize);
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx = visibleSize.width / (visibleSize.height / designSize.height * designSize.width);
        } else {
            this.sy = visibleSize.height / (visibleSize.width / designSize.width * designSize.height);
        }
        // console.log("p1:" + p1);
        // console.log("p2:" + p2);
        // console.log("this.sx:" + this.sx);
        // console.log("this.sy:" + this.sy);

        cc.director.on('connect_success', this._showLoginNode, this);
        cc.director.on('connect_disconnect', this._hideLoginNode, this);
        // 已经登陆过
        if(Global.GameData && Global.GameData.player && Global.GameData.player.uid){
            this._loadBackground ();
            this._showLoginNode();
        } else {
            cc.game.setFrameRate(30);
            Global.LanguageManager.loadLanguage(() => {
                this._loadBackground();
            });
        }
    },

    onDestroy () {
        cc.director.off('connect_success', this._showLoginNode, this);
        cc.director.off('connect_disconnect', this._hideLoginNode, this);
    },

    _loadBackground () {
        let url = 'Image/startbg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('startbg');
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;
            this._bgNode.scaleX = this.sx;
            this._bgNode.scaleY = this.sy;

            this._loadButton();
        });
    },

    _loadButton () {
        Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
            var button = cc.instantiate(buttonPrefab);
            this.node.getChildByName('loginNode').addChild(button);
            button.setPosition(0, -160);
            // 按钮样式
            button.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BLUE);
            // 设置文本
            let txt = Global.LanguageManager.getLanguage(1);
            button.getComponent('ButtonSimple').changeText(txt);
            //点击事件
            let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'Welcome', 'funcStart', "fuck");
            button.getComponent('ButtonSimple').registerClickEvent(clickEventHandler);

            Global.SocketController.initSocket();
        });
    },

    _showLoginNode () {
        let loginNode = this.node.getChildByName('loginNode');
        loginNode.zIndex = 1000;
        loginNode.active = true;
        loginNode.opacity = 0;
        let act = cc.fadeIn(1).easing(cc.easeSineOut());
        loginNode.runAction(act);
        this.messageLabel = loginNode.getChildByName('label').getComponent(cc.Label);
        this.messageLabel.string = '';
    },


    _hideLoginNode () {
        let loginNode = this.node.getChildByName('loginNode');
        loginNode.active = false;
    },

    funcStart1 (event, customEventData) {
        console.log('aaaa 3wx');
        console.log('cc.sys.platform = ' + cc.sys.platform);
        console.log('cc.sys.WECHAT_GAME = ' + cc.sys.WECHAT_GAME);
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            wx.cloud.init({
                env: 'test-097b9b'
            });
            console.log('aaaa 55');
            wx.cloud.callFunction({
                // 云函数名称
                name: 'add',
                // 传给云函数的参数
                data: {
                    a: 1,
                    b: 2,
                },
                success: function(res) {
                    console.log('wx.cloud.callFunction:add 1 : ' + res.result.sum);
                },
                fail: console.error
            })

            console.log('aaaa 66');
            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'getUserInfo',
                // 传递给云函数的参数
                success: res => {
                    console.log('wx.cloud.callFunction:add 2 : ' + JSON.stringify(res.result));
                },
                fail: err => {
                    console.log('wx.cloud.callFunction:add 2 err : ' + err);
                },
                complete: () => {
                    console.log('wx.cloud.callFunction: 2  complete ');
                }
            })
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '获取用户信息',
                style: {
                    left: 10,
                    top: 76,
                    width: 200,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });
            button.onTap((res) => {
                console.log(res)
            });
        }
    },


    funcStart (event, customEventData) {

        console.log('aaaa 3');
        let loginNode = this.node.getChildByName('loginNode');
        let usernameInput = loginNode.getChildByName('username').getComponent(cc.EditBox);
        let passwordInput = loginNode.getChildByName('password').getComponent(cc.EditBox);
        let avatarUrl = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=373849174,2079142017&fm=27&gp=0.jpg';
        Global.SocketController.login(usernameInput.string, passwordInput.string, usernameInput.string, avatarUrl, (err, data) => {
            if(err){
                console.log('login err: ' + err);
                this.messageLabel.string = err;
            } else {
                console.log('login info: ' + JSON.stringify(data));
                this.messageLabel.string = Global.LanguageManager.getLanguage(5);
                //初始化用户数据
                Global.GameData.initPlayer(data);
                //跳过选择房间步骤，直接接受服务器房间信息登陆房间
                Global.SocketController.joinHall( (err, data) => {
                    if(err){
                        console.log('join_hall err: ' + JSON.stringify(err));
                    } else {
                        console.log('join_hall data: ' + JSON.stringify(data));
                        Global.GameData.setPlayerNumbetInSimpleRoom(data.numSimple);
                        Global.GameData.setPlayerNumbetInHardRoom(data.numHard);
                        if(this._bgNode){
                            this._bgNode.destroy();
                        }
                        cc.audioEngine.stopAll();
                        cc.director.loadScene('RoomSelect');
                    }
                });
            }
        });
    },

});
