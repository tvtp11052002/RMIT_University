jQuery(function(c) {
    var r, p, h = {},
        d = void 0,
        a = void 0,
        f = 800,
        w = void 0,
        m = void 0,
        v = void 0,
        g = void 0,
        z = void 0,
        x = void 0,
        W = void 0,
        l = void 0,
        u = void 0,
        s = void 0,
        b = {},
        T = {
            northwest: "top",
            north: "top",
            northeast: "top",
            west: "left",
            east: "right",
            southwest: "bottom",
            south: "bottom",
            southeast: "bottom"
        },
        y = {
            callout: "north",
            autohide: !0,
            mousetrack: !1,
            mouseEnter: !1,
            showShortcutKey: !0,
            contentType: "text",
            positionAlterable: !0,
            calloutHideMode: !1
        };

    function n(t) {
        this._windowEle = c(window), this._windowWidth = this._windowEle.width();
        var n = this;
        this._windowEle.on("resize." + this.widgetName, function(t) {
            n._windowWidth = n._windowEle.width()
        }), this._documentEle = c(document), this._documentEle.on("keydown." + this.widgetName, function(t) {
            27 == t.keyCode && F(t)
        }), c(t).on("buttondisabled", function(t, o) {
            var e = c(o.element),
                i = e.attr("title");
            o.disabled ? (e.removeAttr("title"), e.data("ztooltip", i)) : e.attr("title", e.data("ztooltip"))
        }), c(t).on("mouseover mouseup", function(t) {
            var o = function(t, o) {
                    var e = "[" + o + "]";
                    try {
                        t = t.is(e) ? t : c(t.parents(e).get(0))
                    } catch (t) {}
                    return t
                }(c(t.target), "title"),
                e = o.attr("title");
            if (e && o.length && "document" !== o[0].nodeName.toLowerCase()) {
                if (a && clearTimeout(a), t.stopPropagation(), t.preventDefault(), o.attr("disabled") || o.hasClass("ui-state-disabled") || o.hasClass("ui-ztooltip-ignore")) return E(o), F(), !1;
                E(o), h = c.extend({}, y, function(t, o) {
                    try {
                        var e = c.parseJSON(o);
                        return e.componentOptions ? e.componentOptions : e = {
                            content: o
                        }
                    } catch (t) {
                        return eleOptions = {
                            content: o
                        }, eleOptions
                    }
                }(0, e));
                var i = o.attr("callout");
                void 0 !== i && "" !== T[i] && (h.callout = i), c(w).length && c(w).find(".ui-ztooltip-close").remove(), f = 800,
                    function(o, e) {
                        var i = "html" == h.contentType;
                        !0 !== h.mouseEnter && !0 !== h.mousetrack || (h.callout = "northwest");
                        var n = function(t) {
                            var o = !!w,
                                e = "ui-corner-all",
                                i = h.ajaxContent ? "ui-ztooltip-ajaxcontent " : h.autohide ? "ui-ztooltip-content " : "ui-ztooltip-contentwithclose ";
                            if (o) f = 0;
                            else {
                                w = c("<div>").attr("class", "ui-ztooltip ui-widget"), x = void 0;
                                var n = c("<div>").attr("class", "ui-ztooltip-overlaydiv ui-corner-all");
                                g = c("<div>").attr("class", "ui-ztooltip-header ui-corner-top"), z = c("<div>").attr({
                                    class: i + e,
                                    id: "ui-ztooltip-content"
                                }), W = c("<span>").attr("class", "ui-ztooltip-img " + h.iconclass).appendTo(n), g.appendTo(n), z.appendTo(n), n.appendTo(w), c("body").append(w)
                            }
                            g.css("display", ""), W.css("display", ""), h.iconclass && W.css({
                                display: "inline-block"
                            });
                            h.title && (g.text(h.title), e = "ui-corner-bottom", g.css({
                                display: "inline-block"
                            }));
                            if (!h.autohide) {
                                var a = c("<span>").attr("class", "ui-ztooltip-close ui-icon ui-components-icon").on("click", function(t) {
                                    c(m).off("mousemove"), F(t), c(m).attr("title", v)
                                });
                                a.appendTo(w), c(m).attr("noAutoHide", !0)
                            }
                            if (z.attr("class", i + " " + e), !h.ajaxContent) {
                                p = h.content;
                                var l = "html" == h.contentType;
                                if (l && h.isContentElementId) {
                                    var u = c("<div>").append(c("#" + h.content).show());
                                    p = u.html()
                                }
                                if (b && c.ui && c.ui.shortcutkeys && b.showShortcutKey) {
                                    t = t.is("label.ui-button") ? t.prev("input") : t;
                                    var s = c(document).shortcutkeys("getShortcutKey", t);
                                    s && (p = p + " (" + s + ")")
                                }
                            }
                            d && d.remove();
                            d = w.clone(), c("body").append(d);
                            var l = "html" == h.contentType;
                            d.removeAttr("style").hide(), d.find("#ui-ztooltip-content").removeAttr("style"), d.find("#ui-ztooltip-content")[l ? "html" : "text"](p), h.callout && !h.ajaxContent ? (x || (x = c("<div>").attr("class", "ui-ztooltip-callout").appendTo(w)), r = H(h.callout, x)) : x = void 0;
                            return w
                        }(e);
                        if (n) {
                            var a = void 0;
                            o.originalEvent ? a = h.callout && !h.ajaxContent ? k(o) : {
                                left: o.pageX + 10,
                                top: o.pageY + 10
                            } : ((a = e.offset()).left += e.width(), a.top += e.height()), a = _(a, e, d), clearTimeout(l), clearTimeout(u), l = setTimeout(function() {
                                if (e.is(":visible") || e.is("option")) {
                                    if (h.ajaxContent) {
                                        var t = c("<div>").attr("class", "ui-ztooltip-content-loading");
                                        c(w).find(".ui-ztooltip-ajaxcontent").append(t), u = setTimeout(function() {
                                            c.ajax({
                                                type: "GET",
                                                url: h.ajaxContent,
                                                data: "",
                                                success: function(t) {
                                                    c(w).find(".ui-ztooltip-ajaxcontent").html(t)
                                                },
                                                error: function() {
                                                    c(w).find(".ui-ztooltip-ajaxcontent").empty()
                                                }
                                            })
                                        })
                                    }
                                    h.timeout && h.autohide && (s = setTimeout(function() {
                                        F(o)
                                    }, parseInt(h.timeout))), n.show(1, function() {
                                        z[i ? "html" : "text"](p), x.css(r), (a = O(o, n, a, e)) && n.css(a), h.calloutHideMode && w.find(".ui-ztooltip-callout").hide()
                                    })
                                }
                            }, f)
                        }
                    }(t, o), v = e, (m = o).on("click.ztooltip", function(t) {
                        F()
                    }), o.off("mouseout.ztooltip").on("mouseout.ztooltip", function(t) {
                        h.timeout && clearTimeout(s), a && clearTimeout(a), a = setTimeout(function() {
                            h.autohide && (o.unbind("mousemove"), F(t))
                        }, 200), E(o, !0)
                    }), n._documentEle.off("mousedown.ztooltip").on("mousedown.ztooltip", function(t) {
                        h.autohide && (o.unbind("mousemove"), F(t)), E(o, !0)
                    }), h.mousetrack && o.off("mousemove.ztooltip").on("mousemove.ztooltip", function(t) {
                        ! function(t, o) {
                            var e = c(w),
                                i = (e.width(), e.height(), h.callout && !h.ajaxContent ? k(t) : {
                                    left: t.pageX + 5,
                                    top: t.pageY + 5
                                });
                            i = O(t, w, i, o), e.width() + parseInt(i.left) > this._windowWidth && e.width(this._windowWidth - (parseInt(i.left) + 50));
                            e.css(i)
                        }(t, o)
                    })
            }
        })
    }

    function E(t, n) {
        var o = n ? t.data("parents") : t.parents("[title]");
        n ? t.data("parents", void 0) : (o.push(t), t.data("parents", o)), o && c.each(o, function(t, o) {
            var e = "",
                i = (o = c(o)).attr("title");
            n ? e = i != o.data("title") && "" != i ? i : o.data("title") : o.data("title", i), o.attr("title", e)
        })
    }

    function _(t, o, e, i) {
        var n = h.callout ? h.callout : i,
            a = o.offset(),
            l = a.left,
            u = a.top;
        return o.is("option") && (l = o.parent("select").offset().left, u = o.parent("select").offset().top + o.offset.top), n && (-1 != n.indexOf("north") ? (h.mouseEnter || h.mousetrack || (t.left = "northwest" === n ? l : "northeast" === n ? l - (e.width() - o.outerWidth()) : l - 8 - (e.width() / 2 - 8) + o.outerWidth() / 2), t.top = u + o.outerHeight() + 9) : -1 != n.indexOf("south") ? (t.left = "southwest" === n ? l : "southeast" === n ? l - (e.width() - o.outerWidth()) : l - 8 - (e.width() / 2 - 8) + o.outerWidth() / 2, t.top = u - e.outerHeight() - 9) : "west" === n ? (t.left = parseInt(l + o.outerWidth() + 9), t.top = u - e.height() / 2 + o.outerHeight() / 2) : "east" === n && (t.left = parseInt(l - e.width() - 9), t.top = u - e.height() / 2 + o.outerHeight() / 2)), t
    }

    function H(t, o) {
        if (!w) return !1;
        var e = {};
        o.removeAttr("class").attr("class", "ui-ztooltip-callout ui-ztooltip-callout-" + T[t]);
        var i = o.outerWidth(),
            n = o.outerHeight(),
            a = d.width(),
            l = d.height();
        switch (t) {
            case "north":
                e = {
                    left: a / 2 - i / 2 + "px",
                    top: "-" + (n - 1) + "px"
                };
                break;
            case "west":
                e = {
                    left: "-" + (i - 1) + "px",
                    top: l / 2 - n / 2 + "px"
                };
                break;
            case "east":
                e = {
                    left: a - 1 + "px",
                    top: l / 2 - n / 2 + "px"
                };
                break;
            case "south":
                e = {
                    left: a / 2 - i / 2 + "px",
                    top: l - 1 + "px"
                };
                break;
            case "northeast":
                e = {
                    left: a - 2 * i + "px",
                    top: "-" + (n - 1) + "px"
                };
                break;
            case "northwest":
                e = {
                    left: i + "px",
                    top: "-" + (n - 1) + "px"
                };
                break;
            case "southwest":
                e = {
                    left: i + "px",
                    top: l - 1 + "px"
                };
                break;
            case "southeast":
                e = {
                    left: a - 2 * i + "px",
                    top: l - 1 + "px"
                };
                break;
            default:
                o.addClass("ui-ztooltip-callout-top"), e = {
                    left: i + "px",
                    top: "-" + (n - 1) + "px"
                }
        }
        return e
    }
    var i = {
        north: function(t) {
            return {
                left: t.pageX - t.tooltipWidth / 2,
                top: t.pageY + (t.calloutHeight + t._OFFSET)
            }
        },
        west: function(t) {
            return {
                left: t.pageX + (t.calloutWidth + t._OFFSET),
                top: t.pageY - t.tooltipHeight / 2
            }
        },
        east: function(t) {
            return {
                left: t.pageX - (t.calloutWidth + t._OFFSET) - t.tooltipWidth,
                top: t.pageY - t.tooltipHeight / 2
            }
        },
        south: function(t) {
            return {
                left: t.pageX - t.tooltipWidth / 2,
                top: t.pageY - (t.calloutHeight + t._OFFSET) - t.tooltipHeight
            }
        },
        northeast: function(t) {
            return {
                left: t.pageX - (t.tooltipWidth - (t.calloutWidth + t.calloutWidth / 2)),
                top: t.pageY + t.calloutHeight + t._OFFSET
            }
        },
        northwest: function(t) {
            return {
                left: t.pageX - (t.calloutWidth + t.calloutWidth / 2),
                top: t.pageY + t.calloutHeight + t._OFFSET
            }
        },
        southwest: function(t) {
            return {
                left: t.pageX - (t.calloutWidth + t.calloutWidth / 2),
                top: t.pageY - (t.calloutHeight + t._OFFSET) - t.tooltipHeight
            }
        },
        southeast: function(t) {
            return {
                left: t.pageX - (t.tooltipWidth - (t.calloutWidth + t.calloutWidth / 2)),
                top: t.pageY - (t.calloutHeight + t._OFFSET) - t.tooltipHeight
            }
        },
        defaultFn: function(t) {
            return i.north(t, t.calloutHeight, t.calloutWidth)
        }
    };

    function k(t) {
        t.tooltipWidth = w.outerWidth(), t.tooltipHeight = w.height();
        if (t._OFFSET = 10, !w) return !1;
        var o = w.find(".ui-ztooltip-callout");
        t.calloutWidth = o.outerWidth(), t.calloutHeight = o.outerHeight();
        var e = i[h.callout];
        return e || (e = i.defaultFn), e(t)
    }

    function F(t) {
        w && ("html" === h.contentType && h.isContentElementId && c(w).find("#" + h.content).appendTo("body").hide(), c(w).remove(), w = void 0)
    }

    function O(t, o, e, i) {
        if (o && e) {
            var n, a = e.top - this._documentEle.scrollTop(),
                l = e.left - this._documentEle.scrollLeft(),
                u = l + o.width(),
                s = a + o.height(),
                r = void 0;
            if (u >= this._windowWidth ? (e.left = this._windowWidth - (o.outerWidth(!0) + 5), e.left + o.width() - i.offset().left <= 15 && (h.callout = "east"), r = h.callout) : l < 0 && (e.left = e.left + 5 - l, i.offset().left + i.width() - this._documentEle.scrollLeft() <= 20 && (h.callout = "west"), r = h.callout), s >= this._windowEle.height() ? (e.top = i.offset().top - o.outerHeight() - 9, r = "south", n = a) : a < 0 && (e.top = i.offset().top + i.outerHeight() + 9, r = "north", n = a), r) ! function(t, o, e, i, n, a, l) {
                var u = h.callout ? h.callout : o;
                switch (o) {
                    case "north":
                        u = "south" == u ? "north" : "southeast" == u ? "northeast" : "southwest" == u ? "northwest" : u;
                        break;
                    case "south":
                        u = "north" == u ? "south" : "northeast" == u ? "southeast" : "northwest" == u ? "southwest" : u;
                        break;
                    case "west":
                        u = "east" == u ? "west" : u;
                        break;
                    case "east":
                        u = "west" == u ? "east" : u
                }(function(t, o, e, i, n, a, l, u) {
                    if (e) {
                        h.callout = o;
                        var s = e.position();
                        u && ((s = H(o, e)) || (s = e.position())), "east" === o || "west" === o ? (s = H(o, e), a = _(a, c(t.target), i, n)) : "northwest" === o || "northeast" === o || "southwest" === o || "southeast" === o ? s = H(o, e) : l < 0 ? (s.left = i.width() / 2 - e.outerWidth() / 2 + l - 5, s.left <= 10 && (s.left = 10)) : (s.left = i.width() / 2 - e.outerWidth() / 2 + (l - a.left), i.width() - s.left <= 20 && (s.left = i.width() - 20)), s && e.css(s)
                    }
                })(t, u, e, i, o, n, a, l)
            }(t, r, o.find(".ui-ztooltip-callout"), o, e, l, n)
        }
        return e
    }
    c.fn.ztooltip = function(t, o, e) {
        var i = c(this);
        b = c.extend({}, y, "object" == typeof t && t), i.data("z-ztooltip") ? "remove" === t && F() : (n(i), i.data("z-ztooltip", !0))
    }, c.fn.ztooltip.remove = F, !$Support.isMobileWidth() && $Support.isIframeContentLoaded() && c(document).ztooltip()
});
LSDragDrop = {
    onDropEvent: function(e, i, a) {
        if (-1 != e) try {
            i.preventDefault();
            var t = a || i.dataTransfer.files;
            this.nooffiles = t.length, this.pos = 0, this.uploadFile(e, t)
        } catch (e) {}
    },
    uploadFile: function(a, t, e, i) {
        var o = this,
            s = (new Date).getTime(),
            n = null != e ? e : "chat_attachment",
            l = {
                progress: function(e, i) {
                    $UI.showUploadProgress({
                        fileobj: t[o.pos - 1],
                        prgval: e,
                        msgid: i,
                        att_type: n
                    }, a)
                },
                complete: function() {
                    r()
                },
                success: function() {
                    r()
                }
            };

        function r() {
            if ($UI.hideUploadProgress(s), $Support.Util.handleCallbacks("chat.file", {}), o.pos < o.nooffiles && (s = (new Date).getTime(), o.uploadFileUsingPost(a, t, o.pos, l, s), o.pos++), "voice_message" === n) {
                var e = $Support.chidmappinglist[a];
                $Support.Util.closeEmbed(ZSIQConversationManager.getChatWinObjById(e))
            }
        }
        o.uploadFileUsingPost(a, t, o.pos, l, s, n, i), o.pos++
    },
    getFormData: function(e, i) {
        var a = new FormData;
        return $.each(e, function(e, i) {
            a.append(e, i)
        }), a
    },
    uploadFileUsingPost: function(e, i, a, t, o, s, n) {
        try {
            var l = i[a],
                r = this,
                p = $Support.EmbedObj;
            if ("image/svg+xml" == l.type || window.ZSIQFileUpload && !ZSIQFileUpload.isWhitelistedFileType(l)) {
                var d = i && 1 == i.length ? "fileupload.invalid" : "filesupload.invalid.ignore";
                return ZSIQConversationManager.getChatWinObjById(e).showBanner(LSResource.getRealValue(d), !0), r.pos++, void t.success()
            }
            var c = null != s ? s : "chat_attachment";
            if (l.size <= 52428800) {
                var u = {
                    chid: e,
                    dname: p.visitorname,
                    mod: "att",
                    sid: LSMessanger.getSid(),
                    lsid: p.livelsid,
                    sender: p.vwmsid,
                    msgid: o,
                    file1: l,
                    att_type: c
                };
                "voice_message" == c && (u.m_id = n);
                var g = r.getFormData(u);
                try {
                    CommonUtil.handleFileUpload({
                        callbacks: t,
                        formdata: g,
                        type: l.type,
                        msgid: o
                    })
                } catch (e) {}
                return
            }
            var f = l.name;
            if (f = null == f || null == f ? "file1" : f, r.pos = a + 1, null == i[r.pos] && null == i[r.pos]) return $UI.showBanner(LSResource.getRealValue("infomsg.filesharing.sizeexceed", f + ",50"), !0), void $UI.hideUploadProgress(o);
            if (!confirm(LSResource.getRealValue("infomsg.filesharing.sizeexceedproceednext", f + ",50"))) return;
            r.uploadFileUsingPost(e, i, r.pos, t, o)
        } catch (e) {}
    }
};
var PasteImage = {};
PasteImage = {
    isUser: !1,
    setIsUser: function(e) {
        this.isUser = e
    },
    onPaste: function(e, t) {
        if ($Support.isChatExist()) {
            if (this.txtarea = t || null, window.clipboardData && window.clipboardData.getData("Text")) return e.preventDefault(), this.insertText(i);
            var a = (e.originalEvent || e).clipboardData;
            if (a) {
                e.preventDefault();
                var n = a.items;
                n && this.handlePaste(n);
                var i = a.getData("text/plain");
                if (i && 0 == this.files.length) return this.insertText(i)
            }
            return !1
        }
    },
    getHTMLTemplet: function() {
        return this.isUser ? "<div id='fileintex-FILEINDEX' purpose='fileupload' CLASS><input type='text' value='' class='file-name' purp='name'/><div id='pasteimage' class='pasteimage'></div><textarea class='pasteimgcomment' id='pasteimgcomment' purp='comment' placeholder='" + LSResource.getRealValue("transferchat.comment.placeholder") + "'></textarea></div>" : $EmbedManger.UI.getPrevHTML()
    },
    getEmbPrevHTML: function() {
        return '<div id="fileintex-FILEINDEX" purpose="fileupload"><div class="imgshr_head txtelips" title="' + getEncodedText(Support.attendername) + '">' + LSResource.getRealValue("common.sharewith", getEncodedText(Support.attendername)) + '</div><input type=\'text\' value=\'\' class=\'file-name\' purp=\'name\'/><div class="embd_pstimgdiv" id="pasteimage"></div><textarea id="pasteimgcomment" purp="comment" placeholder="' + LSResource.getRealValue("common.comment.placeholder") + '"></textarea><div class="pstimg_btns"><span id="uploadimage" class="txtelips strtbtn drkdclr">' + LSResource.getRealValue("banner.share") + '</span><span id="cancelupload" class="txtelips cnsl">' + LSResource.getRealValue("common.cancel") + "</span></div></div>"
    },
    getHTML: function() {
        for (var e = "<div class='pstimg-main' id='pstimg-main'>", t = this.files.length, a = 2 < t ? "class='mult-imgs mrgn-bt18'" : 2 == t ? "class='mult-imgs'" : "", n = 0; n < t; n++) {
            var i = this.getHTMLTemplet();
            e += i = (i = i.replace(/FILEINDEX/g, n)).replace(/CLASS/g, a)
        }
        return e + "</div>"
    },
    insertText: function(e) {
        var t = document.getSelection();
        return window.clipboardData ? (document.selection.createRange().pasteHTML(e), !0) : !!(document.queryCommandEnabled("insertText") && 0 < t.rangeCount && document.execCommand("insertText", !1, e))
    },
    checkAndShowUI: function() {
        if (0 < this.files.length) {
            if (this.isUser) return void this.showPortalUI();
            $EmbedManger.UI.showPasteUI()
        }
    },
    handlePaste: function(e) {
        this.files = [], itemlen = e.length;
        for (var a = this, n = function(e) {
                var t = e.getElementsByTagName("img");
                t && 0 == t.length && (a.files = [])
            }, t = function(e) {
                var t = document.createElement("DIV");
                t.innerHTML = e, n(t)
            }, i = function(e) {
                var t = document.createElement("DIV");
                t.innerTEXT = e, n(t)
            }, s = 0; s < itemlen; s++) {
            var r = e[s].type,
                l = e[s].kind,
                o = e[s].getAsFile();
            /^image\/.+$/.test(r) && o && this.files.push(o), $Support.isMacOS() || (r && "text/plain" == r && l && "string" == l ? e[s].getAsString(i) : e[s].getAsString(t))
        }
        this.checkAndShowUI()
    },
    updateDetailes: function(e) {
        for (var t = 0, a = this.files, n = a.length; t < n; t++) {
            var i = a[t],
                s = i.name,
                r = "",
                l = e.find("#fileintex-" + t);
            s || (s = this.generateName(i, t));
            var o = s.lastIndexOf("."); - 1 !== o ? r = s.substring(o) : o = s.length, s = (s = (s = s.substring(0, o)).replace(/[`~!\$%\^&\|\\\"<>\?\/]/g, "-")).substring(0, 100), this.Filename = s, this.ext = r, l.attr("fileextn", r), l.find(".file-name").val(s), l.find("#pasteimgcomment").focus(), this.bindHandler(l), this.setPreview(l, i)
        }
    },
    bindHandler: function(e) {
        e.find(".file-name").on("blur", function() {
            "" != $(this).val() ? PasteImage.Filename = $(this).val() : $(this).val(PasteImage.Filename)
        }).on("keydown", function() {
            $(this).removeClass("bdrbot_red")
        })
    },
    generateName: function(e, t) {
        var a = e.type,
            n = a.substring(a.indexOf("/") + 1, a.length);
        return "Image - " + this.getcurrTime() + "." + n
    },
    getcurrTime: function() {
        var e = new Date,
            t = "",
            a = e.getHours(),
            n = e.getMinutes(),
            i = 12 < a ? a - 12 : 0 == a ? "12" : a;
        return t += (i < 10 ? "0" : "") + i, t += (n < 10 ? ":0" : ":") + n, t += 12 <= a ? " PM" : " AM"
    },
    showEmbedUI: function(e) {
        var t = $("#embedcontainer").find(".flcontainer"),
            a = this.getHTML();
        t.find(".pstimg-main").remove(), t.append(a).find(".pstimg-main").show(), t.find("#uploadimage").on("click", function() {
            PasteImage.uploadImage(t)
        }), t.find("#cancelupload").on("click", function() {
            PasteImage.hideUI()
        }), this.updateDetailes(t)
    },
    validate: function(e) {
        for (var t = 0, a = PasteImage.files.length; t < a; t++) {
            var n = e.find("#fileintex-" + t),
                i = n.find("[purp='name']"),
                s = n.find("[purp='comment']"),
                r = $.trim(i.val());
            if (/^[`~!\$%\^&\|\\\"<>\?\/]$/.test(r) || "" == r) return !1;
            if (100 < r.length) return !1;
            if (200 < s.val().length) return !1
        }
        return !0
    },
    uploadImage: function(e) {
        if (PasteImage.validate(e)) {
            for (var t = 0, a = PasteImage.files, n = {}, i = []; t < a.length; t++) {
                var s = a[t],
                    r = [],
                    l = e.find("#fileintex-" + t),
                    o = l.find("[purp='name']").val(),
                    m = this.comment = l.find("[purp='comment']").val(),
                    d = l.attr("fileextn");
                r.push(s), r.push(t + 1 + "_" + o + d), "" !== m && (n[t + 1] = m), i.push(r)
            }
            this.handleUploadAjax(i, n), $EmbedManger.UI.hidePasteUI()
        }
    },
    handleUploadAjax: function(a, e) {
        var t = {},
            n = this.isUser,
            i = "";
        if ("upload.do" === (n ? "upload.do" : "upload.ls") && (t = lsnocachefix("json", !0)), t.chid = n ? WindowHandler.getCurrentWinChatID() : $EmbedManger.getChatID(), t.dname = n ? CurrentUser.getDisplayname() : $EmbedManger.getVisitorName(), t.mod = "att", t.sid = n ? LSMessanger.getSid() : $EmbedManger.getLiveSupportID(), t.comment = JSON.stringify({}), 0 != getObjectSize(e) && (t.comment = JSON.stringify(e)), n) {
            var s = $("#" + t.chid).find("#chatstatus");
            s.text(LSResource.getRealValue("infomsg.sharingfiles"))
        } else t.lsid = $EmbedManger.getLiveSupportID(), t.sender = $EmbedManger.getvwmsid(), t.msgid = i = (new Date).getTime();
        t = this.getFormData(t, "file1", a);
        var r = !n && $EmbedManger.isNewEmbed,
            l = {
                progress: function(e, t) {
                    r && $UI.showUploadProgress({
                        fileobj: a[0][0],
                        prgval: e,
                        msgid: t,
                        filename: PasteImage.Filename + PasteImage.ext,
                        comment: PasteImage.comment
                    })
                },
                complete: function() {
                    r && $UI.hideUploadProgress(i)
                },
                success: function() {
                    r ? PasteImage.isUser && s.text("") : $UI.hideUploadProgress(i)
                }
            };
        try {
            CommonUtil.handleFileUpload({
                callbacks: l,
                formdata: t,
                type: a.type,
                msgid: i
            })
        } catch (e) {}
    },
    isFileorBlob: function(e) {
        return e instanceof Blob
    },
    getFormData: function(e, t, a) {
        var n = new FormData;
        for (var i in e) n.append(i, e[i]);
        for (var s = 0, r = a.length; s < r; s++) {
            var l = a[s];
            this.isFileorBlob(l[0]) && n.append(t, l[0], l[1])
        }
        return n
    },
    showPortalUI: function(e) {
        var t = Visitors.getVisitorName(WindowHandler.getVistorID(WindowHandler.getCurrentWinChatID())),
            a = $(this.txtarea),
            n = Dialog.show({
                title: LSResource.getRealValue("common.sharewith", getEncodedText(t)),
                desc: this.getHTML(),
                i18n: !1,
                ok: {
                    text: LSResource.getRealValue("banner.share"),
                    callback: function() {
                        PasteImage.uploadImage(n), a.focus()
                    }
                },
                cancel: {}
            }).addClass("pasteimg_srn").center();
        this.updateDetailes(n)
    },
    hideUI: function() {
        $("#pstimg-main").fadeOut(300, function() {
            $(this).remove()
        }), $(this.txtarea).focus()
    },
    setPreview: function(e, t) {
        var a = new FileReader,
            n = e.find("#pasteimage");
        a.onload = function(e) {
            n.html('<img src="' + e.target.result + '" />')
        }, a.readAsDataURL(t)
    },
    handlepasteimage: function(e) {
        var t = parseInt(e.attr("mcount")),
            a = t - e.val().length,
            n = a < 0 ? " redtxt" : "",
            i = a < 0 ? LSResource.getRealValue("common.count.error", "" + t) : a + " ";
        e.parent().find(".messagecount").show().removeClass("redtxt").addClass(n).text(i)
    }
};