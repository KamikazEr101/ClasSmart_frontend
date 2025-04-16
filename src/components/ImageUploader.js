import React from 'react';
import { Upload, FolderOpen} from 'lucide-react';

const ImageUploader = ({ onImageSelect, previewUrl, resetForm }) => {
    return (
        <div className="mb-6">
            <label className="block text-gray-500 text-sm font-bold mb-2 text-center">
                上传垃圾图片
            </label>
            <div className="flex items-center justify-center">
                {previewUrl ? (
                    <div className="relative w-full">
                        <img
                            src={previewUrl}
                            alt="预览"
                            className="w-full h-64 object-contain border rounded-lg"
                        />
                        <button
                            onClick={resetForm}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">点击上传图片</span> 或拖放
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (最大 50MB)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={onImageSelect}
                        />
                    </label>
                )}
            </div>

            {/* 上传选项按钮组 */}
            {!previewUrl && (
                <div className="mt-4 flex justify-center space-x-4">
                    <label className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer">
                        <FolderOpen className="w-5 h-5 mr-2" />
                        <span>从相册选择</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onImageSelect}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;