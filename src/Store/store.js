import { configureStore } from '@reduxjs/toolkit'
import channelInfo from "./channelInfo";

export const store = configureStore({
    reducer: {
        channelInfo:channelInfo
    },
})