import {useToast} from 'vue-toastification'
import moment from "moment";

const toast = useToast()


export const convertDate = (date) => {
    return moment(date).format("YYYY-MM-DD")
}

export const convertDateTime = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
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
    if (e.response?.data?.non_field_errors && e.response?.data?.non_field_errors[0]) {
        return toast.error(e.response?.data?.non_field_errors[0]);
    }

    if (e.response?.data?.detail){
        return toast.error(e.response.data.detail);
    }

    if (e?.message) return toast.error(e.message);

    return toast.error('Something went wrong')
}