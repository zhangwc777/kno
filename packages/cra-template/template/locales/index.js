import messages_en from './messages/en/index';
import layout_en from './layout/en/index';
import base_en from './base/en/index';
import messages_zh from './messages/zh/index';
import layout_zh from './layout/zh/index';
import base_zh from './base/zh/index';

export default {
    zh: {
        //中文
        ...messages_zh,
        ...layout_zh,
        ...base_zh,
    },
    en: {
        //英语
        ...messages_en,
        ...layout_en,
        ...base_en,
    },
    // "es": {//西班牙
    // },
    // fr: {//法语

    // },
    // de: {//德语

    // },
    // ja: {//日语

    // },
    // ru: {//俄语

    // },
    // ko: {//韩语

    // },
    // pt: {//葡萄牙语

    // },
    // it: {//意大利语

    // },
    // nl: {//荷兰语

    // },
    // sv: {//瑞典语

    // },
    // el: {//希腊语

    // },
    // pl: {//波兰语

    // },
    // tr: {//土耳其语

    // }
};
