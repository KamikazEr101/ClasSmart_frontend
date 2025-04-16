/**
 * 模拟API服务，用于本地开发和测试
 */

// 模拟垃圾分类标签
const litterCategories = [
    'battery', // 电池
    'bottle',  // 瓶子
    'can',     // 罐头
    'china',   // 瓷片
    'fruit',   // 水果
    'smoke',   // 烟头
    'vegetable', // 蔬菜
    'brick'    // 砖块
];

// 模拟垃圾大类型映射
const categoryToHugeType = {
    'battery': 1,  // 有害垃圾
    'bottle': 0,   // 可回收物
    'can': 0,      // 可回收物
    'china': 3,    // 其他垃圾
    'fruit': 2,    // 厨余垃圾
    'smoke': 3,    // 其他垃圾
    'vegetable': 2, // 厨余垃圾
    'brick': 3     // 其他垃圾
};

// 模拟错误码和消息
const ERROR_RESPONSES = {
    500: { code: 500, msg: '服务器内部错误，请稍后重试', data: null },
    700: { code: 700, msg: '模型生成过程中出现了错误', data: null },
    1001: { code: 1001, msg: '服务器繁忙，请求频率超限', data: null },
    1002: { code: 1002, msg: '检测到异常流量，IP已被封禁一段时间', data: null },
    401: { code: 400, msg: '请求参数错误，请检查输入', data: null }
};

// 模拟上传API
export const mockUploadLitterImage = async (image) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 随机决定是否返回错误
    if (Math.random() < 0.1) { // 10% 概率返回错误
        const errorCodes = Object.keys(ERROR_RESPONSES).map(Number);
        const randomError = errorCodes[Math.floor(Math.random() * errorCodes.length)];
        return ERROR_RESPONSES[randomError];
    }

    // 随机选择一个分类结果
    const randomCategory = litterCategories[Math.floor(Math.random() * litterCategories.length)];

    // 获取对应的大类型
    const hugeType = categoryToHugeType[randomCategory];

    // 生成随机图片ID
    const imageId = Math.floor(Math.random() * 10000) + 1;

    // 模拟成功响应，符合 ResultPredictedLabelResponseDTO 结构
    return {
        code: 200,
        msg: '分类成功',
        data: {
            imageId: imageId,
            predictedLabel: randomCategory,
            hugeType: hugeType
        }
    };
};

// 模拟反馈API
export const mockSubmitFeedback = async (imageId, feedbackLabel) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证输入
    if (!imageId || !feedbackLabel) {
        return ERROR_RESPONSES[400];
    }

    // 随机决定是否返回错误
    if (Math.random() < 0.1) { // 10% 概率返回错误
        const errorCodes = Object.keys(ERROR_RESPONSES).map(Number);
        const randomError = errorCodes[Math.floor(Math.random() * errorCodes.length)];
        return ERROR_RESPONSES[randomError];
    }

    // 模拟成功响应，符合 ResultObject 结构
    return {
        code: 200,
        msg: '反馈提交成功',
        data: {
            success: true
        }
    };
};

// 替换API服务为模拟服务
export const setupMockApi = () => {
    console.log('🔄 使用模拟API服务进行开发');

    // 重写api.js中的函数以使用模拟数据
    window.originalUploadLitterImage = window.uploadLitterImage;
    window.originalSubmitFeedback = window.submitFeedback;

    window.uploadLitterImage = mockUploadLitterImage;
    window.submitFeedback = mockSubmitFeedback;

    console.log('✅ 模拟API设置完成');
};

// 恢复原始API服务
export const restoreRealApi = () => {
    if (window.originalUploadLitterImage && window.originalSubmitFeedback) {
        window.uploadLitterImage = window.originalUploadLitterImage;
        window.submitFeedback = window.originalSubmitFeedback;
        console.log('✅ 已恢复真实API服务');
    }
};