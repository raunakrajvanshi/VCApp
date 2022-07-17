import React, {useRef, useState, useEffect} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Clipboard,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';

import firestore from '@react-native-firebase/firestore';
import ToolBox from './Toolbox';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

import {setMeetId} from '../../Store/channelInfo';

const CallScreen = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [webcamStarted, setWebcamStarted] = useState(false);
  const meetingCode = useSelector(
    state => state.channelInfo.channelInfo.meetId,
  );
  const mode = useSelector(state => state.channelInfo.channelInfo.mode);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    async function initialize() {
      try {
        if (mode === 0) {
          await startWebcam();
          startCall();
        } else {
          await startWebcam();
          joinCall();
        }
      } catch (error) {
        console.log(error);
      }
    }

    initialize();
  }, []);

  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    pc.current.addStream(local);
    setLocalStream(local);
    const remote = new MediaStream();
    setRemoteStream(remote);

    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
      console.log(pc.current.getLocalStreams());
      pc.current.getLocalStreams()[0].addTrack(track);
    });

    // Pull tracks from remote stream, add to video stream
    pc.current.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remote.addTrack(track);
      });
    };

    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    setWebcamStarted(true);
  };

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);
    console.log('ASAS', channelDoc.id);
    dispatch(setMeetId(channelDoc.id));

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({offer});

    // Listen for remote answer
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(meetingCode);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();
console.log("AS",channelData)
    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelDoc.update({answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const switchCamera = async () => {
    try {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    } catch (err) {
      console.log(err);
    }
  };

  const endCall = async () => {
    pc.current._unregisterEvents();
    pc.current.close();
    pc.current = null;
    navigation.goBack();
  };

  const toggleMic = async () => {
    try {
      const audioTrack = await localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(currentValue => !currentValue);
    } catch (err) {
      // Handle Error
    }
  };

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localStream}
          objectFit="cover"
          mirror
        />
      )}

      {remoteStream && (
        <RTCView
          streamURL={remoteStream?.toURL()}
          style={styles.remoteStream}
          objectFit="cover"
          mirror
        />
      )}

      <ToolBox
        onHangupPress={endCall}
        switchCamera={switchCamera}
        endCall={endCall}
        isMicOn={isMicOn}
        onToggleMicrophone={toggleMic}
      />

      <TouchableOpacity onPress={() => Clipboard.setString(meetingCode)}>
        <View>
          <Text style={styles.meetLink}>{meetingCode}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#f8c291',
    ...StyleSheet.absoluteFill,
  },
  localStream: {
    width: 100,
    height: 150,
    backgroundColor: '#ffff6e',
    borderRadius: 10,
    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteStream: {
    backgroundColor: '#f8c291',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },

  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  meetLink: {
    color: 'white',
    position: 'absolute',
    margin: 'auto',
    bottom: 10,
    left: '32%',
    fontSize: 16,
  },
});

export default CallScreen;
