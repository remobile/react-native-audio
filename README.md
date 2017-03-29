# React Native Audio (remobile)
A audio phone number for react-native

## Installation
```sh
npm install @remobile/react-native-audio --save
```
### Installation (iOS)
* Drag RCTAudio.xcodeproj to your project on Xcode.
* Click on your main project file (the one that represents the .xcodeproj) select Build Phases and drag libRCTAudio.a from the Products folder inside the RCTAudio.xcodeproj.
* Look for Header Search Paths and make sure it contains both $(SRCROOT)/../../../react-native/React as recursive.

### Installation (Android)
```gradle
...
include ':react-native-audio'
project(':react-native-audio').projectDir = new File(settingsDir, '../node_modules/@remobile/react-native-audio/android')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-audio')
}
```

* register module (in MainApplication.java)

```java
......
import com.remobile.audio.RCTAudioPackage;  // <--- import

......

@Override
protected List<ReactPackage> getPackages() {
   ......
   new RCTAudioPackage(),            // <------ add here
   ......
}

```

## Usage

### Example
```js
var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
} = ReactNative;


var Button = require('@remobile/react-native-simple-button');
var Audio = require('@remobile/react-native-audio');

module.exports = React.createClass({
    play() {
        if (this.player) {
            this.player.stop();
            this.player.release();
            this.player = null;
        } else {
            this.player = new Audio('file:///sdcard/1.mp3', (error) => {
                if (!error) {
                    this.player.play(()=>{
                        this.player.release();
                        this.player = null;
                    });
                } else{
                    Toast('播放失败');
                }
            });
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.play}>
                    play
                </Button>
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});
```

### method
- `isLoaded()`
- `enable()`
- `play(onEnd)`
- `stop()`
- `release()`
- `getDuration()`
- `getNumberOfChannels()`
- `getVolume()`
- `setVolume(volume)`
- `getPan(volume)`
- `setPan(pan)`
- `getNumberOfLoops()`
- `setNumberOfLoops(times)`
- `getCurrentTime()`
- `setCurrentTime(time)`
