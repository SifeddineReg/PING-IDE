import './leaderboard.css'
import React from 'react';

export function Leaderboard()
{
    return(    
        <>
        <div className="container podium">
        <div className="podium__item">
            <p className="podium__city">Annecy</p>
            <img src='src/assets/second_place.png' className='image_podum'></img>
            <div className="podium__rank second">
                <div className="podium__rank second_point">50pt</div>
            </div>
        </div>
        <div className="podium__item">
            <p className="podium__city">Saint-Gervais</p>
            <img src='src/assets/first_place.png' className='image_podum'></img>
            <div className="podium__rank first">
            <div className="podium__rank second_point">50pt</div>
            </div>
        </div>
        <div className="podium__item">
            <p className="podium__city">Clermont-Ferrand Essentielle</p>
            <img src='src/assets/third_place.png' className='image_podum'></img>
            <div className="podium__rank third">
            <div className="podium__rank third_point">50pt</div>
            </div>
        </div>
        </div>
        <div className='podium_member'>
            <div className='podium_member align'>
                <p className='podium_member place'> 4 </p>
                <img src='src/assets/first_place.png' className='podium_member image'></img>
                <p className='podium_member name'>Full name</p>
            </div>
            <div className='podium_member points'> 46 pts</div>
        </div>
        <div className='podium_member'>
            <div className='podium_member align'>
                <p className='podium_member place'> 5 </p>
                <img src='src/assets/second_place.png' className='podium_member image'></img>
                <p className='podium_member name'>Full name 2</p>
            </div>
            <div className='podium_member points'> 50 pts</div>
        </div>
        <div className='deadline_text' > Deadline : 01/07/2024 21:42 </div>
        <div className="image-container">
            <img src="src/assets/second_place.png" alt="Medal"></img>
        </div>
        </>
    )
}

// export default Leaderboard;