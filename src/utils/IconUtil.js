import * as AntdIcons from '@ant-design/icons';
import React from 'react';

const allIcons = AntdIcons;



const IconUtil = {
    createIcon:(icon)=> {
        if (typeof icon === 'object') {
            return icon;
        }
        const ele = allIcons[icon];
        if (ele) {
            return React.createElement(allIcons[icon]);
        }
        return '';
    }
    ,
    getIcon:(name)=> {
        const icon = allIcons[name];
        return icon || '';
    }

}

export default IconUtil;