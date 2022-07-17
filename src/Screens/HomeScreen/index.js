import React, {useState} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Pressable
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setMeetId ,setMode} from '../../Store/channelInfo';
import { generateMeetCode } from '../../Common/Utils';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meetingCode = useSelector((state) => state.channelInfo.channelInfo.meetId);

  const startCall = async () => {
    // let meetId=generateMeetCode();
    // dispatch(setMeetId(meetId))
    dispatch(setMode(0))
    navigation.navigate('CallScreen'); //0 For Start 1 for Join
  };

  const joinCall=()=>{
    dispatch(setMode(1))
    navigation.navigate('CallScreen'); //0 For Start 1 for Join
  }


  return (
    <KeyboardAvoidingView style={styles.body} behavior="height">
      <SafeAreaView>
        <View style={styles.buttons}>
         
          <TouchableOpacity
               onPress={startCall}
               
              style={styles.button}>
              <View>
                <Text style={{color:"#FFFFFF"}}>Start A Call</Text>
              </View>
            </TouchableOpacity>


       
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={meetingCode}
              onChange={(e)=>{
                dispatch(setMeetId(e.target.value))
              }}
              onChangeText={(text) => dispatch(setMeetId(text))}
              placeholder='Enter Meeting ID'/>
            
            <TouchableOpacity
            onPress={joinCall}
              style={styles.button}>
              <View>
                <Text style={{color:"#FFFFFF"}}>Join A Call</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 2,
    width: 200,
    height: 200,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: '#ff7675',
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop:20
  },
  textInput: {
    width: 200,
    height: 50,
    color:'black'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7675',
    color:"#FFFFFF",
    paddingLeft:20,
    paddingRight:20,
    height: 50,
  }
});

export default HomeScreen;
