import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Button, Container, Typography } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon, Movie as MovieIcon } from '@material-ui/icons';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click To Add Logo');
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files?.[0]);
  };

  const handleLogoChange = (event) => {
    setLogoFile(event.target.files?.[0]);
  };

  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('In progress...');
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
    ffmpeg.FS('writeFile', 'logo.png', await fetchFile(logoFile));
    await ffmpeg.run('-i', 'input.mp4', '-i', 'logo.png', '-filter_complex', 'overlay=10:10', 'output.mp4');
    setMessage('Complete video processing');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  return (
    <Container maxWidth="sm" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Logo to Video
      </Typography>
      <video src={videoSrc} controls />
      <br />
      <Button
        variant="contained"
        color="primary"
        component="label"
        startIcon={<MovieIcon />}
      >
        Upload Video
        <input type="file" hidden onChange={handleVideoChange} />
      </Button>
      &nbsp;
      <Button
        variant="contained"
        color="secondary"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Upload Logo
        <input type="file" hidden onChange={handleLogoChange} />
      </Button>
      <br /><br />
      <Button
        variant="contained"
        color="primary"
        disabled={!videoFile || !logoFile}
        onClick={doTranscode}
      >
        Start
      </Button>
      <Typography variant="body1" component="p" gutterBottom>
        {message}
      </Typography>
    </Container>
  );
}

export default App;
