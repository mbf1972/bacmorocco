import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setCapturedImage(base64);
        setIsPhotoTaken(true);
        
        // Stop the stream to save battery/resources
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const retakePhoto = () => {
    setIsPhotoTaken(false);
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video md:aspect-square flex flex-col justify-center items-center group">
      {error ? (
        <div className="p-8 text-center text-white space-y-4">
          <p>{error}</p>
          <button onClick={onCancel} className="bg-slate-700 px-4 py-2 rounded-lg">Retour</button>
        </div>
      ) : (
        <>
          {!isPhotoTaken ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-6">
                <button 
                  onClick={onCancel}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-4 rounded-full text-white transition-all shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  onClick={capturePhoto}
                  className="bg-white p-6 rounded-full text-slate-900 hover:scale-110 active:scale-95 transition-all shadow-2xl ring-4 ring-white/30"
                >
                  <Camera className="w-8 h-8" />
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={capturedImage!} className="w-full h-full object-contain" alt="Captured" />
              <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-6">
                <button 
                  onClick={retakePhoto}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl text-white transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reprendre
                </button>
                <button 
                  onClick={confirmPhoto}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  <Check className="w-5 h-5" />
                  Utiliser cette photo
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
};
