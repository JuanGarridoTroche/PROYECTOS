import '../css/Header.css';
import { useState } from "react"
import { Auth } from "./Auth"
import { loadNewsService } from '../services';
import { NavLink } from 'react-router-dom';

export const Header = ({setNews})=> {
  const [search, setSearch] = useState('')  
  
  
  const resetNews = async () => {
    try {
      const newsList = await loadNewsService();
      if (newsList) {
        setNews(newsList);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const searchNews = async (e) => {
    try {
      e.preventDefault();

      const queryString = `?keyword=${search}`;

      const newsList = await loadNewsService(queryString);
      if (newsList) {
        setNews(newsList);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  

  return (
    <header>
      <section className="brand">
        <NavLink to='/' onClick={()=> {
          resetNews();
        }}><img src="/logo.png" alt="logo-saawit"/></NavLink>
        <h2>sa<span style={{color:"rgb(255, 69, 0)"}}>a</span>wit</h2>
      </section>
      {/* <section>
        <img src='/home.svg' alt='home'/>
      </section> */}
      <form className='search-form' onSubmit={searchNews}>
        <input type="search" value={search} placeholder="Busca en Saawit" onChange={(e)=> {
          setSearch(e.target.value)                    
        }}/>  
        <button hidden>Buscar</button>
      </form>    
      <nav>  
        <Auth setNews={setNews}/>     
      </nav>
    </header>
  )
}