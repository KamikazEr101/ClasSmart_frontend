import React, { useState } from 'react';
import { uploadLitterImage } from './services/api';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import LoadingButton from './components/LoadingButton';

const App = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // 处理图片选择
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    // 上传图片进行分类
    const handleUploadImage = async () => {
        if (!selectedImage) {
            setError('请先选择图片');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await uploadLitterImage(selectedImage);

            if (response.code === 200) {
                setResult(response.data); // 提取后端返回的 PredictedLabelResponseDTO
            } else {
                setError(response.msg || '分类失败，请重试');
            }
        } catch (err) {
            setError(err.message || '请求出错，请检查网络连接');
            console.error('上传错误:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // 重置表单
    const resetForm = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 p-4 text-white text-center">
                    <h1 className="text-2xl font-bold">灵分——垃圾智能分类识别</h1>
                </div>

                <div className="p-6">
                    {/* 图片上传区域 */}
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        previewUrl={previewUrl}
                        resetForm={resetForm}
                    />

                    {/* 图片选择后显示识别按钮 */}
                    {selectedImage && !result && (
                        <LoadingButton
                            onClick={handleUploadImage}
                            isLoading={isLoading}
                            disabled={!selectedImage}
                            loadingText="识别中..."
                            buttonText="开始识别"
                        />
                    )}

                    {/* 显示错误信息 */}
                    <ErrorMessage message={error} />

                    {/* 显示识别结果 */}
                    {result && (
                        <ResultDisplay
                            result={result}
                            onResetForm={resetForm}
                        />
                    )}
                </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm">
                © 2025 ClasSmart——灵分 - 保护环境，从分类开始
            </p>
        </div>
    );
};

export default App;