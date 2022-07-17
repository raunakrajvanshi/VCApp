import React, {useState} from 'react';
import {View, StyleSheet, Text,Image,TouchableOpacity} from 'react-native';

const ToolBox = ({onHangupPress,switchCamera,isMicOn,onToggleMicrophone}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);


  const onToggleCamera = () => {
    setIsCameraOn(currentValue => !currentValue);
  };

 
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={switchCamera} style={styles.iconButton}>
      <Image style={styles.imageStyle} source={require('../../../Assets/switch-camera.png')} />
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={onToggleCamera} style={styles.iconButton}>
      <Image style={styles.imageStyle} source={isCameraOn?require('../../../Assets/camera-off.png'):require('../../../Assets/camera-on.png')} />
      </TouchableOpacity> */}

      <TouchableOpacity onPress={onToggleMicrophone} style={styles.iconButton}>
      <Image style={styles.imageStyle} source={!isMicOn?require('../../../Assets/mic-off.png'):require('../../../Assets/mic-on.png')} />
      </TouchableOpacity>

      
      <TouchableOpacity onPress={onHangupPress}   style={[styles.iconButton, {backgroundColor: '#ff5252'}]}>
      <Image style={styles.imageStyle} source={require('../../../Assets/phone-hang-up.png')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#3d3d3d',
    padding: 15,
    paddingBottom: 35,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    height: 60,
    width:60,
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle:{
      height:30,
      width:30
  }
});

export default ToolBox;
