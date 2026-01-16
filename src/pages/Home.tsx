import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../store/hotelSlice';
import Layout from '../components/Layout';
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';

const today = new Date();
today.setHours(0, 0, 0, 0);


const searchSchema = yup.object({
    location: yup.string().required("Location is required"),
    checkIn: yup.date().required("Check-in date is required").min(today, "Check-in date must be today or later"),
    checkOut: yup.date().required("Check-out date is required").min(today, "Check-out date must be today or later").min(yup.ref("checkIn"), "Check-out date must be after check-in date"),
    guests: yup.number().required("Number of guests is required").min(1, "Number of guests must be at least 1"),
})


type SearchForm = yup.InferType<typeof searchSchema>

const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

   

    const {register , handleSubmit ,  formState: { errors },  } = useForm<SearchForm>({
        resolver: yupResolver(searchSchema),
        defaultValues : {guests : 1}
    })

    const onSubmit = (data: SearchForm) => {
    dispatch(setSearchParams(data));
    navigate('/search');
  };

    return (
        <Layout>
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl px-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
                        Your Dream Stay Awaits
                    </h1>
                    <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
                        Experience luxury like never before. Discover hand-picked hotels for your next adventure.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-5xl bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col lg:flex-row gap-4"
                >
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                            <input
                                type="text"
                                placeholder="Where to?"
                                className={`w-full h-14 pl-12 pr-4 bg-black/20 border ${errors.location ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                {...register("location")}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                            <input
                                type="date"
                                className={`w-full h-14 pl-12 pr-4 bg-black/20 border ${errors.checkIn ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white/70`}
                                {...register("checkIn")}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                            <input
                                type="date"
                                className={`w-full h-14 pl-12 pr-4 bg-black/20 border ${errors.checkOut ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white/70`}
                                {...register("checkOut")}
                            />
                        </div>
                        <div className="relative shadow-sm hover:shadow-md transition-shadow">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                            <select
                                className={`w-full h-14 pl-12 pr-4 bg-black/20 border ${errors.guests ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none text-white/70`}
                                {...register("guests")}
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <option key={n} value={n} className="bg-[#1a1a1a]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="h-14 lg:w-48 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                        Search Hotels
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </motion.form>

                {/* Feature Highlights */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {[
                        { title: 'Best Price Guarantee', icon: <ArrowRight />, desc: 'Find lower? We\'ll match it and give you more.' },
                        { title: 'Premium Selection', icon: <ArrowRight />, desc: 'Only the highest-rated properties make our list.' },
                        { title: 'Instant Booking', icon: <ArrowRight />, desc: 'Secure your stay in seconds with zero fees.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="p-6 bg-white/5 border border-white/10 rounded-3xl"
                        >
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-white/50">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
