import Pusher from "pusher-js";
import {onUnmounted, ref} from "vue";
import config from "../config";

export const usePusher = () => {
    const pusher = ref(null)
    const channel = ref()
    const events = ref([])

    const initPusher = () => {
        if (pusher.value) return
        pusher.value = new Pusher(config.PUSHER_APP_ID, {
            wsHost: config.PUSHER_HOST,
        });
    };

    const bindEvent = (eventName, callback) => {
        if (channel.value) {
            channel.value.bind(eventName, (data) => {
                events.value.push({ event: eventName, data });
                callback(data);
            });
        }
    };

    const setPusherChannel = (name) => {
        if (!pusher.value) initPusher()
        channel.value = pusher.value.subscribe(name);
    }

    if (pusher.value){
        pusher.value.connection.bind('connected', () => {
            console.log('Connected');
        });

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

    }
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
        pusher, channel, events, setPusherChannel, bindEvent, initPusher
    }
}