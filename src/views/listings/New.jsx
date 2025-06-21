import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../includes/Navbar';

export default function New() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [authChecked, setAuthChecked] = useState(false);

  // 🔒 Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${URL}/check-auth`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (res.status === 401) {
          navigate('/login?error=You must be logged in');
        } else {
          setAuthChecked(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate('/login?error=Login check failed');
      }
    };

    checkAuth();
  }, []);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("location", data.location);
    formData.append("country", data.country);
    formData.append("image", data.image[0]); // 👈 file input (single image)

    try {
      const res = await fetch(`${URL}/listings`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.status === 401) {
        navigate('/login?error=You must be logged in');
        return;
      }

      const result = await res.json();
      alert(result.message);
      navigate('/listings');
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong");
    }
  };


  if (!authChecked) return null; // Avoid showing form before auth check

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-14 px-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Create a New Listing</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl p-6 space-y-4" encType='multipart/form-data' noValidate>
          {[
            { label: "Title", name: "title", type: "text", placeholder: "Enter title" },
            { label: "Description", name: "description", type: "textarea", placeholder: "Enter description" },
            { label: "Price (in ₹)", name: "price", type: "number", placeholder: "Enter price" },
            { label: "Image URL", name: "image", type: "file", placeholder: "Enter image URL" },
            { label: "Location", name: "location", type: "text", placeholder: "Enter location" },
            { label: "Country", name: "country", type: "text", placeholder: "Enter country" }
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-gray-700 font-medium">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name, { required: `${field.label} is required` })}
                  placeholder={field.placeholder}
                  className={`w-full border rounded-md px-4 py-2 h-24 focus:outline-none focus:ring-2 ${errors[field.name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                />
              ) : (
                <input
                  type={field.type}
                  {...register(field.name, { required: `${field.label} is required` })}
                  placeholder={field.placeholder}
                  className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors[field.name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-600 text-sm mt-1">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
