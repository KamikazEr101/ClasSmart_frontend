// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 后端错误码映射（基于 BizExceptionEnum 和 ResultCodeEnum）
const ERROR_MAP = {
    500: '服务器内部错误，请稍后重试或联系管理员',
    700: '模型生成过程中出现了错误',
    1001: '服务器繁忙，请求频率超限',
    1002: '检测到异常流量，IP已被封禁一段时间',
    1003: '文件过大, 不能超过 50 MB', 
    400: '请求参数错误，请检查输入',
    default: '请求出错，请稍后重试'
};

const handleApiError = (response, defaultMessage) => {
    if (!response.ok) {
        if (response.status === 500) {
            throw new Error(ERROR_MAP[500]);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};

export const uploadLitterImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append('litterImage', image);

        const response = await fetch(`${API_BASE_URL}/api/litter/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await handleApiError(response, '上传图片失败');

        // 检查后端返回的 code
        if (data.code !== 200) {
            throw new Error(data.msg || ERROR_MAP[data.code] || ERROR_MAP.default);
        }

        return data; // 返回 { code, msg, data: PredictedLabelResponseDTO }
    } catch (error) {
        console.error('上传图片错误:', error);
        throw error instanceof Error ? error : new Error(error.message || ERROR_MAP.default);
    }
};

export const submitFeedback = async (imageId, feedbackLabel) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/litter/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageId,
                feedbackLabel,
            }),
        });

        const data = await handleApiError(response, '反馈提交失败');

        // 检查后端返回的 code
        if (data.code !== 200) {
            throw new Error(data.msg || ERROR_MAP[data.code] || ERROR_MAP.default);
        }

        return data; // 返回 { code, msg, data: object }
    } catch (error) {
        console.error('提交反馈错误:', error);
        throw error instanceof Error ? error : new Error(error.message || ERROR_MAP.default);
    }
};