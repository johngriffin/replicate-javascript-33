import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Replicate from 'replicate'; 

const API_KEY = ''; // Replace with your Replicate AI API key
const MODEL_ID = 'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608'; // Replace with the ID of the model you want to use

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []); 

  const takePicture = async () => {
    if (camera) {
      console.log('takepictire')
      const data = await camera.takePictureAsync(null)
      setImage(data.uri);
      const output = await doReplicate();
      setDescription(output);
    }
  }
  
  const doReplicate = async () => {
    console.log('do replicate');

 
      console.log('API_KEY ===', API_KEY, Replicate);
      const replicate = new Replicate({
        auth: API_KEY,
      })

      console.log('replicate ===', replicate);

      // const output = await replicate && replicate.run(
      //   "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608",
      //   {
      //     input: {
      //       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
      //     }
      //   }
      // );

      return true;
    

    
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return ( 
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'} />
      </View>
      <Button
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  description: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10
  }
})
