import React, { useState, useEffect } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import './ProfileModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { uploadImage } from '../../actions/UploadAction';
import { updateUser } from '../../actions/UserAction';

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [image, setProfileImage] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();
  const [loading ,setloading]=useState(false)

  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      event.target.name === 'profileImage'
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };
  useEffect(() => {
    let UserData = formData;
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append('name', fileName);
      data.append('file', image);
      
      UserData.profilePicture = imgUrl;
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append('name', fileName);
      data.append('file', coverImage);
      UserData.coverPicture = coverImageUrl;
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(updateUser(param.id, UserData));
    setModalOpened(false);
  }, [imgUrl,coverImageUrl]);

  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (image) {
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
    }
    if(coverImage){
    setloading(true)
      const data = new FormData();
      data.append('file', coverImage);
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
          setCoverImageUrl(data.url);
          setloading(false)
        })
        .catch((err) => {
          console.log(err);
        });
    
    }
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Your Info</h3>
        <div>
          <input
            value={formData.firstname}
            onChange={handleChange}
            type="text"
            placeholder="First Name"
            name="firstname"
            className="infoInput"
          />
          <input
            value={formData.lastname}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
            name="lastname"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.worksAt}
            onChange={handleChange}
            type="text"
            placeholder="Works at"
            name="worksAt"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.livesIn}
            onChange={handleChange}
            type="text"
            placeholder="Lives in"
            name="livesIn"
            className="infoInput"
          />
          <input
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
            name="country"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.relationship}
            onChange={handleChange}
            type="text"
            className="infoInput"
            placeholder="Relationship status"
            name="relationship"
          />
        </div>

        <div>
          Profile image
          <input type="file" name="profileImage" onChange={onImageChange} />
          Cover image
          <input type="file" name="coverImage" onChange={onImageChange} />
        </div>

        <button className="button infoButton" type="submit">
          {
            loading?"Updating...":"Update"
          }
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
