import Pusher from "pusher-js";
import {onUnmounted, ref} from "vue";
import config from "../config";

export const usePusher = () => {
    const pusher = ref()
    const channel = ref()

    pusher.value = new Pusher(config.PUSHER_APP_ID, {
        wsHost: config.PUSHER_HOST,
    });

    const setPusherChannel = (name) => {
        channel.value = pusher.value.subscribe(name);
    }

    pusher.value.connection.bind('state_change', (states) => {
        console.log('Pusher state change', states);
    });
    pusher.value.connection.bind('connected', () => {
        console.log('Connected');
    });
    pusher.value.connection.bind('disconnected', () => {
        console.log('Disconnected');
    })
    pusher.value.connection.bind('error', (err) => {
        console.log(`Error: ${err.message}`);
    });

    // Pusher.log = (msg) => {
    //   console.log(msg,'log');
    // };

    onUnmounted(() => {
        if (pusher.value) pusher.value.disconnect();
        if (channel.value) {
            channel.value.unbind_all();
            channel.value.unsubscribe();
        }
    });

    return {
        pusher, channel, setPusherChannel
    }
}