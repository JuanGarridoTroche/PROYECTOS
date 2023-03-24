const EntryPhotos = ({ photos, title }) => {
  return (
    <ul>
      {photos.map((photo) => {
        return (
          <li key={photo.id}>
            <img src={`http://localhost:4000/${photo.name}`} alt={title} />
          </li>
        );
      })}
    </ul>
  );
};

export default EntryPhotos;
