import {createSlice} from '@reduxjs/toolkit';

export const channelInfo = createSlice({
  name: 'channelInfo',
  initialState: {
    channelInfo: {
      meetId: '',
      mode:0
    },
  },
  reducers: {
    setMeetId: (state, action) => {
      state.channelInfo.meetId = action.payload;
    },
    setCameraMode: (state, action) => {
      state.channelInfo.cameraMode = action.payload;
    },
    setMicPermission: (state, action) => {
      state.channelInfo.micPermission = action.payload;
    },
    setCameraPermission: (state, action) => {
      state.channelInfo.cameraPermission = action.payload;
    },
    setMode: (state, action) => {
        state.channelInfo.mode = action.payload;
      },
  },
});

export const {setCameraMode, setMeetId, setCameraPermission, setMicPermission,setMode} =
  channelInfo.actions;

export default channelInfo.reducer;
