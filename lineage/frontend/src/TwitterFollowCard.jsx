

export function TwitterFollowCard ({account, name, avatar, isFollowing}) {
  const imageSrc = `https://unavatar.io/twitter/${avatar}`;
  return (
    <article className='tw-followCard' >
      <header className='tw-followCard-header'>
        <img className='tw-followCard-avatar' src={imageSrc} alt="avatar de midudev" />
        <div className='tw-followCard-info'>
          <strong>{name}</strong>
          <span className='tw-followCard-infoAccount'>@{account}</span>
        </div>
      </header>
      <aside>
      <button className='tw-followCard-button'>Seguir</button>
      </aside>
    </article>  

  )
}
