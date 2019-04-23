//验证字符串是否是数字
function checkNumber(theObj) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
        return true;
    }
    return false;
}

var mergeSetting = function (settings) {
    require("settings.js");
    var leaderboardSetting = window._CCSettings;
    window._CCSettings = null;
    for (var key in leaderboardSetting.rawAssets.assets) {
        var k = key;
        var uuidIndex = checkNumber(key) ? parseInt(key) : null;
        if (uuidIndex != null) {
            var uuid = leaderboardSetting.uuids[uuidIndex];
            k = uuid;
        }
        settings.rawAssets.assets[k] = leaderboardSetting.rawAssets.assets[key];
        var asset = leaderboardSetting.rawAssets.assets[key];
        var type = leaderboardSetting.assetTypes[asset[1]];
        asset[1] = type;
        if (asset.length > 2) {
            var type = leaderboardSetting.assetTypes[asset[2]];
            asset[2] = type;
        }
    }
    settings.rawAssets.internal = settings.rawAssets.internal || {};
    for (var key in leaderboardSetting.rawAssets.internal) {
        var k = key;
        var uuidIndex = checkNumber(key) ? parseInt(key) : null;
        if (uuidIndex != null) {
            var uuid = leaderboardSetting.uuids[uuidIndex];
            k = uuid;
        }
        settings.rawAssets.internal[k] = leaderboardSetting.rawAssets.internal[key];
        var asset = leaderboardSetting.rawAssets.internal[key];
        var type = leaderboardSetting.assetTypes[asset[1]];
        asset[1] = type;
    }
    leaderboardSetting.scenes.map(function (sceneData) {
        var uuidIndex = checkNumber(sceneData.uuid) ? parseInt(sceneData.uuid) : null;
        if (uuidIndex != null) {
            var uuid = leaderboardSetting.uuids[uuidIndex];
            sceneData.uuid = uuid;
        }
        settings.scenes.push(sceneData);
    });
    for (var key in leaderboardSetting.packedAssets) {
        var packedAssets = leaderboardSetting.packedAssets[key];
        for (var i = 0; i < packedAssets.length; i++) {
            var uuidIndex = checkNumber(packedAssets[i]) ? parseInt(packedAssets[i]) : null;
            var k = packedAssets[i];
            if (uuidIndex != null) {
                var uuid = leaderboardSetting.uuids[uuidIndex];
                packedAssets[i] = uuid;
                if (!uuid) {
                    console.log("uuid is null", uuidIndex)
                }
            }
        }
        settings.packedAssets[key] = packedAssets;
    }
    return settings;
};

module.exports = mergeSetting;

