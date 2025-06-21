import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../includes/Navbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFortAwesome } from '@fortawesome/free-brands-svg-icons'; // ✅ correct source

import { faFire, faBed, faMountainCity, faMountain, faPersonSwimming,faTents,faTractor ,faSnowflake, faIgloo, faShip} from '@fortawesome/free-solid-svg-icons';


export default function Listings() {
    const [alllistings, setAllListings] = useState([]);
    const URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);


    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch(`${URL}/listings`, {
                    method: 'GET', // ✅ use GET
                    credentials: 'include' // ✅ needed to maintain session
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    alert("Error: " + errorData.error);
                    return;
                }

                const data = await res.json();
                setAllListings(data);
            } catch (err) {
                console.error("Network error:", err);
                alert("Something went wrong while fetching listings.");
            }
        };

        fetchListings();
    }, []);


    return (
        <>

            <Navbar></Navbar>
            <div className='pt-14 flex text-center justify-center m-2 space-x-16 '>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faFire} />
                    </div>

                    <p>Tranding</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faBed} />
                    </div>

                    <p>Rooms</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faMountainCity} />
                    </div>

                    <p>Iconic Cities</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faMountain} />
                    </div>

                    <p>Mountains</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faFortAwesome} />
                    </div>

                    <p>Castles</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faPersonSwimming} />
                    </div>

                    <p>Amazing pools</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faTents} />
                    </div>

                    <p>Camping</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faTractor} />
                    </div>

                    <p>Farms</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faSnowflake} />
                    </div>

                    <p>Arctic</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faIgloo} />
                    </div>

                    <p>Domes</p>
                </div>
                <div className='hover:opacity-30 hover:cursor-pointer'>
                    <div>
                        <FontAwesomeIcon icon={faShip} />
                    </div>

                    <p>Boats</p>
                </div>

            </div>
            <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ' >
                {alllistings.map((listing) => (
                    <Card sx={{ maxWidth: 345 }} key={listing._id} className='hover:opacity-85'>
                        <CardActionArea>
                            <a href={`/listings/${listing._id}`}><CardMedia className='rounded-xl h-80 '
                                component="img"
                                height="140"
                                image={listing.image.url}
                                alt={listing.title || "Listing image"}
                            /></a>
                            <CardContent>
                                <Typography className=' font-semibold' gutterBottom variant="" component="div">
                                    {listing.title || "No title"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <span>₹</span>  {listing.price || "No description available"} / night
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}


            </ul>
        </>
    );
}
