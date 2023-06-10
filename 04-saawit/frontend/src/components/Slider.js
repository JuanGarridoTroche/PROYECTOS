import { useState } from "react";
import "../css/Slider.css";

const Slider = ({ photos }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  // Si no hay fotos en photos (photos=[]), nos volvemos.
  if(photos.length < 1) {
    // photos=["/no-images.jpg"];
    return;
  }
  // Comprobamos cuantas fotos hay en el array. Si solo hay 1, no muestres las flechas
  const totalPhotos = photos?.length;
 
  const nextPhoto = ()=> {
    setCurrentPhoto(currentPhoto === totalPhotos - 1 ? 0 : currentPhoto + 1);
  }

  const previousPhoto = ()=> {
    setCurrentPhoto(currentPhoto === 0 ? totalPhotos - 1 : currentPhoto - 1);
  }

  return (
    <div className="container">
      {totalPhotos === 1 ? null : <button onClick={()=> {
        previousPhoto();
      }} className="arrow-previous">
        <img src="/left.svg" alt="left" />
      </button>
}
      {Array.from(photos).map((photo, index) => {
        return (
        <div key={photo.id}> {currentPhoto === index && (
          <a
              href={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${photo.name}`}
              key={photo.id}
            >
          <img src={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/${photo.name}`} key={photo} alt={photo.name} className="photos" />          
          </a>
        )}
        </div>
        )
      })}
      {totalPhotos === 1 ? null : <button onClick={()=>{
        nextPhoto();
      }} className="arrow-next">
        <img src="/right.svg" alt="right" />
      </button>
}
    </div>
  );
};

export default Slider;