function WMSSessionConfig() {}
WMSSessionConfig.CHAT = 1, WMSSessionConfig.CHAT_PRESENCE = 2, WMSSessionConfig.PRESENCE_PERSONAL = 4, WMSSessionConfig.PRESENCE_ORG = 8, WMSSessionConfig.LOADBALANCED = 16, WMSSessionConfig.MP = 32, WMSSessionConfig.CROSS_PRD = 64, WMSSessionConfig.MULTI_DISPATCH = 128, WMSSessionConfig.REUSE_SESSION = 256, WMSSessionConfig.TRANSIENT_PEX = 512, WMSSessionConfig.APPNOTIFY = 1024;
var _WMSAUTHTOKEN, _WMSAUTHSCOPE, _WMSZAID, _WMSPOTYPE, _WMSOAUTHTOKEN, _WMSOAUTHORGSCOPE, _WMSOAUTHUSERSCOPE, _WMSOAUTHOPRSCOPE, _WMSRTCATOKEN, wmsCountDownTimer, WM_TICKET = "IAMAGENTTICKET",
    WM_D = "zoho.com",
    WM_SAMED = !1,
    WM_FD = !1,
    WM_C = "15",
    _WMSCONT = "wms",
    wms_op = -1 != navigator.userAgent.indexOf("Opera"),
    wms_sf = -1 != navigator.userAgent.indexOf("Safari"),
    wms_ie = !wms_op && /msie/i.test(navigator.userAgent),
    lfromstatic = !1,
    wmsjsversion = "v60",
    _WMS_NODOMAINCHANGE = !1,
    _WMSSST = !1,
    _RETRYREGINTERVAL = 1e4,
    iswmsframemonitorrunning = !1,
    iswmsframeloaded = !1,
    retryregistertimer = null,
    wmsdebuginfo = [],
    _WMS_RETRY_COUNT = 0,
    wmsUserConfig = {},
    _WMS_LP = "false",
    _NEWCLIENTPORTAL_AUTHENTICATION = !1;

function push(e) {
    WmsLite.push(e), setTimeout(function() {
        WmsLite.updateClientDebugStore(e)
    }, 1)
}

function getPrd() {
    return WmsLite.prd
}

function getWmsConfig() {
    return WM_C
}

function getUserName() {
    return WmsLite.uname
}

function getNickName() {
    return WmsLite.nname
}

function getZuid() {
    return WmsLite.zuid
}

function getUserId() {
    return WmsLite.uid
}

function getSid() {
    return WmsLite.sid
}

function getRawSid() {
    return WmsLite.rsid
}

function isReconnecting() {
    return WmsLite.reconnecting
}

function disablewms() {
    WmsLite.disable()
}

function isdisablewms() {
    return WmsLite.disablewms
}

function goOffline() {}

function getWmsContacts() {
    return {}
}

function updateWmsContacts() {}

function getWmsXA() {
    return WmsLite.XA
}

function WmsLite() {}

function getWMSOAuthCredentials() {
    return {
        token: _WMSOAUTHTOKEN,
        orgscope: _WMSOAUTHORGSCOPE,
        userscope: _WMSOAUTHUSERSCOPE,
        oprscope: _WMSOAUTHOPRSCOPE
    }
}

function getWMSRTCAccessToken() {
    return _WMSRTCATOKEN
}

function getNewClientPortalAuthentication() {
    return _NEWCLIENTPORTAL_AUTHENTICATION
}

function populateSpecialWMSAnnouncement(e) {
    WmsLite.populateSpecialWMSAnnouncement(e)
}

function isLongPollingForced() {
    return _WMS_LP
}

function _getAuthType() {
    return WmsLite.authtype
}

function getAuthToken() {
    return _WMSAUTHTOKEN
}

function getAuthScope() {
    return _WMSAUTHSCOPE
}

function getZAID() {
    return _WMSZAID
}

function nocachefix() {
    return "&nocache=" + (new Date).getTime()
}! function() {
    var r = [];

    function a() {
        return "**********"
    }

    function u(e) {
        e && e.linkdetails && (e.linkdetails.cliq_message && e.linkdetails.cliq_message.msg && (e.linkdetails.description = e.linkdetails.cliq_message.msg = a(), e.linkdetails.cliq_message.meta && e.linkdetails.cliq_message.meta.opr_replydetails && c(e.linkdetails.cliq_message.meta)), "rich" == e.linkdetails.linktype && (e.linkdetails.description = a()))
    }

    function c(e) {
        if (e && e.opr_replydetails) {
            var t = e.opr_replydetails;
            "20" == t.mtype && t.addinfo && t.addinfo.comment ? t.addinfo.comment = a() : t.msg && (t.msg = a())
        }
    }

    function l(e) {
        "string" == typeof e.msg && (e.msg = a()), e.notification_text && (e.notification_text = a()), e.meta && (u(e.meta), c(e.meta))
    }
    WmsLite.updateClientDebugStore = function(e) {
        var t = JSON.parse(JSON.stringify(e));
        if (1e3 <= r.length && r.shift(), t.timestamp = (new Date).getTime(), t.mtype) {
            if ("12" === t.mtype) {
                if (t.msg && (t.msg.msg = a(), t.msg.notification_text && (t.msg.notification_text = a()), t.msg.msglist))
                    for (var i in t.msg.msglist) l(t.msg.msglist[i])
            } else if ("20" === t.mtype) t.msg && (t.msg.comment = a(), t.msg.msg && (t.msg.msg.comment = a()));
            else if ("66" === t.mtype || "64" === t.mtype) {
                if (t.msg && t.msg.msg) {
                    for (var i in t.msg.msg) {
                        var s = t.msg.msg[i];
                        s.msg && l(s.msg)
                    }
                    "string" == typeof t.msg.msg && (t.msg.msg = a()), t.msg.notification_text && (t.msg.notification_text = a())
                }
            } else if ("50" == t.mtype) {
                var n = t.msg.uc || t.msg.ac;
                for (var o in n) {
                    var m = n[o].lmhash;
                    "20" == (m = JSON.parse(m)).mtype || "64" == m.mtype && "att" == m.__module ? m.msg && m.msg.comment && (m.msg.comment = a()) : "12" != m.mtype && "66" != m.mtype && "64" != m.mtype || (m.msg = a()), m.meta && (u(m.meta), c(m.meta)), m = JSON.stringify(m), n[o].lmhash = m
                }
            } else "23" == t.mtype && t.msg && t.msg.s && (t.msg.s = t.msg.s.replace(/([a-z0-9]([a-z0-9_\-.+]*)@([a-z0-9_\-.]*)(\.[a-z]{2,30}(\.[a-z]{2}){0,2}))/g, a()));
            t.msg && t.msg.meta && (u(t.msg.meta), c(t.msg.meta))
        }
        r.push(t)
    }, WmsLite.getClientDebugStore = function() {
        return r
    }
}(), WmsLite.jsstaticdomain = "js.zohocdn.com", WmsLite.bsettings = {}, WmsLite.network_info = {}, WmsLite.getDebugInfo = function() {
        return wmsdebuginfo
    }, WmsLite.updateDebugInfo = function(e) {
        "string" == typeof e ? (e += ";;" + (new Date).getTime(), 300 <= wmsdebuginfo.length && wmsdebuginfo.splice(0, 1), wmsdebuginfo.push(e)) : wmsdebuginfo = e
    }, WmsLite.setOAuthCredentials = function(e, t, i, s) {
        _WMSOAUTHTOKEN = e, _WMSOAUTHORGSCOPE = t || _WMSOAUTHORGSCOPE, _WMSOAUTHUSERSCOPE = i || _WMSOAUTHUSERSCOPE, _WMSOAUTHOPRSCOPE = s || _WMSOAUTHOPRSCOPE, "function" == typeof WmsLite.updateOAuthCredInBridge && WmsLite.updateOAuthCredInBridge()
    }, WmsLite.init = function() {
        function t(e) {
            var t = JSON.parse(e.data),
                i = t.opr,
                s = t.params;
            "push" === i ? push.apply(null, s) : "serverup" === i ? WmsLite.serverup.apply(null, s) : "serverdown" === i ? WmsLite.serverdown.apply(null, s) : "updateDebugInfo" === i ? WmsLite.updateDebugInfo.apply(null, s) : "disablewms" === i && disablewms()
        }
        return function() {
            if (_WMS_NODOMAINCHANGE || wms_op || WM_SAMED || !(!wms_ie || wms_ie && WM_FD) || (document.domain = WM_D), void 0 !== document.querySelector) {
                var e = document.querySelector('script[src*="ichat"][src*="wmslite"]');
                e && !e.getAttribute("isdev") && (WmsLite.jsstaticdomain = e.src.split("/")[2])
            }
            this.lastconnect = -1, this.disablewms = !1, WmsLite.offline = !1, WmsLite.initcountdown = !0, WmsLite.isCrossOriginAllowed() && (WmsLite.triggerbind = function() {
                var e = {
                    opr: "triggerbind",
                    params: {
                        zuid: WmsLite.zuid,
                        rawsid: WmsLite.rsid,
                        sid: WmsLite.sid
                    }
                };
                WmsLite.pconnectframe.contentWindow.postMessage(JSON.stringify(e), "*")
            }, window.removeEventListener("message", t), window.addEventListener("message", t))
        }
    }(), WmsLite.isCrossOriginAllowed = function() {
        if (WmsLite.crossoriginallowed && "$" === this.zuid.charAt(0)) return !0
    }, WmsLite.allowCrossOrigin = function(e) {
        WmsLite.crossoriginallowed = !0, WmsLite.hosturl = e
    }, WmsLite.reconnect = function(e, t, i) {
        null != i && 1 == i && (this.reconnecting = !1), 1 != this.reconnecting && (this.reconnecting = !0, null == this.retry && (this.retry = 0), this.retry++, setTimeout(function() {
            WmsLite.registerWms(WmsLite.prd, WmsLite.zuid, WmsLite.uname, null, !0, !0)
        }, e), this.serverdown())
    }, WmsLite.registerZuid = function(e, t, i, s) {
        this.registerWms(e, t, i, null, s)
    }, WmsLite.setIamTicketName = function(e) {
        WM_TICKET = e
    }, WmsLite.setConfig = function(e) {
        WM_C = e
    }, WmsLite.setDomain = function(e) {
        WM_D = e
    }, WmsLite.useSameDomain = WmsLite.enableCustomDomain = function() {
        WM_SAMED = !0
    }, WmsLite.forceDomainChange = function() {
        WM_FD = !0
    }, WmsLite.setNoDomainChange = function() {
        _WMS_NODOMAINCHANGE = !0
    }, WmsLite.setNewClientPortalAuthentication = function() {
        _NEWCLIENTPORTAL_AUTHENTICATION = !0
    }, WmsLite.setRTCAccessToken = function(e) {
        _WMSRTCATOKEN = e
    }, WmsLite.registerAnnon = function(e, t, i, s) {
        WmsLite.authtype = 4, WmsLite.registerannonuser = !0, WmsLite.register(e, t, i, s)
    }, WmsLite.register = function(e, t, i, s, n, o, m, r, a) {
        if ("undefined" == typeof JSON) {
            var u = document.createElement("script"),
                c = window.location.protocol,
                l = "https:" === c ? wmsjsversion + "_https" : wmsjsversion;
            u.type = "text/javascript", u.src = c + "//" + this.jsstaticdomain + "/ichat/" + l + "/js/0ea6dc8b_json2.min.js", document.body.appendChild(u), WmsLite.attachonload.call(u, d)
        } else d();

        function d() {
            _WMSAUTHSCOPE = o, _WMSZAID = m, _WMSPOTYPE = r, (_WMSAUTHTOKEN = n) && _WMSAUTHSCOPE && (WmsLite.authtype = 1), _WMSAUTHTOKEN && _WMSZAID && (WmsLite.authtype = 8), _WMSZAID && WmsLite.tokenpairauth && (WmsLite.authtype = 10), _WMSOAUTHTOKEN && (WmsLite.authtype = 9), _WMSRTCATOKEN && (WmsLite.authtype = 13), WmsLite.registerWms(e, t, null, i, s, null, a)
        }
    }, WmsLite.attachonload = function(e) {
        void 0 !== this.readyState ? this.onreadystatechange = function() {
            "loaded" != this.readyState && "complete" != this.readyState || e.call(this)
        } : this.onload = function() {
            e.call(this)
        }
    }, WmsLite.enablePreconnectToWMS = function(e) {
        WmsLite.preconnect_wms_domain = e
    }, WmsLite.setNetworkDetails = function(e) {
        return WmsLite.network_info.id = e.id, WmsLite.network_info.user_id = "o-" + WmsLite.prd + "-" + e.id + "-" + WmsLite.zuid, WmsLite.network_info.url = e.url, WmsLite.network_info.details = e.details, WmsLite.network_info.user_id
    }, WmsLite.enableCrossOriginIsolation = function() {
        WmsLite.crossoriginisolation = !0
    }, WmsLite.registerWms = function(e, t, i, s, n, o, m) {
        if (WmsLite.preconnect_wms_domain) {
            var r = document.createElement("link");
            r.href = "https://" + WmsLite.preconnect_wms_domain, r.rel = "preconnect", document.head.appendChild(r)
        }
        if (this.prd = e, this.uname = null != i && null != i ? i : "", this.zuid = null != t && null != t ? t : "", this.zuid = this.zuid && m ? this.setNetworkDetails(m) : this.zuid, _WMS_RETRY_COUNT++, WmsLite.updateDebugInfo("onRegister. Tab ID: " + window.getWmsTabId() + " count: " + _WMS_RETRY_COUNT), void 0 === WmsLite.authtype && WmsLite.enableTokenPairAuth(), void 0 === this.nname && (this.nname = null != s && null != s ? s : ""), null == o && this.init(null != n && n), this.pconnectframe = document.getElementById("pconnect"), !this.pconnectframe) {
            var a = document.createElement("iframe");
            a.name = "wmspconnect", a.id = "pconnect", a.style.display = "none", document.body.appendChild(a), this.pconnectframe = document.getElementById("pconnect")
        }
        var u = "" != this.zuid ? this.zuid : this.uname,
            c = "";
        WmsLite.network_info.url && (c = "/" + (c = "/" === WmsLite.network_info.url[0] ? WmsLite.network_info.url.slice(1) : WmsLite.network_info.url));
        var l = "/" + _WMSCONT + c + "/pconnect.sas?settings=true&prd=" + this.prd + "&uname=" + u + "&samedomain=" + WM_SAMED + nocachefix() + "&config=" + WM_C + "&wmscont=" + _WMSCONT + "&nodomainchange=" + _WMS_NODOMAINCHANGE + "&retrycount=" + _WMS_RETRY_COUNT + "&tabid=" + window.getWmsTabId();
        lfromstatic && (l += "&staticdomain=" + WmsLite.jsstaticdomain + "&staticversion=" + wmsjsversion), _WMSSST && (l += "&sst=true"), WmsLite.tokenpairauth && (l += "&tokenpair=true"), WmsLite.crossoriginallowed && (l += "&crossorigin=true"), WmsLite.hosturl && (l = WmsLite.hosturl + l), WmsLite.frameorigin && (l += "&frameorigin=" + WmsLite.frameorigin), WmsLite.fp_hash && (l += "&hash=" + WmsLite.fp_hash["wmsbridge.js"].split("_")[0]), _WMSZAID && (l += "&zaid=" + _WMSZAID), _WMSPOTYPE && (l += "&potype=" + _WMSPOTYPE), WmsLite.crossoriginisolation && (l += "&coi=true"), this.pconnectframe.src = l, iswmsframeloaded = !1, WmsLite.scheduleWMSFrameMonitor()
    }, WmsLite.scheduleWMSFrameMonitor = function() {
        iswmsframemonitorrunning || (iswmsframemonitorrunning = !0, WmsLite.updateDebugInfo("Started frame monitor"), clearTimeout(retryregistertimer), retryregistertimer = setTimeout(function() {
            WmsLite.registerMonitor()
        }, 6 * _RETRYREGINTERVAL))
    }, WmsLite.registerMonitor = function() {
        WmsLite.offline = !0, WmsLite.updateDebugInfo("Retry triggered from frame monitor"), WmsLite.isReuseSession() ? WmsLite.retryRegister() : WmsLite.initReconnect()
    }, WmsLite.retryRegister = function() {
        WmsLite.isReuseSession() && !op && top.WmsLite.offline || WmsLite.reconnect(0, "Retry Register", !0), clearTimeout(retryregistertimer), retryregistertimer = setTimeout(function() {
            WmsLite.registerMonitor()
        }, _RETRYREGINTERVAL)
    }, WmsLite.initReconnect = function(e, t) {
        WmsLite.offline = !0;
        var i = !!WmsLite.initcountdown;
        (WmsLite.initcountdown = !1) === iswmsframeloaded ? WmsLite.reconnectTimer(i, WmsLite.retryRegister, e, t) : WmsLite.reconnectTimer(i, WmsLite.triggerbind, e, t)
    }, WmsLite.retryConnection = function() {
        iswmsframemonitorrunning ? WmsLite.forceRegister() : WmsLite.forceReconnect()
    }, WmsLite.forceRegister = function() {
        WmsLite.initcountdown = !0, WmsLite.retryRegister()
    }, WmsLite.forceReconnect = function() {
        WmsLite.initcountdown = !0, WmsLite.triggerbind()
    }, WmsLite.reconnectTimer = function() {
        var o = [30, 60, 90, 120],
            m = 0;

        function r(e, t) {
            return e = +e, t = +t, Math.floor(Math.random() * (t - e + 1) + e)
        }
        return window.addEventListener("online", function() {
                m = -1
            }),
            function(e, t, i, s) {
                e ? o[m = 0] = r(5, 30) : m < o.length - 1 && m++;
                var n = o[m];
                i && (n = r(i, s = s || i)), WmsLite.countDown(n, t)
            }
    }(), WmsLite.countDown = function(t, i) {
        clearTimeout(wmsCountDownTimer),
            function e() {
                setTimeout(function() {
                    "function" == typeof WmsliteImpl.reconnectionCountDown && WmsliteImpl.reconnectionCountDown(t)
                }, 1);
                if (0 === t) return clearTimeout(wmsCountDownTimer), void i();
                t--;
                wmsCountDownTimer = setTimeout(e, 1e3)
            }()
    }, WmsLite.isReuseSession = function() {
        return (WM_C & WMSSessionConfig.REUSE_SESSION) == WMSSessionConfig.REUSE_SESSION
    }, WmsLite.clearWMSFrameMonitor = function(e) {
        iswmsframemonitorrunning && WmsLite.updateDebugInfo("Stopped frame monitor"), clearTimeout(retryregistertimer), WmsLite.initcountdown = !0, iswmsframemonitorrunning = !1, e && (WmsLite.offline = !1)
    }, WmsLite.setWmsContext = function(e) {
        _WMSCONT = e
    }, WmsLite.disable = function() {
        this.disablewms = !0, this.abortBind(), this.clearWMSFrameMonitor()
    }, WmsLite.push = function(t) {
        if (0 == t.mtype) {
            var e = t.msg;
            this.uid = e.uid, this.nname = e.nname, this.sid = e.sid, this.rsid = e.rsid, this.zuid = e.zuid, this.XA = e.xa, this.retry = 0, this.reconnecting = !1, WmsLite.clearWMSFrameMonitor(!0), iswmsframeloaded = !0, this.serverup(t.msg)
        } else if (-1 == t.mtype) {
            var i, s = t.msg || {};
            if (s && s.instruction) i = s.instruction.split("-")[0];
            void 0 === i && this.reconnect(10, "psdown", !0)
        } else if (-2 == t.mtype) {
            this.disable(), s = t.msg;
            try {
                WmsliteImpl.handleLogout(s.reason)
            } catch (e) {}
        } else if (-7 == t.mtype) try {
            WmsliteImpl.handleServiceMessage(t.msg)
        } catch (e) {} else if (-5 == t.mtype) {
            s = t.msg, this.disable();
            try {
                WmsliteImpl.handleAccountDisabled(s.reason), WmsliteImpl.handleAuthFailure()
            } catch (e) {}
        } else if (-16 == t.mtype) iswmsframeloaded = !0, WmsLite.clearWMSFrameMonitor();
        else if (-12 == t.mtype || -17 == t.mtype) {
            iswmsframeloaded = !1, WmsLite.scheduleWMSFrameMonitor();
            try {
                WmsliteImpl.handleAuthFailure()
            } catch (e) {}
        } else if (-10 == t.mtype) {
            wmsUserConfig.infomsgid = t.msg.id, wmsUserConfig.infomsgprd = t.prd;
            try {
                "" !== t.msg.msg ? WmsliteImpl.showAnnouncement(t.msg.msg, t.msg.type, t.msg.id) : t.msg.msg_spl ? (wmsUserConfig.infomsg = t.msg.msg_spl, wmsUserConfig.infomsgtype = t.msg.type, WmsLite.processSpecialAnnouncement(JSON.parse(wmsUserConfig.infomsg))) : WmsliteImpl.hideAnnouncement()
            } catch (e) {}
        } else if (38 == t.mtype)
            if (t.msg && "updatewmssettings" === t.msg.module && t.msg.data && t.msg.data.disann) {
                if (WmsLite.bsettings.disann = t.msg.data.disann, wmsUserConfig.infomsg && !0 === WmsLite.isAnnBlocked()) try {
                    WmsliteImpl.hideAnnouncement()
                } catch (e) {}
            } else if (t.msg && "presence_key_crc_update" === t.msg.module) {
            var n = t.msg.data.topic;
            WmsLite.bsettings.adminsettings.presence_keys.forEach(function(e) {
                e.topic == n && (e.header = t.msg.data.header)
            }), WmsLite.updatePresenceKeys(WmsLite.bsettings.adminsettings.presence_keys)
        } else try {
            WmsliteImpl.handleMessage(t.mtype, t.msg, null, t.prd)
        } catch (e) {
            setTimeout(function() {
                throw e
            }, 1)
        } else if (800 == t.mtype) {
            var o = t.msg,
                m = o.opr;
            "pubsub.ulist" == m ? (PubSubApi.addUsers(o.pskey, o.psid, o.ulist), PubSubImpl.handleUserList(o.pskey, o.ulist)) : "pubsub.usersubscribed" == m ? (PubSubApi.addUsers(o.pskey, o.psid, o.ulist), PubSubImpl.handleUserIn(o.pskey, o.ulist)) : "pubsub.userunsubscribed" == m ? (PubSubApi.removeUsers(o.pskey, o.psid, o.ulist), PubSubImpl.handleUserOut(o.pskey, o.ulist)) : "pubsub.message" == m && PubSubImpl.handleMessage(o.pskey, o.msg)
        } else if (43 == t.mtype) {
            var r = t.msg;
            "undefined" != typeof AcsApi && AcsApi.handlePush(r.type, r.data)
        } else if ("_" === t) WmsLite.RTT_callback(Date.now() - WmsLite.RTT_senttime);
        else {
            try {
                WmsliteImpl.handleMessage(t.mtype, t.msg, t.meta, t.prd)
            } catch (e) {
                setTimeout(function() {
                    throw e
                }, 1)
            } - 3 == t.mtype && ("undefined" != typeof AcsApi && AcsApi.handleServerUP(), _WMS_RETRY_COUNT = 0)
        }
    }, WmsLite.serverup = function(e) {
        WmsLite.initcountdown = !0, _WMS_RETRY_COUNT = 0, clearTimeout(wmsCountDownTimer), setTimeout(function() {
            try {
                WmsLite.updateDebugInfo("Called serverup"), WmsliteImpl.serverup(e), "undefined" != typeof AcsApi && AcsApi.handleServerUP()
            } catch (e) {}
        }, 100)
    }, WmsLite.serverdown = function(e, t) {
        e ? (clearTimeout(retryregistertimer), WmsLite.initReconnect(e, t)) : iswmsframemonitorrunning || WmsLite.initReconnect(), setTimeout(function() {
            try {
                WmsLite.updateDebugInfo("Called serverdown"), WmsliteImpl.serverdown()
            } catch (e) {}
        }, 100)
    }, WmsLite.setJSStaticDomain = function(e) {
        WmsLite.jsstaticdomain = e
    }, WmsLite.enableSST = function() {}, WmsLite.enableTokenPairAuth = function() {
        this.tokenpairauth = !0, this.authtype = 10
    }, WmsLite.setAuthType = function(e) {
        this.authtype = e
    }, WmsLite.setUserConfig = function(e) {
        wmsUserConfig = e
    }, WmsLite.isAnnBlocked = function() {
        var e = WmsLite.bsettings.disann,
            t = wmsUserConfig.infomsgid;
        return !(!e || !e[WmsLite.prd] && !e.All || !t) && (e[WmsLite.prd] === t || e.All === t)
    }, WmsLite.setBarSettingsValue = function(e) {
        if (WmsLite.bsettings = e, wmsUserConfig.infomsg && !1 === WmsLite.isAnnBlocked()) try {
            if (void 0 !== WmsliteImpl && WmsliteImpl.showAnnouncement) try {
                var t = JSON.parse(wmsUserConfig.infomsg);
                "true" == t.splann ? window.frameElement && "undefined" != typeof CrmPlusLib && CrmPlusLib.isLoadedInCrmplusFrame || WmsLite.processSpecialAnnouncement(t) : WmsliteImpl.showAnnouncement(wmsUserConfig.infomsg, wmsUserConfig.infomsgtype, wmsUserConfig.infomsgid)
            } catch (e) {
                WmsliteImpl.showAnnouncement(wmsUserConfig.infomsg, wmsUserConfig.infomsgtype, wmsUserConfig.infomsgid)
            }
        } catch (e) {}
        WmsLite.registerAnnonUser || setTimeout(function() {
            WmsLite.appendSMSBridge()
        }, 1)
    }, WmsLite.setChatCSRFParamName = function(e) {
        WmsLite._CHATCSRFPARAMNAME = e
    }, WmsLite.setChatCSRFCookieName = function(e) {
        WmsLite._CHATCSRFCOOKIENAME = e
    }, WmsLite.clearAnnouncement = function(e) {
        var t, i, s, n = "property=bchatsettings&key=disann&value=" + wmsUserConfig.infomsgid + "&prd=" + wmsUserConfig.infomsgprd;
        n += "&" + WmsLite._CHATCSRFPARAMNAME + "=" + (t = document.cookie, i = t.indexOf(WmsLite._CHATCSRFCOOKIENAME), s = t.indexOf("=", i) + 1, t.substring(s, t.indexOf("; ", s))) + nocachefix();
        var o = new XMLHttpRequest;
        o.onreadystatechange = e, o.open("POST", "/_chat/updwmssettings.do"), o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"), o.send(n)
    }, WmsLite.setFrameOrigin = function(e) {
        WmsLite.frameorigin = e || window.location.origin
    }, WmsLite.useLongPolling = function() {
        _WMS_LP = "true"
    }, WmsLite.getWMSRTT = function(e) {
        WmsLite.RTT_callback = e, WmsLite.RTT_senttime = Date.now(), WmsLite.triggerRTTPing()
    }, WmsLite.getIAMServiceName = function(e) {
        return WmsLite.servicelist[e]
    }, WmsLite.populateSpecialWMSAnnouncement = function(e) {
        if ("success" == e.result) {
            var t = e.response,
                i = JSON.parse(wmsUserConfig.infomsg);
            if (0 == t.banner_status) return;
            WmsliteImpl.showAnnouncement(i[t.banner_status], wmsUserConfig.infomsgtype)
        }
    }, WmsLite.processSpecialAnnouncement = function(e) {
        if (e.apiurl) {
            var t = e.apiurl + "?zuid=" + WmsLite.zuid + "&iam_service=" + WmsLite.getIAMServiceName(WmsLite.prd) + "&callback=populateSpecialWMSAnnouncement",
                i = document.createElement("script");
            i.src = t, document.body.appendChild(i)
        }
    }, WmsLite.enableSMSBridge = function(e) {
        WmsLite.smsbridgeenabled = !0, WmsLite.smsbridgeconfig = e
    }, WmsLite.getSMSBridgeConfig = function() {
        return WmsLite.smsbridgeconfig
    }, WmsLite.appendSMSBridge = function() {
        var t = WmsLite.smsbridgeconfig;
        if (t) {
            var e = {};
            e.parts = location.hostname.split("."), e.subdomain = e.parts.shift(), e.uplvldom = e.parts.join("."), e.server = "https://phonebridge." + e.uplvldom, null != t.smsDomain && "" != t.smsDomain && (e.server = t.smsDomain);
            var i = document.createElement("script");
            xhr = new XMLHttpRequest, xhr.open("GET", e.server + "/smsbridge/v3/notificationsms/sdk_meta", !0), xhr.withCredentials = !0, xhr.onreadystatechange = function() {
                if (4 === xhr.readyState) {
                    var e = JSON.parse(xhr.response);
                    i.src = "https:" + e.sdk_url, i.onload = function() {
                        SMS.init(t)
                    }, document.head.appendChild(i)
                }
            }, xhr.send(null)
        }
    },
    function() {
        var e = (new Date).getTime() + "_" + Math.floor(1e4 * Math.random());
        window.getWmsTabId = function() {
            return WmsLite.zuid + "_" + WmsLite.prd + "_" + e
        }
    }(), WmsLite.servicelist = {
        ZI: "ZohoShowtime",
        ZP: "ZohoPayments",
        ZH: "ZohoHome",
        CC: "ZohoCommandCenter",
        PY: "PayRoll",
        ZG: "Zoho Bigin",
        ZK: "ZohoInk",
        OF: "ZohoOffice",
        TI: "TeamInbox",
        ZX: "ZohoShowtimeAPI",
        RA: "ZohoRemoteAccess",
        VO: "Zoho Mail",
        ZM: "Zoho Mobile",
        SL: "DataPrep",
        WE: "ZohoWebinar",
        SZ: "ZohoSites",
        CT: "ZohoCliq",
        ZS: "ZohoSupport",
        ML: "MTACENTRAL",
        BT: "ZohoBugtracker",
        WR: "ZohoWriter",
        ST: "ZohoSheet",
        NB: "Notebook",
        RE: "Remotely",
        SW: "ZohoShow",
        ZO: "Business",
        OZ: "ZohoChat",
        PD: "ZOHOPAD",
        FO: "ZohoForms",
        ZE: "ZohoExpense",
        CP: "CRMPlus",
        IV: "ZohoInventory",
        WH: "Startwith",
        MC: "ZohoMCreator",
        ZB: "ZohoBooks",
        ZV: "ZohoInvoice",
        SB: "ZohoSubscriptions",
        CI: "ZohoCode",
        AL: "alarmsone",
        ZA: "ZohoRecruit",
        EX: "Zoho Docs",
        TD: "TeamDrive",
        PZ: "ZIAPlatform",
        AU: "Temp Staffing",
        BP: "Orchestly",
        CO: "ZohoContacts",
        CR: "ZohoCRM",
        CE: "ZohoCreator",
        PR: "ZohoProjects",
        WK: "ZohoWiki",
        CA: "ZohoCampaigns",
        MI: "MICS",
        VA: "ZohoVault",
        PB: "PhoneBridge",
        FS: "ZohoFSM",
        PT: "ZohoPilot",
        MP: "ZohoProjectsMarketPlace",
        SC: "Screenplay",
        PE: "Peopleplus",
        GC: "ZohoGC",
        PI: "ZIAPipelines",
        RS: "Solopreneur",
        IM: "ZohoIM",
        RY: "ZohoRepository",
        SD: "Service Desk Plus",
        MT: "ZohoMeeting",
        TL: "Trainercentral",
        WB: "Whiteboard",
        MU: "Murphy",
        IG: "Insights",
        MD: "MDMOnDemand",
        LE: "ZohoLens",
        FM: "ZohoDiscussions",
        AC: "AaaServer",
        CL: "ZohoCalendar",
        RM: "Remote Agent",
        SG: "ZohoSign",
        TC: "Tele Adapter - CRM",
        TS: "Tele Adapter - Support",
        SI: "Site 24 x 7",
        SR: "Zoho Store",
        ZC: "ZohoGadgets",
        IS: "Zoho Issue Tracker",
        HR: "zohopeople",
        VI: "ZohoVideo",
        ZF: "ZohoFlow",
        SE: "ZohoSearch",
        JS: "Jabber Server",
        CM: "Contacts Manager",
        MB: "Zoho Mobile Sync",
        SV: "ZohoSurvey",
        MO: "zohomotivator",
        AT: "ZohoAssist",
        ZQ: "QUOTES",
        ES: "ZohoReports",
        PG: "ZohoPlugin",
        SP: "ZohoSprints",
        BS: "zohobackstage",
        BI: "ZohoBills",
        IO: "ZohoIOT",
        ZD: "ZohoDirectory",
        ZN: "ZohoDirectory",
        PM: "PATCHMANAGER",
        BL: "BLOGS",
        RC: "RECEIPTS",
        XS: "Zoho Showtime",
        SH: "ZohoShowtime-local",
        ZT: "ZohoTax",
        AD: "DirectoryAdmin",
        CH: "CHECKOUT",
        VE: "ZohoVoice",
        MH: "ZohoMarketingHub",
        ZW: "ZohoWorkerly",
        IN: "ZohoPulse",
        DC: "DesktopCentralCloud",
        DE: "DesktopCentralMSPCloud",
        VH: "ZohoChatVijay",
        CS: "CRM SalesInbox",
        LC: "Logs360Cloud",
        CY: "ZohoCatalyst",
        ZL: "ZohoTables",
        CZ: "contracts",
        PC: "ZohoCreatorPlus",
        RP: "RemoteAccessPlusCloud",
        OA: "OfficeAPI",
        LZ: "ZohoLearn",
        SU: "shortenurl",
        NS: "ZohoBetaLens",
        TZ: "Slate",
        CU: "Cirrus",
        AS: "Activity Collation Server",
        ZR: "ZohoSocial",
        WP: "Workplace",
        WA: "WebAnalytics",
        WS: "WebStats",
        LD: "Zoho SalesIQ",
        SF: "ZohoShifts",
        HS: "HackSaw"
    }, setTimeout(function() {
        if (void 0 !== document.querySelector) {
            var e = document.querySelector('script[src*="ichat"][src*="wmslite"]');
            e && !e.getAttribute("isdev") && (WmsLite.jsstaticdomain = e.src.split("/")[2]);
            var t, i = document.createElement("link"),
                s = WmsLite.fp_hash ? WmsLite.fp_hash["wmsbridge.js"] : "wmsbridge.js";
            t = WmsLite.fp_hash ? "https://" + WmsLite.jsstaticdomain + "/ichat/js/" + s : "https://" + WmsLite.jsstaticdomain + "/ichat/" + wmsjsversion + "_https/js/" + s, i.href = t, i.rel = "preload", i.as = "script", document.head.appendChild(i)
        }
    }, 1);
wmsjsversion = "Mar_27_2023_3";

function WmsliteImpl() {}
WmsliteImpl.serverdown = function() {}, WmsliteImpl.serverup = function() {}, WmsliteImpl.handleLogout = function(e) {}, WmsliteImpl.handleMessage = function(e, t) {}, WmsliteImpl.handleAccountDisabled = function(e) {}, WmsliteImpl.handleServiceMessage = function(e) {}, WmsliteImpl.reconnectionCountDown = function(e) {}, WmsliteImpl.showAnnouncement = function(e, t, i) {}, WmsliteImpl.hideAnnouncement = function() {}, WmsliteImpl.handleAuthFailure = function() {};
var lfromstatic = !0;
WmsLite.fp_hash = {
    "wmsbridge.js": "8f2be8b7_wmsbridge.js"
}