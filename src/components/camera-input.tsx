'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { CameraOutlined, RetweetOutlined } from '@ant-design/icons';

interface CameraInputProps {
  onChange: (base64Image: string) => void;
}

export function CameraInput({ onChange }: CameraInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [shouldStartCamera, setShouldStartCamera] = useState(true);

  useEffect(() => {
    if (shouldStartCamera) {
      startCamera();
    }
    return () => stopCamera();
  }, [shouldStartCamera]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    try {
      setCapturedImage(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      //message.error('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg');
        setCapturedImage(base64Image);
        onChange(base64Image);
        setShouldStartCamera(false);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setShouldStartCamera(true);
  };

  return (
    <div className="space-y-4">
      {capturedImage ? (
        <>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="rounded-lg border border-gray-200"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
          <div className="flex justify-center">
            <Button 
              onClick={handleRetake}
              icon={<RetweetOutlined />}
              type="primary"
            >
              Retake Photo
            </Button>
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            className="rounded-lg border border-gray-200"
          />
          <div className="flex justify-center">
            <Button 
              onClick={captureImage} 
              type="primary" 
              disabled={!stream}
              icon={<CameraOutlined />}
            >
              Take Photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 