'use strict';

const { Platform, NativeModules } = require('react-native');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource.js');

const RCTAudio = NativeModules.Audio;
let nextKey = 0;

function Sound (source, onError) {
    let uri;
    if (typeof source === 'number') {
        const src = resolveAssetSource(source) || {};
        uri = src.uri;
        if (!/^http:\/\//.test(uri) && !/^file:\/\//.test(uri)) {
            if (Platform.OS === 'android') {
                uri = uri.replace(/\.[^.]*$/, '');
            } else {
                uri = 'file://' + uri;
            }
        }
    } else if (typeof source === 'object') {
        uri = source.uri;
    } else {
        uri = source;
    }

    this._filename = uri || '';
    this._loaded = false;
    this._key = nextKey++;
    this._duration = -1;
    this._numberOfChannels = -1;
    this._volume = 1;
    this._pan = 0;
    this._numberOfLoops = 0;
    RCTAudio.prepare(this._filename, this._key, (error, props) => {
        if (props) {
            console.log(props);
            if (typeof props.duration === 'number') {
                this._duration = props.duration;
            }
            if (typeof props.numberOfChannels === 'number') {
                this._numberOfChannels = props.numberOfChannels;
            }
        }
        if (error === null) {
            this._loaded = true;
        }
        onError && onError(error);
    });
}

Sound.prototype.isLoaded = function () {
    return this._loaded;
};

Sound.prototype.play = function (onEnd) {
    if (this._loaded) {
        RCTAudio.play(this._key, (successfully) => onEnd && onEnd(successfully));
    }
    return this;
};

Sound.prototype.pause = function () {
    if (this._loaded) {
        RCTAudio.pause(this._key);
    }
    return this;
};

Sound.prototype.stop = function () {
    if (this._loaded) {
        RCTAudio.stop(this._key);
    }
    return this;
};

Sound.prototype.release = function () {
    if (this._loaded) {
        RCTAudio.release(this._key);
    }
    return this;
};

Sound.prototype.getDuration = function () {
    return this._duration;
};

Sound.prototype.getNumberOfChannels = function () {
    return this._numberOfChannels;
};

Sound.prototype.getVolume = function () {
    return this._volume;
};

Sound.prototype.setVolume = function (value) {
    this._volume = value;
    if (this._loaded) {
        if (Platform.OS === 'android') {
            RCTAudio.setVolume(this._key, value, value);
        } else {
            RCTAudio.setVolume(this._key, value);
        }
    }
    return this;
};

Sound.prototype.getPan = function () {
    return this._pan;
};

Sound.prototype.setPan = function (value) {
    if (this._loaded) {
        RCTAudio.setPan(this._key, this._pan = value);
    }
    return this;
};

Sound.prototype.getNumberOfLoops = function () {
    return this._numberOfLoops;
};

Sound.prototype.setNumberOfLoops = function (value) {
    this._numberOfLoops = value;
    if (this._loaded) {
        RCTAudio.setNumberOfLoops(this._key, value);
    }
    return this;
};

Sound.prototype.getCurrentTime = function (callback) {
    if (this._loaded) {
        RCTAudio.getCurrentTime(this._key, callback);
    }
};

Sound.prototype.setCurrentTime = function (value) {
    if (this._loaded) {
        RCTAudio.setCurrentTime(this._key, value);
    }
    return this;
};

Sound.enable = function (enabled) {
    RCTAudio.enable(enabled);
};

if (Platform.OS !== 'android') {
    Sound.enable(true);
}

module.exports = Sound;
