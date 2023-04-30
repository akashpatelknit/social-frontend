import React, { useState, useRef, useEffect } from 'react';
import './PostShare.css';
import { UilScenery } from '@iconscout/react-unicons';
import { UilPlayCircle } from '@iconscout/react-unicons';
import { UilLocationPoint } from '@iconscout/react-unicons';
import { UilSchedule } from '@iconscout/react-unicons';
import { UilTimes } from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/UploadAction';
import { useSetState } from '@mantine/hooks';

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  // const loading = useSelector((state) => state.postReducer.uploading);
  const [loading ,setloading]=useState(false)
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const desc = useRef();
  const imageRef=useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(() => {

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    // if there is an image with post
    console.log('image' ,image)
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append('name', fileName);
      data.append('file', image);
      newPost.image = imgUrl;
      // console.log('newPost',newPost);
      // console.log('data',data)
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(uploadPost(newPost));
    resetShare();
  }, [imgUrl]);

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setloading(true)
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'mynewapp');
    data.append('cloud_name', 'dcgqtiqoh');
    // console.log('first')
    fetch('https://api.cloudinary.com/v1_1/dcgqtiqoh/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(image);
        setImgUrl(data.url);
        setloading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Reset Post Share
  const resetShare = () => {
    setImage(null);
    desc.current.value = '';
  };
  return (
    <div className="PostShare">
      <img
        src={
          user.profilePicture
            ?user.profilePicture
            : serverPublic + 'defaultProfile.png'
        }
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: 'var(--photo)' }}
            onClick={() => imageRef.current.click()}
          >
 
              <UilScenery />
            Photo
          </div>

          <div className="option video" style={{ color: 'var(--video)' }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option location" style={{ color: 'var(--location)' }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option shedule" style={{ color: 'var(--shedule)' }}>
            <UilSchedule />
            Shedule
          </div>
          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'uploading' : 'Share'}
          </button>

          <div style={{ display: 'none' }}>
            <input type="file" ref={imageRef} onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
