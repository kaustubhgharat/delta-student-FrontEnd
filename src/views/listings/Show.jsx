import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../includes/Navbar';




export default function Show() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [review, setReview] = useState([]);
    const [rating, setRating] = useState(1); // default rating
    const [comment, setComment] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // 👈 new state


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/check-auth`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(true);
                    setCurrentUser(data.user); // 👈 get user object from backend
                } else {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                }
            } catch {
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        };
        checkAuth();
    }, []);

    const URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ If user is not logged in, show alert and redirect
        if (!isLoggedIn || !currentUser) {
            alert("You must be logged in to submit a review.");
            navigate('/login');
            return;
        }

        const formData = {
            comment,
            rating: Number(rating)
        };

        try {
            const res = await fetch(`${URL}/listings/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Review submit failed");

            const updated = await fetch(`${URL}/listings/${id}`);
            const updatedData = await updated.json();
            setListing(updatedData);
            setReview(updatedData.reviews);

            setComment("");
            setRating(1);
        } catch (err) {
            console.error("Submit review error:", err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!isLoggedIn || !currentUser) {
            alert("You must be logged in to delete a review.");
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${URL}/listings/${listing._id}/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include", // ✅ ensure session/cookie is sent
            });

            const result = await res.json(); // parse message or error

            if (res.status === 403) {
                alert("You don't have permission to delete this review.");
                return;
            } else if (res.status === 404) {
                alert("Review not found.");
                return;
            } else if (!res.ok) {
                alert("Failed to delete review. Please try again.");
                return;
            }

            // Refresh listing and reviews after deletion
            const updated = await fetch(`${URL}/listings/${listing._id}`);
            const updatedData = await updated.json();
            setListing(updatedData);
            setReview(updatedData.reviews);

            alert(result.message || "Review deleted.");
        } catch (err) {
            console.error("Error deleting review:", err);
            alert("An error occurred while deleting the review.");
        }
    };



    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${URL}/listings/${id}`, {
                method: 'DELETE',
                credentials: 'include' // ✅ Needed for session-based auth
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Listing deleted successfully");
                navigate('/listings');
            } else {
                alert("Error deleting listing: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Something went wrong");
        }
    };


    useEffect(() => {
        fetch(`${URL}/listings/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Listing not found");
                return res.json();
            })
            .then(data => {
                setListing(data);
                setReview(data.reviews);  // ✅ set reviews here
            })
            .catch(err => {
                console.error("Error fetching listing:", err);
                setListing(null);
            });
    }, [id]);



    if (listing === null) {
        return (
            <>
                <Navbar />
                <div className="text-center text-4xl text-red-600 mt-20">
                    Listing not found or an error occurred.
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-xl mx-auto mt-16 bg-white rounded-xl shadow-md ">
                <h1 className="text-2xl font-bold  text-gray-800">{listing.title}</h1>

                <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                        src={listing.image.url}
                        alt={listing.title || "Listing image"}
                        className="w-full h-72 object-cover"
                    />
                    <div className="p-3 ">
                        <p className="text-gray-700">Owned By : {listing.owner.username}</p>
                        <p className="text-gray-700">{listing.description}</p>
                        <p className="text-gray-700 font-medium">₹ {listing.price.toLocaleString("en-IN")}</p>
                        <p className="text-gray-700">{listing.location}</p>
                        <p className="text-gray-700">{listing.country}</p>
                    </div>
                    {isLoggedIn && currentUser && listing.owner._id === currentUser._id && (
                        <div className="flex justify-center gap-4 pb-1">
                            <Link
                                to={`/listings/${listing._id}/edit`}
                                className="px-4 py-2 no-underline bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Edit Listing
                            </Link>
                            <button
                                onClick={() => handleDelete(listing._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Delete Listing
                            </button>
                        </div>
                    )}


                </div>
                <hr />
                {isLoggedIn && (
                    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating (1 to 5):
                                </label>
                                <input
                                    type="range"
                                    id="rating"
                                    name="rating"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full"
                                />

                            </div>

                            <div className="mb-4">
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Comments:
                                </label>
                                <textarea
                                    id="comments"
                                    name="comments"
                                    rows="5"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}

                <hr />
                <h4>All Reviews</h4>
                {review.length === 0 ? (
                    <p className="text-gray-500 text-center mt-4">No reviews yet.</p>
                ) : (
                    review.map((r) => (
                        <div key={r._id} className="bg-white rounded-lg shadow-md p-4 my-4 transition-transform transform hover:scale-105">

                            <div className="mb-2 text-gray-700 font-semibold">
                                Author: {r.author.username}
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={i < r.rating ? "text-yellow-400" : "text-gray-300"}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-gray-600 italic mb-2">“{r.comment}”</div>
                            {isLoggedIn && currentUser && r.author._id === currentUser._id && (
                                <div className="text-right">
                                    <button
                                        onClick={() => handleDeleteReview(r._id)}
                                        className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                    ))
                )}

            </div>

        </>


    );
}
