import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { submitFeedback } from '../services/api';

// 垃圾分类映射表（英文到中文）
const categoryMapping = {
    'battery': '电池',
    'bottle': '瓶子',
    'can': '罐头',
    'china': '瓷片',
    'fruit': '水果',
    'smoke': '烟头',
    'vegetable': '蔬菜',
    'brick': '砖块'
};

// 垃圾大类型映射
const hugeTypeMapping = {
    0: '可回收物',
    1: '有害垃圾',
    2: '厨余垃圾',
    3: '其他垃圾'
};

// 大类型对应的颜色
const hugeTypeColors = {
    0: 'bg-blue-100 text-blue-800', // 可回收物 - 蓝色
    1: 'bg-red-100 text-red-800',   // 有害垃圾 - 红色
    2: 'bg-green-100 text-green-800', // 厨余垃圾 - 绿色
    3: 'bg-gray-100 text-gray-800'  // 其他垃圾 - 灰色
};

const ResultDisplay = ({ result, onResetForm }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 动态生成反馈选项，基于后端返回的 predictedLabel
    const feedbackOptions = result && result.predictedLabel
        ? [
            { label: categoryMapping[result.predictedLabel] || result.predictedLabel, value: result.predictedLabel },
            ...Object.entries(categoryMapping)
                .filter(([key]) => key !== result.predictedLabel)
                .map(([value, label]) => ({ label, value }))
        ]
        : Object.entries(categoryMapping).map(([value, label]) => ({ label, value }));

    const translateCategory = (englishCategory) => {
        return categoryMapping[englishCategory] || englishCategory;
    };

    const getHugeTypeName = (typeCode) => {
        return hugeTypeMapping[typeCode] || `未知类型(${typeCode})`;
    };

    const getHugeTypeStyle = (typeCode) => {
        return hugeTypeColors[typeCode] || 'bg-gray-100 text-gray-800';
    };

    const handleSubmitFeedback = async () => {
        if (!result || !feedback) {
            setError('请选择正确的分类');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await submitFeedback(result.imageId, feedback);
            if (response.code === 200) {
                setFeedbackSubmitted(true);
            } else {
                setError(response.msg || '反馈提交失败，请重试');
            }
        } catch (err) {
            setError(err.message || '请求出错，请检查网络连接');
            console.error('反馈错误:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (value) => {
        setFeedback(value);
        setDropdownOpen(false);
    };

    const getSelectedLabel = () => {
        const option = feedbackOptions.find(opt => opt.value === feedback);
        return option ? option.label : '请选择正确的分类';
    };

    useEffect(() => {
        if (dropdownOpen && dropdownRef.current) {
            const dropdown = dropdownRef.current;
            const rect = dropdown.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.bottom > viewportHeight) {
                dropdown.style.top = 'auto';
                dropdown.style.bottom = '100%';
            } else {
                dropdown.style.top = '100%';
                dropdown.style.bottom = 'auto';
            }
        }
    }, [dropdownOpen]);

    return (
        <div className="mt-6 border rounded-lg p-4 bg-green-50">
            <h2 className="text-lg font-bold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                识别结果
            </h2>

            <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getHugeTypeStyle(result.hugeType)}`}>
                    {getHugeTypeName(result.hugeType)}
                </span>
            </div>

            <p className="text-gray-700 mb-1">
                <span className="font-semibold">图片ID:</span> {result.imageId}
            </p>

            <p className="text-gray-700 mb-4">
                <span className="font-semibold">分类结果:</span> {translateCategory(result.predictedLabel)}
                <span className="text-xs ml-1 text-gray-500">({result.predictedLabel})</span>
            </p>

            {!feedbackSubmitted ? (
                <div>
                    <h3 className="text-md font-bold mb-2">结果不准确？请提交反馈</h3>

                    <div className="mb-4 relative">
                        <div
                            className="w-full p-2 border rounded flex justify-between items-center cursor-pointer bg-white"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <span className={feedback ? 'text-gray-800' : 'text-gray-500'}>
                                {getSelectedLabel()}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                        </div>

                        {dropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-80 overflow-auto"
                            >
                                {feedbackOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${feedback === option.value ? 'bg-blue-50 text-blue-600' : ''}`}
                                        onClick={() => handleOptionSelect(option.value)}
                                    >
                                        {option.label}
                                        <span className="text-xs ml-1 text-gray-500">({option.value})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmitFeedback}
                        disabled={!feedback || isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                    >
                        {isLoading ? "提交中..." : "提交反馈"}
                    </button>
                </div>
            ) : (
                <div className="p-3 bg-blue-100 text-blue-700 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <p>感谢您的反馈！</p>
                </div>
            )}

            <button
                onClick={onResetForm}
                className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                重新开始
            </button>
        </div>
    );
};

export default ResultDisplay;