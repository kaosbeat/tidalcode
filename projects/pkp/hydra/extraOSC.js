
function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name]) {
            callback(window[name]);
        } else {
            whenAvailable(name, callback);
        }
    }, interval);
}

whenAvailable("startOSC", function(t) {
    _osc.on("/ch3", (m) => {
        p.violindata["ch3"]["pitch"] = m.args[0]
        p.violindata["ch3"]["amp"] = m.args[1]
        p.violindata["ch3"]["count"] = m.args[2]
    })
    _osc.on("/ch4", (m) => {
        p.violindata["ch4"]["pitch"] = m.args[0]
        p.violindata["ch4"]["amp"] = m.args[1]
        p.violindata["ch4"]["count"] = m.args[2]
    })
    _osc.on("/ch5", (m) => {
        p.violindata["ch5"]["pitch"] = m.args[0]
        p.violindata["ch5"]["amp"] = m.args[1]
        p.violindata["ch5"]["count"] = m.args[2]
    })
    _osc.on("/ch6", (m) => {
        p.violindata["ch6"]["pitch"] = m.args[0]
        p.violindata["ch6"]["amp"] = m.args[1]
        p.violindata["ch6"]["count"] = m.args[2]
    })
});

