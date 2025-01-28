import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';



  
const downloadImage = (imageDataUrl: string, filename: string = 'captured-image.png') => {
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

const WebcamCapture = forwardRef((props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    
useEffect(() => {
    const video = videoRef.current;
    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing the webcam:", err);
        });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    captureImage() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const context = canvas.getContext('2d');
        console.log(video.readyState)
        if (context && video.readyState === 4) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/png');
            console.log(imageDataUrl);
            downloadImage(imageDataUrl);
        }
      }
    }
  }));




  // Webcam logic here

  return (
    <div>
     
      <video ref={videoRef} style={{width: '400px'}} muted autoPlay></video>
      <canvas ref={canvasRef} width="400" height="300" style={{border: '2px solid black'}}></canvas>
    </div>
  );
});

export default WebcamCapture;
