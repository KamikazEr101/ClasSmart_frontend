import React from 'react';
import { AlertCircle, AlertTriangle, Ban } from 'lucide-react';

// 错误类型到图标和样式的映射
const ERROR_TYPE_CONFIG = {
    500: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', title: '服务器错误' },
    700: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', title: '模型错误' },
    1001: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', title: '请求频率超限' },
    1002: { icon: Ban, color: 'bg-gray-100 text-gray-700', title: 'IP被封禁' },
    1003: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', title: '文件大小超限' },
    1004: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', title: '文件为空' },
    1005: { icon: AlertCircle, color: 'bg-red-100 text-red-700', title: '非法文件' },
    default: { icon: AlertCircle, color: 'bg-red-100 text-red-700', title: '错误' }
};

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    // 尝试从消息中提取错误码（假设消息格式可能包含后端返回的 code）
    let errorCode = 'default';
    let displayMessage = message;

    // 如果 message 是对象（如后端返回的 JSON），尝试解析
    if (typeof message === 'object' && message !== null) {
        displayMessage = message.msg || '未知错误';
        errorCode = message.code || 'default';
    } else if (typeof message === 'string') {
        // 尝试从字符串中提取后端可能的错误码
        const codeMatch = message.match(/(\d{3,4})/);
        if (codeMatch) {
            errorCode = codeMatch[0];
        }
    }

    const { icon: Icon, color, title } = ERROR_TYPE_CONFIG[errorCode] || ERROR_TYPE_CONFIG.default;

    return (
        <div className={`mt-4 p-3 ${color} rounded-md flex items-start`}>
            <Icon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm">{displayMessage}</p>
            </div>
        </div>
    );
};

export default ErrorMessage;