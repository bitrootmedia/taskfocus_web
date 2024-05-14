import {useToast} from 'vue-toastification'
import moment from "moment";
import axios from "axios";
import {useRouter} from "vue-router";
import {useCookies} from "vue3-cookies";

const toast = useToast()
const {cookies} = useCookies()
const router = useRouter()

const invalidToken = 'Invalid token.'


export const convertHumanTime = (seconds) => {
    seconds = parseInt(seconds)
    return Math.floor(moment.duration(seconds, 'seconds').asHours()) + 'h ' + moment.duration(seconds, 'seconds').minutes() + 'm ' + moment.duration(seconds, 'seconds').seconds() + 's';
}

export const convertDate = (date) => {
    return moment(date).format("YYYY-MM-DD")
}

export const convertDateTime = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

export const convertDateTimezone = (date) => {
    return moment(date).zone('+0000').format("YYYY-MM-DD HH:mm:ss")
}

export const convertTimeAgo = (date) => {
    return moment(date).fromNow()
}

export const convertDayDiff = (date) => {
    if (!date) return '-'

    const currentDate = moment(date, "YYYY-MM-DD");
    const now = moment().format('YYYY-MM-DD');
    return Math.ceil(moment.duration(currentDate.diff(now)).asDays()) + ' days';
}

export const convertDayDiffCon = (date) => {
    if (!date) return '-'

    const currentDate = moment(date, "YYYY-MM-DD");
    const now = moment().format('YYYY-MM-DD');
    return Math.ceil(moment.duration(currentDate.diff(now)).asDays());
}

const replacer = (matched) => {
    let withProtocol = matched

    if (!withProtocol.startsWith("http")) {
        withProtocol = "http://" + matched
    }

    return `<a class="text-link underline text-blue-500" target="_blank" href="${withProtocol}">${matched}</a>`
}

export const convertHtml = (content) => {
    const linkRegex = /(https?\:\/\/)?(www\.)?[^\s]+\.[^\s]+/g
    const modifiedStr = content.replace(linkRegex, replacer)
    return modifiedStr
}


export const catchErrors = (e) => {
    if (e.response.status === 403 && e.response.data.detail === invalidToken) {
        cookies.remove('task_focus_token')
        cookies.remove('task_focus_user')
        delete axios.defaults.headers.common['Authorization'];
        toast.error(invalidToken);
        setTimeout(() => {
            window.location = '/'
        }, 500)
        return
    }

    if (e.response?.data?.non_field_errors && e.response?.data?.non_field_errors[0]) {
        return toast.error(e.response?.data?.non_field_errors[0]);
    }

    if (e.response?.data?.detail) {
        return toast.error(e.response.data.detail);
    }

    if (typeof e.response?.data === 'object' && Object.keys(e.response?.data).length) {
        return Object.keys(e.response?.data).forEach((i) => {
            toast.error(`${i}: ${e.response?.data[i]}`);
        })
    }

    if (e?.message) return toast.error(e.message);

    return toast.error('Something went wrong')
}

export const pusherEventNames = {
    'comment_created': 'comment_created'
}
