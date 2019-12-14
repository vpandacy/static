;
var sdEditorEmoj = {
    emojiconfig: {
        qq: {
            name: "QQ表情",
            path: "emoji/",
            imgName: ["1.gif", "2.gif", ],
            alias: ["微笑", "伤心", ],
            title: ["[Smile]", "[Grimace]", ],
        },
    },
    emojiRealTimeData: [/*{imgUrl: "",title: "",alias: "",num:"",},*/],
    Init: function (options,element,elid) {
        var isShowImg = true,
            faceDivBox = $('.faceDivBox'),
            faceDiv = $('.faceDiv'),
            div = $('#content'),
            isAnimate = false;
        var emojiContainer = faceDiv.find('.emoji-box'),
            emojiconfig = options;
        var div = document.getElementById('content');
        //emojiconfig = sdEditorEmoj.emojiconfig;
        // div.focus(function () {
        //     $(this).parent().addClass('clicked')
        // });
        $(".imgBtn,.closeFaceBox").on('click', function () {
            //div.focus();
            faceDivShowHide();
        });
        $("#openFace").on('click', function () {
            //div.focus();
            faceDivShowHide();
        });
        // 点击除按钮和弹框之外任意地方隐藏表情
        $("body").click(function (e) {
            if (!$(e.target).closest("#content,.min-onclick,.icon-biaoqing,.faceDivBox").length) {
                $(".faceDivBox").fadeOut();
            }
        });
        var faceDivShowHide = function () {
            var fb = $(".faceDivBox"),
                ib = $(".infoBox");
            if ($(".infoBoxl").length != '0') {
                var ibl = $(".infoBoxl");
            }
            var display = fb.css('display');
            if (isShowImg == false) {
                if (ibl) {
                    ibl.animate({ width: "100%", marginLeft: "145px" }, 600);
                }
                fb.fadeOut();
                isShowImg = true;
            } else {
                if (ibl) {
                    ibl.animate({ width: "602px", marginLeft: "40px" }, 600, function () {
                        setTimeout(function () { fb.fadeIn(); }, 600);
                    });
                } else {
                    fb.fadeIn();
                }
                isShowImg = false;
            }
        };

        if ($(".faceDiv span").length == 0) {
            var num = 0;
            var imgName = '';
            for (var emojilist in emojiconfig) {  //添加emoji标签
                var maxNum = Object.keys(emojiconfig[emojilist].alias).length - 1;
                num++;
                var emclassf = 'em' + num + '-';
                emojiContainer.append('<section class="for-' + emojilist + '"></section>');
                faceDiv.find('.emoji-tab').append('<a href="javascript:void(0);" data-target="for-' + emojilist + '">' + emojiconfig[emojilist].name + '</a>');
                for (var i = 0; i <= maxNum; i++) {
                    imgName = emojiconfig[emojilist].imgName[i];
                    imgName = imgName.substring(0, imgName.length - 4);
                    emclass = emclassf + imgName;
                    if (emojiContainer.find('.for-' + emojilist) !== undefined) {
                        var c = '<a unselectable="on" href="javascript:void(0);" class="embox"><span data-src="'
                            + emojiconfig[emojilist].path + emojiconfig[emojilist].imgName[i] + '" class="em ' + emclass + '" data-alias="'
                            + (emojiconfig[emojilist].alias[i] == undefined ? '' : emojiconfig[emojilist].alias[i]) + '" title="'
                            + (emojiconfig[emojilist].title[i] == undefined ? (emojiconfig[emojilist].empty) : emojiconfig[emojilist].title[i]) + '">' + emojiconfig[emojilist].alias[i] + '</span></a>';
                        emojiContainer.find('.for-' + emojilist).append(c);
                    }
                }
            }
            // faceDivShowHide();
        }

        $(".contentBox,.faceDiv").click(function () {
            return false;
        });
        // $(".faceDiv").click(function () {
        //     div.focus();
        // });
        $(".tab-pre").click(function () {
            if (isAnimate) return false;
            isAnimate = true;
            var tabBox = $(".emoji-tab"),
                aNum = tabBox.find("a").length,
                num = parseInt(aNum / 8),
                tabBoxMaxMTop = -352 * num,
                mtop = parseInt(tabBox.css("marginTop"));
            if (mtop != 0) {
                var cTop = mtop + 352 + 'px';
                tabBox.animate({ marginTop: cTop }, 300, function () {
                    isAnimate = false;
                });
            } else {
                tabBoxMaxMTop = tabBoxMaxMTop + 'px'
                tabBox.animate({ marginTop: tabBoxMaxMTop }, 300, function () {
                    isAnimate = false;
                });
            }
            return false;
        });
        $(".tab-next").click(function () {
            if (isAnimate) return false;
            isAnimate = true;
            var tabBox = $(".emoji-tab"),
                aNum = tabBox.find("a").length,
                num = parseInt(aNum / 8),
                tabBoxMaxMTop = -352 * num,
                mtop = parseInt(tabBox.css("marginTop"));
            if (tabBoxMaxMTop < mtop) {
                var cTop = mtop - 352 + 'px';
                tabBox.animate({ marginTop: cTop }, 300, function () {
                    isAnimate = false;
                });
            } else {
                tabBox.animate({ marginTop: "0px" }, 300, function () {
                    isAnimate = false;
                });
            }
            return false;
        });
    },
    bindClickImg: function (obj) {
        var faceDiv = $('.faceDiv'), div = $('#content');
        //初始化emoji标签选项
        faceDiv.find('.emoji-box section').css("display", "none").eq(0).css("display", "block");
        faceDiv.find('.emoji-tab a').eq(0).addClass("active");
        faceDiv.find('.emoji-box img,.emoji-box .embox').on('click', function () { //选择图片 点击表情
            insertText(obj,$(this).find("span").attr("data-alias"));
        });
        faceDiv.find('.emoji-tab a').on('click', function () { //切换表情标签
            div.focus();
            $(this).parent().parent().prev().find('section').hide();
            faceDiv.find('.emoji-box .' + $(this).attr('data-target')).show();
            faceDiv.find('.emoji-tab a').removeClass('active');
            this.className += ' active';
            $(this).parent().parent().parent();
            var faceDivHeight = faceDiv.height(),
                nowSectionClass = "." + $(this).attr('data-target'),
                nowSection = $(nowSectionClass),
                contentHeight = nowSection.height();  //outerHeight()
            if (faceDivHeight < contentHeight) {
                faceDiv.addClass('isScrolly');
            } else {
                faceDiv.removeClass('isScrolly');
            }
            return false;
        });
        function insertText(opation,val) {
            var obj = document.getElementById(opation.id);
            var str = val;
            if(opation.type == "input"){
                if (document.selection) {
                    obj.focus();
                    var sel = document.selection.createRange();
                    sel.text = str;
                } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                    var startPos = obj.selectionStart;
                    var endPos = obj.selectionEnd;
                    var tmpStr = obj.value;
                    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                } else {
                    obj.value += str;
                }
            }else{
                if (document.selection) {
                    obj.focus();
                    var sel = document.selection.createRange();
                    sel.text = str;
                } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                    var startPos = obj.selectionStart;
                    var endPos = obj.selectionEnd;
                    var tmpStr = obj.innerHTML;
                    obj.innerHTML = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                } else {
                    obj.innerHTML += str;
                }
            }
        }
    },
    setEmoji: function (obj) {
        sdEditorEmoj.bindClickImg(obj);
    },
};


;
var emojiconfig = {
    emojiaSeries: {
        name: "表情系列",
        path: "../emoji/1/",
        imgName: ["bqfh0.png", "bqfh1.png", "bqfh2.png", "bqfh3.png", "bqfh4.png", "bqfh5.png", "bqfh6.png", "bqfh7.png", "bqfh8.png", "bqfh9.png", "bqfh10.png", "bqfh11.png", "bqfh12.png", "bqfh13.png", "bqfh14.png", "bqfh15.png", "bqfh16.png", "bqfh17.png", "bqfh18.png", "bqfh19.png", "bqfh20.png", "bqfh21.png", "bqfh22.png", "bqfh23.png", "bqfh24.png", "bqfh25.png", "bqfh26.png", "bqfh27.png", "bqfh28.png", "bqfh29.png", "bqfh30.png", "bqfh31.png", "bqfh32.png", "bqfh33.png", "bqfh34.png", "bqfh35.png", "bqfh36.png", "bqfh37.png", "bqfh38.png", "bqfh39.png", "bqfh40.png", "bqfh41.png", "bqfh42.png", "bqfh43.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh47.png", "bqfh48.png", "bqfh49.png", "bqfh50.png", "bqfh51.png", "bqfh52.png", "bqfh53.png", "bqfh54.png", "bqfh55.png", "bqfh56.png", "bqfh57.png", "bqfh73.png", "bqfh74.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh79.png", "bqfh80.png", "bqfh81.png", "bqfh82.png", "bqfh83.png"],
        alias: ["😄", "😃", "😀", "😊", "☺", "😉", "😍", "😘", "😚", "😗", "😙", "😜", "😝", "😛", "😳", "😁", "😔", "😌", "😒", "😞", "😣", "😢", "😂", "😭", "😪", "😥", "😰", "😅", "😓", "😩", "😫", "😨", "😱", "😠", "😡", "😤", "😖", "😆", "😋", "😷", "😎", "😴", "😵", "😲", "😟", "😦", "😧", "😈", "👿", "😮", "😬", "😐", "😕", "😯", "😶", "😇", "😏", "😑", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "👹", "👺", ],
        title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    },
    // animal: {
    //     name: "动物系列",
    //     path: "../emoji/2/",
    //     imgName: ["bqfh0.png", "bqfh1.png", "bqfh2.png", "bqfh3.png", "bqfh4.png", "bqfh5.png", "bqfh6.png", "bqfh7.png", "bqfh8.png", "bqfh9.png", "bqfh10.png", "bqfh11.png", "bqfh12.png", "bqfh13.png", "bqfh14.png", "bqfh15.png", "bqfh16.png", "bqfh17.png", "bqfh18.png", "bqfh19.png", "bqfh20.png", "bqfh21.png", "bqfh22.png", "bqfh23.png", "bqfh24.png", "bqfh25.png", "bqfh26.png", "bqfh27.png", "bqfh28.png", "bqfh29.png", "bqfh30.png", "bqfh31.png", "bqfh32.png", "bqfh33.png", "bqfh34.png", "bqfh35.png", "bqfh36.png", "bqfh37.png", "bqfh38.png", "bqfh39.png", "bqfh40.png", "bqfh41.png", "bqfh42.png", "bqfh43.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh47.png", "bqfh48.png", "bqfh49.png", "bqfh50.png", "bqfh51.png", "bqfh52.png", "bqfh53.png", "bqfh54.png", "bqfh55.png", "bqfh56.png", "bqfh57.png", "bqfh58.png", "bqfh59.png", "bqfh60.png", "bqfh61.png", "bqfh62.png", "bqfh84.png", "bqfh85.png", "bqfh86.png", "bqfh87.png", "bqfh88.png", "bqfh73.png", "bqfh74.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh79.png", "bqfh80.png", "bqfh81.png"],
    //     alias: ["🐶", "🐺", "🐱", "🐭", "🐹", "🐰", "🐸", "🐯", "🐨", "🐻", "🐷", "🐽", "🐮", "🐗", "🐵", "🐒", "🐴", "🐑", "🐘", "🐼", "🐧", "🐦", "🐤", "🐥", "🐣", "🐔", "🐍", "🐢", "🐛", "🐝", "🐜", "🐞", "🐌", "🐙", "🐚", "🐠", "🐟", "🐬", "🐳", "🐋", "🐄", "🐏", "🐀", "🐃", "🐅", "🐇", "🐉", "🐎", "🐐", "🐓", "🐕", "🐖", "🐁", "🐂", "🐲", "🐡", "🐊", "🐫", "🐪", "🐆", "🐈", "🐩", "🐾", "🙈", "🙉", "🙊", "💀", "👽", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", ],
    //     title: ["小狗符号", "狼狗符号", "小猫头像", "老鼠头像", "花鼠头像", "兔子头像", "青蛙头像", "老虎头像", "考拉头像", "小熊头像", "猪的头像", "猪鼻符号", "牛的头像", "野猪头像", "猴子头像", "小猴子图像", "马的头像", "绵羊符号", "大象符号", "熊猫头像", "企鹅头像", "鸽子头像", "小鸟头像", "小鸡图像", "小鸡", "母鸡头像", "蛇的符号", "乌龟符号", "虫子符号", "蜜蜂符号", "蚂蚁符号", "瓢虫符号", "蜗牛符号", "章鱼", "海螺壳", "热带鱼", "鱼", "海豚", "喷水鲸鱼", "长须鲸", "奶牛", "绵羊", "老鼠", "牛", "老虎", "兔子", "龙", "马", "羊", "鸡", "狗", "猪", "老鼠", "牛", "龙头", "鱼", "鳄鱼", "骆驼", "骆驼", "牧羊犬", "牧羊犬", "狮子狗", "爪印", "害羞的猴子", "捂着耳朵的猴子", "偷笑的猴子", "骷髅", "外星人", "微笑的猫脸", "咧着嘴笑得猫脸", "色迷迷的猫脸", "接吻猫", "苦笑的猫脸", "疲倦的猫脸", "哭的猫脸", "流着泪的猫脸", "撅嘴的猫脸", ],
    // },
    // fruitFood: {
    //     name: "水果食物",
    //     path: "../emoji/3/",
    //     imgName: ["bqfh169.png", "bqfh170.png", "bqfh171.png", "bqfh172.png", "bqfh173.png", "bqfh174.png", "bqfh175.png", "bqfh176.png", "bqfh177.png", "bqfh178.png", "bqfh179.png", "bqfh180.png", "bqfh181.png", "bqfh182.png", "bqfh183.png", "bqfh184.png", "bqfh185.png", "bqfh186.png", "bqfh187.png", "bqfh188.png", "bqfh189.png", "bqfh190.png", "bqfh191.png", "bqfh192.png", "bqfh193.png", "bqfh194.png", "bqfh195.png", "bqfh196.png", "bqfh197.png", "bqfh198.png", "bqfh199.png", "bqfh200.png", "bqfh201.png", "bqfh202.png", "bqfh203.png", "bqfh204.png", "bqfh205.png", "bqfh206.png", "bqfh207.png", "bqfh208.png", "bqfh209.png", "bqfh210.png", "bqfh211.png", "bqfh212.png", "bqfh213.png", "bqfh214.png", "bqfh215.png", "bqfh216.png", "bqfh217.png", "bqfh218.png", "bqfh219.png", "bqfh220.png", "bqfh221.png", "bqfh222.png", "bqfh223.png", "bqfh224.png", "bqfh225.png", "bqfh226.png", "bqfh227.png"],
    //     alias: ["☕", "🍵", "🍶", "🍼", "🍺", "🍻", "🍸", "🍹", "🍷", "🍴", "🍕", "🍔", "🍟", "🍗", "🍖", "🍝", "🍛", "🍤", "🍱", "🍣", "🍥", "🍙", "🍘", "🍚", "🍜", "🍲", "🍢", "🍡", "🍳", "🍞", "🍩", "🍮", "🍦", "🍨", "🍧", "🎂", "🍰", "🍪", "🍫", "🍬", "🍭", "🍯", "🍎", "🍏", "🍊", "🍋", "🍒", "🍇", "🍉", "🍓", "🍑", "🍈", "🍌", "🍐", "🍍", "🍠", "🍆", "🍅", "🌽", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // plantNature: {
    //     name: "植物自然",
    //     path: "../emoji/4/",
    //     imgName: ["bqfh63.png", "bqfh64.png", "bqfh65.png", "bqfh66.png", "bqfh67.png", "bqfh68.png", "bqfh69.png", "bqfh70.png", "bqfh71.png", "bqfh72.png", "bqfh73.png", "bqfh74.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh79.png", "bqfh80.png", "bqfh81.png", "bqfh82.png", "bqfh83.png", "bqfh84.png", "bqfh85.png", "bqfh86.png", "bqfh87.png", "bqfh88.png", "bqfh89.png", "bqfh90_002.png", "bqfh91_002.png", "bqfh92_002.png", "bqfh93_002.png", "bqfh94_002.png", "bqfh95_002.png", "bqfh96_002.png", "bqfh97.png", "bqfh98_002.png", "bqfh99_002.png", "bqfh100.png", "bqfh101.png", "bqfh102.png", "bqfh103.png", "bqfh104.png", "bqfh105.png", "bqfh106.png", "bqfh107.png", "bqfh108.png", "bqfh109.png", "bqfh110.png", "bqfh111.png", "bqfh112.png", "bqfh113.png", "bqfh114.png", "bqfh115.png", "bqfh90.png", "bqfh91.png", "bqfh92.png", "bqfh93.png", "bqfh94.png", "bqfh95.png", "bqfh96.png", "bqfh97_002.png", "bqfh98.png", "bqfh99.png"],
    //     alias: ["💐", "🌸", "🌷", "🍀", "🌹", "🌻", "🌺", "🍁", "🍃", "🍂", "🌿", "🌾", "🍄", "🌵", "🌴", "🌲", "🌳", "🌰", "🌱", "🌼", "🌐", "🌞", "🌝", "🌚", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌜", "🌛", "🌙", "🌍", "🌎", "🌏", "🌋", "🌌", "🌠", "⭐", "☀", "⛅", "☁", "⚡", "☔", "❄", "⛄", "🌀", "🌁", "🌈", "🌊", "🔥", "✨", "🌟", "💫", "💥", "💢", "💦", "💧", "💤", "💨", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // zodiac: {
    //     name: "生肖星座",
    //     path: "../emoji/5/",
    //     imgName: ["bqfh52.png", "bqfh53.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh26.png", "bqfh47.png", "bqfh48.png", "bqfh15.png", "bqfh49.png", "bqfh50.png", "bqfh51.png", "bqfh110.png", "bqfh111.png", "bqfh112.png", "bqfh113.png", "bqfh114.png", "bqfh115.png", "bqfh116.png", "bqfh117.png", "bqfh118.png", "bqfh119.png", "bqfh120.png", "bqfh121.png"],
    //     alias: ["🐁", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", ],
    //     title: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座", ],
    // },
    // sports: {
    //     name: "运动休闲",
    //     path: "../emoji/6/",
    //     imgName: ["bqfh131.png", "bqfh132.png", "bqfh133.png", "bqfh134.png", "bqfh135.png", "bqfh136.png", "bqfh137.png", "bqfh138.png", "bqfh139.png", "bqfh140.png", "bqfh141.png", "bqfh142.png", "bqfh143.png", "bqfh144.png", "bqfh145.png", "bqfh146.png", "bqfh147.png", "bqfh148.png", "bqfh149.png", "bqfh150.png", "bqfh151.png", "bqfh152.png", "bqfh153.png", "bqfh154.png", "bqfh155.png", "bqfh156.png", "bqfh157.png", "bqfh158.png", "bqfh159.png", "bqfh160.png", "bqfh161.png", "bqfh162.png", "bqfh163.png", "bqfh164.png", "bqfh165.png", "bqfh166.png", "bqfh167.png", "bqfh168.png"],
    //     alias: ["📰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🎻", "🎷", "🎸", "👾", "🎮", "🃏", "🎴", "🀄", "🎲", "🎯", "🏈", "🏀", "⚽", "⚾", "🎾", "🎱", "🏉", "🎳", "⛳", "🚵", "🚴", "🏁", "🏇", "🏆", "🎿", "🏂", "🏊", "🏄", "🎣", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // person: {
    //     name: "人物相关",
    //     path: "../emoji/7/",
    //     imgName: ["bqfh100.png", "bqfh101.png", "bqfh102.png", "bqfh103.png", "bqfh104.png", "bqfh105.png", "bqfh106.png", "bqfh107.png", "bqfh108.png", "bqfh109.png", "bqfh110.png", "bqfh111.png", "bqfh112.png", "bqfh113.png", "bqfh114.png", "bqfh115.png", "bqfh116.png", "bqfh117.png", "bqfh118.png", "bqfh119.png", "bqfh120.png", "bqfh121.png", "bqfh122.png", "bqfh123.png", "bqfh124.png", "bqfh125.png", "bqfh126.png", "bqfh127.png", "bqfh128.png", "bqfh129.png", "bqfh130.png", "bqfh131.png", "bqfh132.png", "bqfh133.png", "bqfh134.png", "bqfh135.png", "bqfh136.png", "bqfh137.png", "bqfh138.png", "bqfh139.png", "bqfh140.png", "bqfh141.png", "bqfh142.png", "bqfh143.png", "bqfh144.png", "bqfh145.png", "bqfh146.png", "bqfh147.png", "bqfh148.png", "bqfh149.png", "bqfh150.png", "bqfh151.png", "bqfh152.png", "bqfh153.png", "bqfh154.png", "bqfh155.png", "bqfh156.png", "bqfh157.png", "bqfh158.png", "bqfh159.png", "bqfh160.png", "bqfh161.png", "bqfh162.png", "bqfh163.png", "bqfh164.png", "bqfh165.png", "bqfh166.png", "bqfh180.png", "bqfh185.png", "bqfh181.png", "jiezhi.png"],
    //     alias: ["👂", "👀", "👃", "👅", "👄", "👍", "👎", "👌", "👊", "✊", "✌", "👋", "✋", "👐", "👆", "👇", "👉", "👈", "🙌", "🙏", "☝", "👏", "💪", "🚶", "🏃", "💃", "👫", "👪", "👬", "👭", "💏", "💑", "👯", "🙆", "🙅", "💁", "🙋", "💇", "💅", "👰", "🙎", "🙍", "🙇", "🎩", "👑", "👒", "👟", "👞", "👡", "👠", "👢", "👕", "👔", "👚", "👗", "🎽", "👖", "👘", "👙", "💼", "👜", "👝", "👛", "👓", "🎀", "🌂", "💄", "💋", "👣", "💎", "💍", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // trick: {
    //     name: "花样庆祝",
    //     path: "../emoji/8/",
    //     imgName: ["bqfh144.png", "bqfh90.png", "bqfh91.png", "bqfh92.png", "bqfh93.png", "bqfh94.png", "bqfh164.png", "bqfh165.png", "bqfh166.png", "bqfh167.png", "bqfh168.png", "bqfh169.png", "bqfh170.png", "bqfh171.png", "bqfh172.png", "bqfh173.png", "bqfh174.png", "bqfh175.png", "bqfh176.png", "bqfh177.png", "bqfh178.png", "bqfh179.png", "bqfh180.png", "bqfh0.png", "bqfh1.png", "bqfh2.png", "bqfh3.png", "bqfh4.png", "bqfh5.png", "bqfh6.png", "bqfh7.png", "bqfh8.png", "bqfh9.png", "bqfh10.png", "bqfh11.png", "bqfh12.png", "bqfh13.png", "bqfh14.png", "bqfh15.png", "bqfh16.png", "bqfh17.png", "bqfh18.png", "bqfh19.png"],
    //     alias: ["👑", "🔥", "✨", "🌟", "💫", "💥", "🎀", "🌂", "💄", "💛", "💙", "💜", "💚", "❤", "💔", "💗", "💓", "💕", "💖", "💞", "💘", "💌", "💋", "🎍", "💝", "🎎", "🎒", "🎓", "🎏", "🎆", "🎇", "🎐", "🎑", "🎃", "👻", "🎅", "🎄", "🎁", "🎋", "🎉", "🎊", "🎈", "🎌", ],
    //     title: ["皇冠", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // textSeries: {
    //     name: "文字系列",
    //     path: "../emoji/9/",
    //     imgName: ["bqfh51.png", "bqfh52.png", "bqfh53.png", "bqfh54.png", "bqfh55.png", "bqfh56.png", "bqfh57.png", "bqfh58.png", "bqfh59.png", "bqfh60.png", "bqfh65.png", "bqfh68.png", "bqfh71.png", "bqfh72.png", "bqfh73.png", "bqfh74.png", "bqfh79.png", "bqfh80.png", "bqfh81.png", "bqfh82.png", "bqfh83.png", "bqfh84.png", "bqfh86.png", "bqfh85.png", "bqfh100.png", "bqfh103.png", "bqfh104.png", "bqfh105.png", "bqfh106.png", "bqfh95.png"],
    //     alias: ["🈯", "🈳", "🈵", "🈴", "🈲", "🉐", "🈹", "🈺", "🈶", "🈚", "🚾", "🅿", "🈷", "🈸", "🈂", "Ⓜ", "🉑", "㊙", "㊗", "🆑", "🆘", "🆔", "🔞", "🚫", "🆚", "🅰", "🅱", "🆎", "🅾", "❇", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // goods: {
    //     name: "物体物件",
    //     path: "../emoji/10/",
    //     imgName: ["bqfh20.png", "bqfh21.png", "bqfh22.png", "bqfh23.png", "bqfh24.png", "bqfh25.png", "bqfh26.png", "bqfh27.png", "bqfh28.png", "bqfh29.png", "bqfh30.png", "bqfh31.png", "bqfh32.png", "bqfh33.png", "bqfh34.png", "bqfh35.png", "bqfh36.png", "bqfh37.png", "bqfh38.png", "bqfh39.png", "bqfh40.png", "bqfh41.png", "bqfh42.png", "bqfh43.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh47.png", "bqfh48.png", "bqfh49.png", "bqfh50.png", "bqfh51.png", "bqfh52.png", "bqfh53.png", "bqfh54.png", "bqfh55.png", "bqfh56.png", "bqfh57.png", "bqfh58.png", "bqfh59.png", "bqfh60.png", "bqfh61.png", "bqfh62.png", "bqfh63.png", "bqfh64.png", "bqfh65.png", "bqfh66.png", "bqfh67.png", "bqfh68.png", "bqfh69.png", "bqfh70.png", "bqfh71.png", "bqfh72.png", "bqfh73.png", "bqfh74.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh79.png", "bqfh80.png", "bqfh81.png", "bqfh82.png", "bqfh83.png", "bqfh84.png", "bqfh85.png", "bqfh86.png", "bqfh87.png", "bqfh88.png", "bqfh89.png", "bqfh90.png", "bqfh91.png", "bqfh92.png", "bqfh93.png", "bqfh94.png", "bqfh95.png", "bqfh96.png", "bqfh97.png", "bqfh98.png", "bqfh99.png", "bqfh100.png", "bqfh101.png", "bqfh102.png", "bqfh103.png", "bqfh104.png", "bqfh105.png", "bqfh106.png", "bqfh107.png", "bqfh108.png", "bqfh109.png", "bqfh110.png", "bqfh111.png", "bqfh112.png", "bqfh113.png", "bqfh114.png", "bqfh115.png", "bqfh116.png", "bqfh117.png", "bqfh118.png", "bqfh119.png", "bqfh120.png", "bqfh121.png", "bqfh122.png", "bqfh123.png", "bqfh124.png", "bqfh125.png", "bqfh126.png", "bqfh127.png", "bqfh128.png", "bqfh129.png", "bqfh130.png"],
    //     alias: ["🔮", "🎥", "📷", "📹", "📼", "💿", "📀", "💽", "💾", "💻", "📱", "☎", "📞", "📟", "📠", "📡", "📺", "📻", "🔊", "🔉", "🔈", "🔇", "🔔", "🔕", "📢", "📣", "⏳", "⌛", "⏰", "⌚", "🔓", "🔒", "🔐", "🔑", "🔎", "💡", "🔦", "🔆", "🔅", "🔌", "🔋", "🔍", "🛁", "🛀", "🚿", "🚽", "🔧", "🔩", "🔨", "🚪", "🚬", "💣", "🔫", "🔪", "💊", "undefined", "💰", "💴", "💵", "💷", "💶", "💳", "💸", "📲", "📧", "📥", "📤", "✉", "📩", "📨", "📯", "📫", "📪", "📬", "📭", "📮", "📦", "📝", "📄", "📃", "📑", "📊", "📈", "📉", "📜", "📋", "📅", "📆", "📇", "📁", "📂", "✂", "📌", "📎", "✒", "✏", "📏", "📐", "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📚", "📖", "🔖", "📛", "🔬", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // },
    // signs: {
    //     name: "各种标识",
    //     path: "../emoji/11/",
    //     imgName: ["bqfh61.png", "bqfh62.png", "bqfh63.png", "bqfh64.png", "bqfh66.png", "bqfh67.png", "bqfh69.png", "bqfh70.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh85.png", "bqfh86.png", "bqfh88.png", "bqfh89.png", "bqfh90.png", "bqfh91.png", "bqfh92.png", "bqfh93.png", "bqfh94.png", "bqfh95.png", "bqfh96.png", "bqfh97.png", "bqfh98.png", "bqfh99.png", "bqfh101.png", "bqfh102.png", "bqfh107.png", "bqfh108.png", "bqfh109.png", "bqfh122.png", "bqfh0.png", "bqfh1.png", "bqfh2.png", "bqfh3.png", "bqfh4.png", "bqfh5.png", "bqfh6.png", "bqfh7.png", "bqfh8.png", "bqfh9.png", "bqfh10.png", "bqfh11.png", "bqfh12.png", "bqfh13.png", "bqfh14.png", "bqfh15.png", "bqfh16.png", "bqfh17.png", "bqfh18.png", "bqfh19.png", "bqfh20.png", "bqfh21.png", "bqfh22.png", "bqfh23.png", "bqfh24.png", "bqfh25.png", "bqfh26.png", "bqfh27.png", "bqfh28.png", "bqfh29.png", "bqfh30.png", "bqfh31.png", "bqfh32.png", "bqfh33.png", "bqfh34.png", "bqfh35.png", "bqfh36.png", "bqfh37.png", "bqfh38.png", "bqfh39.png", "bqfh40.png", "bqfh41.png", "bqfh42.png", "bqfh43.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh47.png", "bqfh48.png", "bqfh49.png", "bqfh50.png", "bqfh123.png", "bqfh124.png", "bqfh125.png", "bqfh126.png", "bqfh127.png", "bqfh128.png", "bqfh129.png", "bqfh130.png", "bqfh131.png", "bqfh132.png", "bqfh133.png", "bqfh134.png", "bqfh135.png", "bqfh136.png", "bqfh137.png", "bqfh138.png",
    //             "bqfh139.png",
    //             "bqfh140.png",
    //             "bqfh141.png",
    //             "bqfh142.png",
    //             "bqfh143.png",
    //             "bqfh144.png",
    //             "bqfh145.png",
    //             "bqfh146.png",
    //             "bqfh147.png",
    //             "bqfh148.png",
    //             "bqfh149.png",
    //             "bqfh150.png",
    //             "bqfh151.png",
    //             "bqfh152.png",
    //             "bqfh153.png",
    //             "bqfh154.png",
    //             "bqfh155.png",
    //             "bqfh156.png",
    //             "bqfh157.png",
    //             "bqfh158.png",
    //             "bqfh159.png",
    //             "bqfh160.png",
    //             "bqfh161.png",
    //             "bqfh162.png",
    //             "bqfh163.png",
    //             "bqfh164.png",
    //             "bqfh165.png",
    //             "bqfh166.png",
    //             "bqfh167.png",
    //             "bqfh168.png",
    //             "bqfh169.png",
    //             "bqfh170.png",
    //             "bqfh171.png",
    //             "bqfh172.png",
    //             "bqfh173.png",
    //             "bqfh174.png",
    //             "bqfh175.png",
    //             "bqfh176.png",
    //             "bqfh177.png",
    //             "bqfh178.png",
    //             "bqfh179.png",
    //             "bqfh180.png",
    //             "bqfh181.png",
    //             "bqfh182.png",
    //             "bqfh183.png",
    //             "bqfh184.png",
    //             "bqfh185.png",
    //             "bqfh186.png",
    //             "bqfh187.png",
    //             "bqfh188.png",
    //             "bqfh189.png",
    //             "bqfh190.png",
    //             "bqfh191.png",
    //             "bqfh192.png",
    //             "bqfh193.png",
    //             "bqfh194.png",
    //             "bqfh195.png",
    //             "bqfh196.png",
    //             "bqfh197.png",
    //             "bqfh198.png",
    //             "bqfh199.png",
    //             "bqfh200.png",
    //             "bqfh201.png",
    //     ],
    //     alias: ["🚻", "🚹", "🚺", "🚼", "🚰", "🚮", "♿", "🚭", "🛂", "🛄", "🛅", "🛃", "🚫", "🔞", "🚯", "🚱", "🚳", "🚷", "🚸", "⛔", "✳", "❇", "❎", "✅", "✴", "💟", "📳", "📴", "💠", "➿", "♻", "⛎", "0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", "⬆", "⬇", "⬅", "➡", "🔣", "🔢", "🔠", "🔡", "🔤", "↗", "↖", "↘", "↙", "↔", "↕", "🔄", "◀", "▶", "🔼", "🔽", "↩", "↪", "ℹ", "⏪", "⏫", "⏬", "⤵", "⤴", "🆗", "🔀", "🔁", "🔂", "🆕", "🆙", "🆒", "🆓", "🆖", "📶", "🎦", "🈁", "🔯", "🏧", "💹", "💲", "💱", "™", "❌", "‼", "⁉", "❗", "❓", "❕", "❔", "⭕", "🔝", "🔚", "🔙", "🔛", "🔜", "🔃", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕡", "🕢", "🕤", "🕥", "🕦", "➕", "➖", "➗", "♠", "♥", "♣", "♦", "💮", "💯", "✔", "☑", "🔘", "🔗", "➰", "〰", "〽", "🔱", "◼", "◻", "◾", "◽", "▪", "▫", "🔺", "🔲", "🔳", "⚫", "⚪", "🔴", "🔵", "🔻", "🔶", "🔷", "🔸", "🔹", "✖", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ]
    // },
    // RVtraffic: {
    //     name: "房车交通",
    //     path: "../emoji/12/",
    //     imgName: ["bqfh0.png", "bqfh1.png", "bqfh2.png", "bqfh3.png", "bqfh4.png", "bqfh5.png", "bqfh6.png", "bqfh7.png", "bqfh8.png", "bqfh9.png", "bqfh10.png", "bqfh11.png", "bqfh12.png", "bqfh13.png", "bqfh14.png", "bqfh15.png", "bqfh16.png", "bqfh17.png", "bqfh18.png", "bqfh19.png", "bqfh20.png", "bqfh21.png", "bqfh22.png", "bqfh23.png", "bqfh24.png", "bqfh25.png", "bqfh26.png", "bqfh27.png", "bqfh28.png", "bqfh29.png", "bqfh30.png", "bqfh31.png", "bqfh32.png", "bqfh33.png", "bqfh34.png", "bqfh35.png", "bqfh36.png", "bqfh37.png", "bqfh38.png", "bqfh39.png", "bqfh40.png", "bqfh41.png", "bqfh42.png", "bqfh43.png", "bqfh44.png", "bqfh45.png", "bqfh46.png", "bqfh47.png", "bqfh48.png", "bqfh49.png", "bqfh50.png", "bqfh51.png", "bqfh52.png", "bqfh53.png", "bqfh54.png", "bqfh55.png", "bqfh56.png", "bqfh57.png", "bqfh58.png", "bqfh59.png", "bqfh60.png", "bqfh61.png", "bqfh62.png", "bqfh63.png", "bqfh64.png", "bqfh65.png", "bqfh66.png", "bqfh67.png", "bqfh68.png", "bqfh69.png", "bqfh70.png", "bqfh71.png", "bqfh72.png", "bqfh73.png", "bqfh74.png", "bqfh75.png", "bqfh76.png", "bqfh77.png", "bqfh78.png", "bqfh79.png", "bqfh80.png", "bqfh81.png", "bqfh82.png"],
    //     alias: ["🏠", "🏡", "🏫", "🏢", "🏣", "🏥", "🏦", "🏪", "🏩", "🏨", "💒", "⛪", "🏬", "🏤", "🌇", "🌆", "🏯", "🏰", "⛺", "🏭", "🗼", "🗾", "🗻", "🌄", "🚢", "⛵", "🚤", "🚣", "⚓", "🚀", "✈", "💺", "🚁", "🚂", "🚊", "🚉", "🚞", "🚆", "🚄", "🚅", "🚈", "🚇", "🚝", "🚋", "🚃", "🚎", "🚌", "🚍", "🚙", "🚘", "🚗", "🚕", "🚖", "🚛", "🚚", "🚨", "🚓", "🚔", "🚒", "🚑", "🚐", "🚲", "🚡", "🚟", "🚠", "🚜", "💈", "🚏", "🎫", "🚦", "🚥", "⚠", "🚧", "🔰", "⛽", "🏮", "🎰", "♨", "🗿", "🎪", "🎭", "📍", "🚩", ],
    //     title: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ],
    // }
};