(function($) {
    $.fn.extend({
        wybExcel: function(options) {
            var op = $.extend({},
                options);
            return this.each(function() {
                var t = $(this);
                t.addClass("wyb-excel-table");
                if (op.data) {
                    initTable(t, {
                        data: op.data,
                        type: 0
                    })
                } else {
                    initTable(t, {
                        row: 11,
                        col: 11,
                        width: 0,
                        type: 1
                    })
                }
            })
        },
        getExcelHtml: function() {
            var table = $(this).find("table").first();
            if (table.length == 1) {
                var clone = table.clone(false);
                clone.find("tr:eq(0)").remove();
                clone.find("tr").find("td:eq(0)").remove();
                clone.find("td").removeClass("td-position-css").removeClass("td-chosen-css").removeClass("td-chosen-muli-css").removeAttr("contenteditable");
                clone.find("td[class='']").removeAttr("class");
                return clone.prop("outerHTML")
            } else {
                return ""
            }
        },
        setExcelHtml: function(html) {
            $(this).wybExcel({
                data: html
            })
        }
    });
    function initTable(t, setting) {
        t.empty();
        var table;
        if (setting.type == 0) {
            t.html(setting.data);
            table = t.find("table").first();
            var fir = table.find("tr:eq(0)");
            var clone = fir.clone(false).height(37).insertBefore(fir);
            clone.find("td").css("display", "").removeAttr("rowspan").removeAttr("colspan").html("").removeClass("td-chosen-css");
            $("<td></td>").width(50).insertBefore(table.find("tr").find("td:eq(0)"))
        } else if (setting.type == 1) {
            table = $("<table width='100%'></table>").appendTo(t);
            if (setting.width && setting.width > 0) {
                table.width(setting.width)
            }
            for (var i = 0; i < setting.row; i++) {
                var tr = $("<tr></tr>").appendTo(table);
                for (var j = 0; j < setting.col; j++) {
                    $("<td></td>").appendTo(tr)
                }
            }
        }
        drawDrugArea(table);
        eventBind(table, t);
        drugCell(table, t);
        t.unbind("contextmenu");
        t.on('contextmenu',
            function() {
                return false
            })
    }
    function eventBind(table, t) {
        table.mousedown(function(e) {
            if (e.button != 2) {
                if (!$(e.target).hasClass("drug-ele-td")) {
                    table.find("td").removeClass("td-chosen-css");
                    table.removeData("beg-td-ele");
                    table.data("beg-td-ele", $(e.target))
                }
            }
        }).mouseup(function(e) {
            if (e.button == 2 && !$(e.target).hasClass("drug-ele-td")) {
                if (table.find(".td-chosen-css").length == 0) {
                    $(e.target).addClass("td-chosen-css")
                }
                showRightPanel(table, t, e)
            } else {
                closeRightPanel(t);
                var ele = $(e.target);
                if (!ele.hasClass("drug-ele-td")) {
                    if (!ele.is("table") && table.data("beg-td-ele") && table.data("beg-td-ele").is(ele)) {
                        ele.addClass("td-chosen-css");
                        table.find("td").removeAttr("contenteditable");
                        if (t.data("contentChange") && t.data("contentChange") == "yes") {
                            drugCell(table, t);
                            t.removeData("contentChange")
                        }
                        if (ele.attr("readonly") == undefined) {
                            ele.attr("contenteditable", true);
                            if (window.getSelection) {
                                ele[0].focus();
                                var range = window.getSelection();
                                if (range.focusOffset == 0) {
                                    range.selectAllChildren(ele[0]);
                                    range.collapseToEnd()
                                }
                            } else if (document.selection) {
                                var range = document.selection.createRange();
                                range.moveToElementText(obj);
                                range.collapse(false);
                                range.select()
                            }
                        }
                        clearPositionCss(table);
                        var posi = getTdPosition(ele);
                        table.find("tr").find("td:eq(" + posi.col + ")").addClass("td-position-css");
                        table.find("tr:eq(" + posi.row + ")").find("td").addClass("td-position-css")
                    } else {
                        clearPositionCss(table);
                        getChosenList(table, getTdPosition(table.data("beg-td-ele")), getTdPosition(ele))
                    }
                    drawChosenArea(table, t)
                }
            }
        });
        $(document).unbind("keydown");
        $(document).keydown(function(e) {
            if (e.ctrlKey && e.keyCode == 90) {
                chexiaoFunc(t)
            }
        });
        table.find("td").keyup(function() {
            t.data("contentChange", "yes")
        })
    }
    function getChosenList(table, begPosi, endPosi) {
        if (begPosi != undefined && endPosi != undefined) {
            var coll = [];
            for (var i = (begPosi.row > endPosi.row ? endPosi.row: begPosi.row); i <= (begPosi.row > endPosi.row ? begPosi.row: endPosi.row); i++) {
                var tr = table.find("tr:eq(" + i + ")");
                for (var j = (begPosi.col > endPosi.col ? endPosi.col: begPosi.col); j <= (begPosi.col > endPosi.col ? begPosi.col: endPosi.col); j++) {
                    var td = tr.find("td:eq(" + j + ")");
                    td.addClass("td-chosen-css");
                    coll[coll.length] = td
                }
            }
            var coll = table.find(".td-chosen-css");
            var firstPosi = getTdPosition($(coll.get(0)));
            var beg_row = firstPosi.row;
            var beg_col = firstPosi.col;
            table.find("td").removeData("add-chosen-state").removeData("get-father-state");
            while (true) {
                var end_row = 0;
                var end_col = 0;
                var con = false;
                coll.each(function() {
                    var p = getTdPosition($(this));
                    var r = p.row + ($(this).attr("rowspan") == undefined ? 0 : (Number($(this).attr("rowspan")) - 1));
                    var c = p.col + ($(this).attr("colspan") == undefined ? 0 : (Number($(this).attr("colspan")) - 1));
                    end_row = end_row < r ? r: end_row;
                    end_col = end_col < c ? c: end_col;
                    beg_row = beg_row > p.row ? p.row: beg_row;
                    beg_col = beg_col > p.col ? p.col: beg_col
                });
                for (var i = beg_row; i <= end_row; i++) {
                    var tr = table.find("tr:eq(" + i + ")");
                    for (var j = beg_col; j <= end_col; j++) {
                        var dt = tr.find("td:eq(" + j + ")");
                        if (dt.is(":hidden") && dt.data("get-father-state") == undefined) {
                            var p = getFatherCell(dt);
                            dt.data("get-father-state", 0);
                            if (p != null && p.length == 1) {
                                p.data("add-chosen-state", 0);
                                if (p != null && coll.index(p) == -1) {
                                    p.addClass("td-chosen-css");
                                    coll = table.find(".td-chosen-css");
                                    con = true
                                }
                            }
                        } else {
                            if (!dt.hasClass("td-chosen-css")) {
                                dt.addClass("td-chosen-css");
                                coll = table.find(".td-chosen-css");
                                con = true
                            }
                        }
                    }
                }
                if (!con) {
                    break
                }
            }
            return coll
        }
    }
    function getTdPosition(td) {
        if (td != undefined && td.length == 1) {
            var table = td.closest("table");
            var pos = {};
            var tr = td.closest("tr");
            pos.row = table.find("tr").index(tr);
            pos.col = tr.find("td").index(td);
            return pos
        }
    }
    function getTdCell(table, row, col) {
        return table.find("tr:eq(" + row + ")").find("td:eq(" + col + ")")
    }
    function mergeCell(table) {
        if (table.length == 1) {
            var coll = table.find(".td-chosen-css");
            if (coll.length > 1) {
                var fir = $(coll.get(0));
                var posi = getTdPosition(fir);
                var r = 0,
                    c = 0;
                if (fir.attr("rowspan") != undefined && fir.attr("colspan") != undefined) {
                    r = Number(fir.attr("rowspan")) - 1;
                    c = Number(fir.attr("colspan")) - 1
                }
                coll.each(function() {
                    var p = getTdPosition($(this));
                    r = (p.row - posi.row) > r ? p.row - posi.row: r;
                    c = (p.col - posi.col) > c ? (p.col - posi.col) : c;
                    if (!$(this).is(fir)) {
                        $(this).removeClass("td-chosen-css").css("display", "none");
                        if ($(this).attr("rowspan") != undefined && $(this).attr("colspan") != undefined) {
                            r = (p.row + (Number($(this).attr("rowspan")) - 1) - posi.row) > r ? (p.row + (Number($(this).attr("rowspan")) - 1) - posi.row) : r;
                            c = (p.col + (Number($(this).attr("colspan")) - 1) - posi.col) > c ? (p.col + (Number($(this).attr("colspan")) - 1) - posi.col) : c
                        }
                    }
                });
                $(coll.get(0)).attr("rowspan", r + 1).attr("colspan", c + 1).css("display", "")
            } else if (coll.length == 1) {
                var fir = $(coll.get(0));
                if (fir.attr("rowspan") != undefined && fir.attr("colspan") != undefined) {
                    var posi = getTdPosition(fir);
                    for (var i = posi.row; i <= (posi.row + (Number($(fir).attr("rowspan")) - 1)); i++) {
                        var tr = table.find("tr:eq(" + i + ")");
                        for (var j = posi.col; j <= (posi.col + (Number($(fir).attr("colspan")) - 1)); j++) {
                            var td = tr.find("td:eq(" + j + ")").css("display", "");
                            if (!td.is(fir)) {
                                td.removeAttr("rowspan").removeAttr("colspan")
                            }
                        }
                    }
                    fir.removeAttr("rowspan").removeAttr("colspan")
                }
            }
        }
    }
    function getFatherCell(noneTd) {
        var table = noneTd.closest("table");
        var p = getTdPosition(noneTd);
        var fatherCell = [];
        table.find("td[rowspan][colspan]").each(function() {
            var posi = getTdPosition($(this));
            var cell = $(this);
            var coll = [];
            var con = false;
            for (var i = posi.row; i <= (posi.row + (Number($(this).attr("rowspan")) - 1)); i++) {
                var tr = table.find("tr:eq(" + i + ")");
                for (var j = posi.col; j <= (posi.col + (Number($(this).attr("colspan")) - 1)); j++) {
                    var dt = tr.find("td:eq(" + j + ")");
                    if (noneTd.is(dt)) {
                        fatherCell[fatherCell.length] = cell;
                        con = true;
                        break
                    }
                }
                if (con) {
                    break
                }
            }
        });
        if (fatherCell.length == 1) {
            return fatherCell[0]
        } else {
            return null
        }
    }
    function drugCell(table, t) {
        t.find(".col-width-panel,.row-height-panel").remove();
        t.find(".chosen-area-p").remove();
        var colWidthPanel = $("<div class='col-width-panel'></div>");
        var rowHeightPanel = $("<div class='row-height-panel'></div>");
        var left = 0,
            top = 0;
        var firstTr = table.find("tr").first();
        table.find("td").removeAttr("contenteditable");
        colWidthPanel.insertBefore(table);
        rowHeightPanel.insertBefore(table);
        table.find("td").each(function() {
            $(this).width($(this).width())
        });
        table.find("tr").first().find("td").each(function() {
            left += this.offsetWidth;
            var inds = $(this).closest("tr").find("td").index($(this));
            $("<div class='col-width-panel-item'></div>").attr("draggable", true).mousedown(function(e) {
                e.preventDefault && e.preventDefault();
                var ele = $(e.target);
                if (ele.data("left") == undefined) {
                    recordData(t);
                    ele.data("left", ele.css("left"));
                    ele.data("e-left", e.clientX);
                    t.data("drug-ele", ele)
                }
            }).mouseup(function() {
                clearDurgEle(table, t)
            }).css("left", left - 4).css("height", firstTr[0].offsetHeight).appendTo(colWidthPanel)
        });
        table.find("tr").each(function() {
            top += this.offsetHeight;
            var wdd = $(this).height();
            $(this).height($(this).height());
            $("<div class='row-height-panel-item'></div>").attr("draggable", true).mousedown(function(e) {
                e.preventDefault && e.preventDefault();
                var ele = $(e.target);
                if (ele.data("top") == undefined) {
                    recordData(t);
                    ele.data("top", ele.css("top"));
                    ele.data("e-top", e.clientY);
                    t.data("drug-ele", ele)
                }
            }).mouseup(function() {
                clearDurgEle(table, t)
            }).css("top", top - 4).css("width", firstTr.find("td")[0].offsetWidth).appendTo(rowHeightPanel)
        });
        colWidthPanel.find(".col-width-panel-item:first,.col-width-panel-item:last").css("display", "none");
        rowHeightPanel.find(".row-height-panel-item:first,.row-height-panel-item:last").css("display", "none");
        t.unbind("mouseup").unbind("mousemove");
        t.mouseup(function(e) {
            clearDurgEle(table, t)
        }).mousemove(function(e) {
            if (t.data("drug-ele") != undefined) {
                closeRightPanel(t);
                var ele = t.data("drug-ele");
                if (ele.hasClass("col-width-panel-item") && ele.data("left") != undefined) {
                    var left = parseInt(ele.data("left")) + (e.clientX - ele.data("e-left"));
                    var ind = colWidthPanel.find(".col-width-panel-item").index(ele);
                    var upLeft = 0;
                    if (ind > 0) {
                        upLeft = parseInt(ele.prev(".col-width-panel-item").css("left")) + 4
                    }
                    var nextLeft = table.width();
                    if (ind < colWidthPanel.find(".col-width-panel-item").length - 1) {
                        nextLeft = parseInt(ele.next(".col-width-panel-item").css("left")) + 4
                    }
                    if (left - upLeft > 30 && nextLeft - left > 30) {
                        var now = table.find("tr").find("td:eq(" + ind + ")");
                        var next = table.find("tr").find("td:eq(" + (ind + 1) + ")");
                        now.width(left - upLeft);
                        next.width(nextLeft - left);
                        ele.css("left", left)
                    }
                }
                if (ele.hasClass("row-height-panel-item") && ele.data("top") != undefined) {
                    var top = parseInt(ele.data("top")) + (e.clientY - ele.data("e-top"));
                    var ind = rowHeightPanel.find(".row-height-panel-item").index(ele);
                    var upTop = 0;
                    if (ind > 0) {
                        upTop = parseInt(ele.prev(".row-height-panel-item").css("top")) + 4
                    }
                    if (top - upTop > 5) {
                        var now = table.find("tr:eq(" + ind + ")");
                        now.height(top - upTop);
                        ele.css("top", top)
                    }
                }
            }
        })
    }
    function clearDurgEle(table, t) {
        if (t.data("drug-ele") != undefined) {
            t.data("drug-ele").removeData("left").removeData("e-left").removeData("top").removeData("e-top");
            t.removeData("drug-ele");
            drugCell(table, t)
        }
    }
    function addRowCol(table, type, t) {
        var chosenColl = table.find(".td-chosen-css");
        if (chosenColl.length == 1) {
            var chosen = chosenColl.first();
            var tr = chosen.closest("tr");
            var col = table.find("tr").find("td:eq(" + (tr.find("td").index(chosen)) + ")");
            if (type == 0) {
                addRowColSpan(tr, type).insertBefore(tr)
            } else if (type == 1) {
                addRowColSpan(tr, type).insertAfter(tr)
            } else if (type == 4) {
                addRowColSpan(tr, type);
                tr.remove()
            } else if (type == 2) {
                addRowColSpan(col, type)
            } else if (type == 3) {
                addRowColSpan(col, type)
            } else if (type == 5) {
                addRowColSpan(col, type);
                col.remove()
            }
        }
        table.find("td[rowspan=1][colspan=1]").removeAttr("rowspan").removeAttr("colspan");
        t.find(".chosen-area-p").remove();
        clearDurgEle(table, t);
        drawDrugArea(table)
    }
    function addRowColSpan(list, ty) {
        var coll = [];
        if (ty == 0 || ty == 1 || ty == 4) {
            var tr = list;
            tr.find("td").each(function() {
                if ($(this).is(":hidden")) {
                    var p = getFatherCell($(this));
                    var con = true;
                    for (var i = 0; i < coll.length; i++) {
                        if (coll[i].is(p)) {
                            con = false;
                            break
                        }
                    }
                    if (con && p != null) {
                        coll[coll.length] = p;
                        p.attr("rowspan", spanNum(p.attr("rowspan"), ty == 4 ? -1 : 1))
                    }
                } else {
                    if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                        coll[coll.length] = $(this);
                        if (ty == 4) {
                            var nextTr = tr.next("tr");
                            if (nextTr.length == 1 && Number($(this).attr("rowspan")) > 1) {
                                var ind = tr.find("td").index($(this));
                                nextTr.find("td:eq(" + ind + ")").attr("rowspan", spanNum($(this).attr("rowspan"), -1)).attr("colspan", $(this).attr("colspan")).css("display", "")
                            }
                        } else {
                            $(this).attr("rowspan", Number($(this).attr("rowspan")) + 1)
                        }
                    }
                }
            });
            var clone = tr.clone(true);
            if (ty == 0) {
                tr.find("td[rowspan][colspan]").each(function() {
                    $(this).removeAttr("rowspan").removeAttr("colspan").css("display", "none")
                })
            }
            if (ty == 1) {
                clone.find("td[rowspan][colspan]").each(function() {
                    $(this).removeAttr("rowspan").removeAttr("colspan").css("display", "none")
                })
            }
            clone.height(30);
            clone.find("td").removeClass("td-chosen-css").html("");
            return clone
        } else {
            var cloneLs = [];
            list.each(function() {
                if ($(this).is(":hidden")) {
                    var p = getFatherCell($(this));
                    var con = true;
                    for (var i = 0; i < coll.length; i++) {
                        if (coll[i].is(p)) {
                            con = false;
                            break
                        }
                    }
                    if (con && p != null) {
                        coll[coll.length] = p;
                        p.attr("colspan", spanNum(p.attr("colspan"), ty == 5 ? -1 : 1))
                    }
                } else {
                    if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                        coll[coll.length] = $(this);
                        if (ty == 5) {
                            var nextTd = $(this).next("td");
                            if (nextTd.length == 1 && Number($(this).attr("colspan")) > 1) {
                                nextTd.width($(this).width()).attr("rowspan", $(this).attr("rowspan")).attr("colspan", spanNum($(this).attr("colspan"), -1)).css("display", "")
                            }
                        } else {
                            $(this).attr("colspan", Number($(this).attr("colspan")) + 1)
                        }
                    }
                }
                var clone = $(this).clone(true);
                clone.width($(this).width());
                clone.removeClass("td-chosen-css").html("");
                cloneLs[cloneLs.length] = clone
            });
            for (var i = 0; i < cloneLs.length; i++) {
                if (ty == 2) {
                    cloneLs[i].insertBefore($(list.get(i)));
                    var t = $(list.get(i));
                    if (t.attr("rowspan") && t.attr("colspan")) {
                        t.removeAttr("rowspan").removeAttr("colspan").css("display", "none")
                    }
                }
                if (ty == 3) {
                    cloneLs[i].insertAfter($(list.get(i)));
                    var t = cloneLs[i];
                    if (t.attr("rowspan") && t.attr("colspan")) {
                        t.removeAttr("rowspan").removeAttr("colspan").css("display", "none")
                    }
                }
            }
        }
    }
    function spanNum(spanNum, n) {
        var num = Number(spanNum) + n;
        num = num < 1 ? 1 : num;
        return num
    }
    function drawChosenArea(table, t) {
        var coll = table.find(".td-chosen-css");
        table.find("td").removeClass("td-chosen-muli-css");
        if (coll.length > 0) {
            var first = coll.first();
            var posi = getTdPosition(first);
            var width = 0,
                height = 0;
            var p = table.parent();
            coll.each(function() {
                var p = getTdPosition($(this));
                if (p.row == posi.row) {
                    width += this.offsetWidth
                }
                if (p.col == posi.col) {
                    height += this.offsetHeight
                }
            });
            if (coll.length > 1) {
                coll.addClass("td-chosen-muli-css");
                if (p.find(".chosen-area-p-drug").length == 1) {
                    var con = false;
                    var fir = coll.first();
                    if (p.find(".chosen-area-p-drug").data("text") != undefined) {
                        recordData(t);
                        coll.html(p.find(".chosen-area-p-drug").data("text"));
                        p.find(".chosen-area-p-drug").removeData("text");
                        con = true
                    }
                    if (p.find(".chosen-area-p-drug").data("textNum") != undefined) {
                        recordData(t);
                        var n = p.find(".chosen-area-p-drug").data("textNum");
                        var v = Number($.trim(fir.text()));
                        coll.each(function() {
                            $(this).html(v);
                            v += n
                        });
                        p.find(".chosen-area-p-drug").removeData("textNum");
                        con = true
                    }
                    if (con) {
                        if (fir.attr("valign") && fir.attr("valign") != "") {
                            coll.attr("valign", fir.attr("valign"))
                        }
                        if (fir.css("text-align") && fir.css("text-align") != "") {
                            coll.css("text-align", fir.css("text-align"))
                        }
                    }
                }
            }
            p.find(".chosen-area-p").remove();
            $("<div class='chosen-area-p'></div>").width(1).height(height + 1).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
            $("<div class='chosen-area-p'></div>").width(width + 1).height(1).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
            $("<div class='chosen-area-p'></div>").width(1).height(height - 4).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft + width - 1).insertBefore(table);
            $("<div class='chosen-area-p'></div>").width(width - 4).height(1).css("margin-top", first[0].offsetTop + height - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
            $("<div class='chosen-area-p chosen-area-p-drug'></div>").mousedown(function() {
                if (coll.length == 1) {
                    $(this).data("text", $.trim(coll.first().text()))
                }
                if (coll.length == 2) {
                    var reg = /^\d{1,9}$/;
                    if (reg.test($.trim(coll.first().text())) && reg.test($.trim($(coll.get(1)).text()))) {
                        $(this).data("textNum", Number($.trim($(coll.get(1)).text())) - Number($.trim(coll.first().text())))
                    }
                }
            }).width(3).height(3).css("padding", "2px").css("margin-top", first[0].offsetTop + height - 3).css("margin-left", first[0].offsetLeft + width - 3).insertBefore(table)
        }
    }
    function drawDrugArea(table) {
        var ind = 0;
        table.find("tr").first().find("td:gt(0)").unbind("click");
        table.find("tr").find("td:eq(0)").unbind("click");
        table.find("tr").first().find("td:gt(0)").each(function() {
            var char = String.fromCharCode(65 + ind);
            if (ind >= 26) {
                char = String.fromCharCode(65 + (parseInt(ind / 26) - 1)) + String.fromCharCode(65 + ind % 26)
            }
            $(this).addClass("drug-ele-td").css("text-align", "center").html(char);
            ind++
        });
        ind = 0;
        table.find("tr").find("td:eq(0)").each(function() {
            $(this).width(50).addClass("drug-ele-td").css("text-align", "center").html(ind == 0 ? "": ind);
            ind++
        });
    }
    function clearPositionCss(table) {
        table.find("td").removeClass("td-position-css")
    }
    function showRightPanel(table, t, e) {
        var coll = table.find(".td-chosen-css");
        closeRightPanel(t);
        var rightMousePanel = $("<div class='rightmouse-panel-div'></div>").css("left", e.clientX).css("top", e.clientY).insertBefore(table);
        var leftPanel = $("<div class='panel-div-left'></div>").width(200).appendTo(rightMousePanel);
        var rightPanel = $("<div class='panel-div-right'></div>").width(130).appendTo(rightMousePanel);
        $("<div class='wb duiqifangsi'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-th'></i></span><span class='excel-rightmomuse-text-css'>对齐方式</span><span class='excel-rightmomuse-icon-css excel-rightmomuse-icon-next-css'><i class='fa fa-caret-right'></i></span>").appendTo(leftPanel);
        $("<div class='wb hebingdanyuange'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-columns'></i></span><span class='excel-rightmomuse-text-css'>合并单元格</span>").appendTo(leftPanel);
        $("<div class='wb shangchayihang'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-up'></i></span><span class='excel-rightmomuse-text-css'>上方插入一行</span>").appendTo(leftPanel);
        $("<div class='wb xiachayihang'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-down'></i></span><span class='excel-rightmomuse-text-css'>下方插入一行</span>").appendTo(leftPanel);
        $("<div class='wb zuochayilie'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-left'></i></span><span class='excel-rightmomuse-text-css'>左边插入一列</span>").appendTo(leftPanel);
        $("<div class='wb youchayilie'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-right'></i></span><span class='excel-rightmomuse-text-css'>右边插入一列</span>").appendTo(leftPanel);
        $("<div class='wb shanchuhang'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-minus-square-o'></i></span><span class='excel-rightmomuse-text-css'>删除行</span>").appendTo(leftPanel);
        $("<div class='wb shanchulie'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-minus-square'></i></span><span class='excel-rightmomuse-text-css'>删除列</span>").appendTo(leftPanel);
        $("<div class='wb chexiao' title='只能结构改变撤销'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-reply-all'></i></span><span class='excel-rightmomuse-text-css'>撤销</span>").appendTo(leftPanel);
        $("<div class='wb juzhong'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-justify'></i></span><span class='excel-rightmomuse-text-css'>居中</span>").appendTo(rightPanel);
        $("<div class='wb zuoduiqi'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-left'></i></span><span class='excel-rightmomuse-text-css'>左对齐</span>").appendTo(rightPanel);
        $("<div class='wb youduiqi'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-right'></i></span><span class='excel-rightmomuse-text-css'>右对齐</span>").appendTo(rightPanel);
        $("<div class='wb chuizhijuzhong'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-navicon'></i></span><span class='excel-rightmomuse-text-css'>垂直居中</span>").appendTo(rightPanel);
        $("<div class='wb dingduanduiqi'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-double-up'></i></span><span class='excel-rightmomuse-text-css'>顶端对齐</span>").appendTo(rightPanel);
        $("<div class='wb dibuduiqi'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-double-down'></i></span><span class='excel-rightmomuse-text-css'>底部对齐</span>").appendTo(rightPanel);
        var setting = $("<div class='wb setting'></div>").html("<span class='setting-item'><span class='setting-text'>宽</span><span class='setting-input'><input type='text' name='width' title='为空,按百分比'/></span></span><span class='setting-item'><span class='setting-text'>行</span><span class='setting-input'><input type='text' name='row'/></span></span><span class='setting-item'><span class='setting-text'>列</span><span class='setting-input'><input type='text' name='col'/></span></span>").appendTo(leftPanel);
        leftPanel.mousemove(function(e) {
            var ele = $(e.target);
            if (ele.hasClass("duiqifangsi") || ele.closest(".duiqifangsi").length == 1) {
                rightPanel.css("display", "")
            } else {
                rightPanel.css("display", "none")
            }
        });
        setting.find("input").keyup(function(e) {
            if (e.keyCode == 13) {
                var width = $.trim(setting.find("input[name='width']").val());
                var row = $.trim(setting.find("input[name='row']").val());
                var col = $.trim(setting.find("input[name='col']").val());
                var reg = /^\d{1,4}$/;
                if (reg.test(row) && reg.test(col)) {
                    width = reg.test(width) ? width: 0;
                    initTable(t, {
                        row: Number(row) + 1,
                        col: Number(col) + 1,
                        width: width,
                        type: 1
                    })
                }
            }
        });
        rightMousePanel.find(".wb").click(function() {
            var obj = $(this);
            if (!obj.hasClass("duiqifangsi") && !obj.hasClass("setting")) {
                if (!obj.hasClass("chexiao")) {
                    recordData(t)
                }
                if (obj.hasClass("hebingdanyuange")) {
                    mergeCell(table)
                }
                if (obj.hasClass("shangchayihang")) {
                    addRowCol(table, 0, t)
                }
                if (obj.hasClass("xiachayihang")) {
                    addRowCol(table, 1, t)
                }
                if (obj.hasClass("zuochayilie")) {
                    addRowCol(table, 2, t)
                }
                if (obj.hasClass("youchayilie")) {
                    addRowCol(table, 3, t)
                }
                if (obj.hasClass("shanchuhang")) {
                    addRowCol(table, 4, t)
                }
                if (obj.hasClass("shanchulie")) {
                    addRowCol(table, 5, t)
                }
                if (obj.hasClass("chexiao")) {
                    chexiaoFunc(t)
                }
                if (obj.hasClass("juzhong")) {
                    coll.css("text-align", "center")
                }
                if (obj.hasClass("zuoduiqi")) {
                    coll.css("text-align", "left")
                }
                if (obj.hasClass("youduiqi")) {
                    coll.css("text-align", "right")
                }
                if (obj.hasClass("chuizhijuzhong")) {
                    coll.attr("valign", "middle")
                }
                if (obj.hasClass("dingduanduiqi")) {
                    coll.attr("valign", "top")
                }
                if (obj.hasClass("dibuduiqi")) {
                    coll.attr("valign", "bottom")
                }
                if (obj.hasClass("shangchayihang") || obj.hasClass("xiachayihang") || obj.hasClass("zuochayilie") || obj.hasClass("youchayilie") || obj.hasClass("shanchuhang") || obj.hasClass("shanchulie")) {
                    drugCell(table, t)
                }
                rightMousePanel.remove()
            }
        });
        if (! (t.data("record") != undefined && t.data("record").length > 0)) {
            leftPanel.find(".chexiao").remove()
        }
    }
    function chexiaoFunc(t) {
        if (t.data("record") != undefined) {
            var record = t.data("record");
            if (record.length > 0) {
                initTable(t, {
                    data: record[record.length - 1],
                    type: 0
                });
                record.splice(record.length - 1, 1)
            }
        }
    }
    function closeRightPanel(t) {
        t.find(".rightmouse-panel-div").remove()
    }
    function recordData(t) {
        var record = [];
        if (t.data("record") != undefined) {
            record = t.data("record")
        }
        record[record.length] = t.getExcelHtml();
        t.data("record", record)
    }
})(jQuery);