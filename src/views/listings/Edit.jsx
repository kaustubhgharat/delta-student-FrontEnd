import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../includes/Navbar';

export default function Edit() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: ''
  });
  const [imageFile, setImageFile] = useState(null); // 📷 store file
  const [existingImage, setExistingImage] = useState('');

  const { id } = useParams();
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${URL}/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();

        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          location: data.location || '',
          country: data.country || ''
        });
        setExistingImage(data.image?.url || '');
      } catch (err) {
        console.error("Error fetching listing:", err);
        navigate('/listings');
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("price", formData.price);
    updatedData.append("location", formData.location);
    updatedData.append("country", formData.country);
    if (imageFile) {
      updatedData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${URL}/listings/${id}`, {
        method: 'PUT',
        body: updatedData,
        credentials: 'include'
      });

      if (res.status === 401) {
        navigate('/login?error=You must be logged in');
        return;
      }

      if (res.ok) {
        navigate(`/listings/${id}`);
      } else {
        const error = await res.text();
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to update listing");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-14 px-4">
        <h2 className="text-2xl font-bold text-center">Edit Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {['title', 'description', 'price', 'location', 'country'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium capitalize">{field}</label>
              <input
                type={field === 'price' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full border rounded-md px-3 py-2 text-base"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-medium">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full border rounded-md px-3 py-2 text-base"
            />
            {existingImage && (
              <img src={existingImage} alt="Current" className="mt-2 h-24 rounded" />
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
