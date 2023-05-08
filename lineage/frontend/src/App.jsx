import { TwitterFollowCard } from './TwitterFollowCard'

import ('./App.css')


function App() {
  return (
    <section className='App'>
      <TwitterFollowCard account='midudev' name='Miguel Durán' isFollowing={true} avatar='midudev'/>
      <TwitterFollowCard account='grddev' name='Juan Garrido Troche' isFollowing={false} avatar='pheralb'/>
      <TwitterFollowCard account='elonmusk' name='Elon Musk' isFollowing={true} avatar='elonmusk'/>
      <TwitterFollowCard account='vanderHarst' name='Vander Harst' isFollowing={true} avatar='vanderHarst'/>
    </section>
  )
}

export default App
